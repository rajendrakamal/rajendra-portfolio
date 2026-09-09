---
title: La modélisation dbt pour des données fintech à fort volume transactionnel
date: 2026-08-10
excerpt: Les transactions par carte et les soldes de compte ne pardonnent pas une modélisation bâclée comme le ferait un tableau de bord marketing. Quelques modèles dbt, avec du vrai SQL à l'appui, font la différence entre des chiffres auxquels on fait confiance et des chiffres auxquels on cesse discrètement de croire.
tags: [dbt, Data Modeling, Fintech]
---

La plupart des équipes de données finissent par adopter une version de la structure en couches staging, intermediate et marts que dbt encourage. Dans bien des domaines, cette structure n'est qu'une bonne habitude organisationnelle, quelque chose qui garde le projet ordonné. Dans la fintech grand public, où les données brutes sont des transactions par carte, des soldes de compte et des paiements récurrents, elle cesse d'être une simple habitude et devient porteuse. Se tromper ne coûte pas un intervenant confus en mêlée quotidienne. Ça coûte un client qui regarde son propre solde et n'y fait pas confiance.

Je veux passer en revue quelques modèles qui reviennent sans cesse dès qu'on modélise sérieusement des données transactionnelles, avec du vrai SQL plutôt que juste la théorie.

## Staging : résister à l'envie de faire quoi que ce soit d'ingénieux

La couche staging pour les données transactionnelles devrait être presque ennuyeuse. Renommer les colonnes, convertir les types, uniformiser les horodatages sur un seul fuseau horaire, et dédupliquer. Ce dernier point compte plus ici que dans la plupart des domaines, parce que les réseaux de cartes et les processeurs de paiement relancent les webhooks et rejouent les événements après un délai d'attente dépassé. Il est tout à fait normal de recevoir la même autorisation deux fois avec des métadonnées légèrement différentes. Un modèle staging qui ne s'en prémunit pas va discrètement compter les dépenses en double quelque part en aval, et honnêtement, ce n'est généralement pas détecté avant qu'un client remarque que son solde est erroné, avant même qu'un analyste s'en aperçoive.

```sql
-- models/staging/stg_transactions.sql

with source as (
    select * from {{ source('core', 'transactions') }}
),

deduplicated as (
    select
        *,
        row_number() over (
            partition by transaction_id
            order by updated_at desc
        ) as row_num
    from source
)

select
    transaction_id,
    account_id,
    card_id,
    amount_cents,
    merchant_category_code,
    authorized_at,
    settled_at,
    status
from deduplicated
where row_num = 1
```

Rien ici n'est ingénieux, et c'est voulu. Pas de catégorisation, pas de jointures avec les données de compte, pas de totaux cumulatifs. Le seul rôle de cette couche est de remettre aux modèles en aval une version propre, dédupliquée, une ligne par transaction, des données sources, à laquelle ils peuvent faire confiance sans avoir à la revérifier eux-mêmes.

## Intermediate : là où les calculs monétaires doivent être exacts

C'est ici que les transactions sont jointes aux comptes et aux cartes, que les dépenses sont catégorisées par type de commerçant, et que les soldes cumulatifs commencent à prendre forme. C'est aussi ici que le problème d'idempotence apparaît sous sa forme la plus aiguë. Un modèle qui calcule un solde cumulatif en additionnant les transactions doit être conçu de façon à ce que retraiter la même journée de données deux fois produise le même solde, pas le double.

Les transactions arrivant en retard rendent cela plus difficile qu'il n'y paraît. Une autorisation de carte peut se régler deux ou trois jours après avoir eu lieu, et un modèle incrémental qui ne regarde que les lignes plus récentes que la dernière exécution peut discrètement manquer une transaction qui arrive en retard avec un horodatage plus ancien. La solution à laquelle je reviens toujours est une fenêtre de rattrapage, où chaque exécution retraite les derniers jours plutôt que seulement ce qu'il y a de plus récent.

```sql
-- models/intermediate/int_transactions_enriched.sql

{{
  config(
    materialized='incremental',
    unique_key='transaction_id',
    incremental_strategy='merge'
  )
}}

select
    t.transaction_id,
    t.account_id,
    t.amount_cents,
    t.settled_at,
    c.category_group
from {{ ref('stg_transactions') }} as t
left join {{ ref('merchant_category_map') }} as c
    on t.merchant_category_code = c.merchant_category_code

{% if is_incremental() %}
where t.settled_at >= (
    select dateadd('day', -5, max(settled_at)) from {{ this }}
)
{% endif %}
```

Cette fenêtre de cinq jours n'est pas un chiffre magique, elle doit simplement être plus large que le délai réaliste que prennent les transactions les plus lentes à se régler. Utiliser `transaction_id` comme clé de fusion est ce qui empêche une ligne retraitée de devenir une ligne dupliquée plutôt qu'une mise à jour.

## Marts : construire autour d'une question, pas d'une table

La couche marts est l'endroit où beaucoup d'efforts de modélisation sont discrètement gaspillés sur des tables qui reflètent le système source au lieu de répondre à une vraie question posée par quelqu'un. Le solde dans le temps. Les dépenses par catégorie. Les paiements récurrents détectés. Chacun de ces éléments correspond à une vraie question que quelqu'un en aval va poser, dans un tableau de bord ou une conversation avec le soutien. Une couche marts qui ne fait que réexposer « transactions » et « comptes » sous forme de tables légèrement plus propres n'a pas vraiment fait le travail de traduction qui rend une couche sémantique utile.

## Les tests doivent inclure le rapprochement, pas seulement l'hygiène

Les tests `not_null` et `unique` sont la base. Ils attrapent de vrais problèmes, mais ce sont des vérifications d'hygiène, pas des vérifications de confiance. Les données financières ont besoin d'une seconde catégorie de test qui demande si les chiffres s'additionnent réellement correctement.

```sql
-- tests/assert_balances_reconcile.sql

with computed_balance as (
    select
        account_id,
        sum(amount_cents) as computed_balance_cents
    from {{ ref('int_transactions_enriched') }}
    group by account_id
),

reported_balance as (
    select
        account_id,
        balance_cents
    from {{ ref('stg_account_balances') }}
)

select
    r.account_id,
    r.balance_cents as reported_balance_cents,
    c.computed_balance_cents,
    abs(r.balance_cents - c.computed_balance_cents) as discrepancy_cents
from reported_balance as r
join computed_balance as c
    on r.account_id = c.account_id
where abs(r.balance_cents - c.computed_balance_cents) > 100
```

Un test singulier dbt retourne simplement des lignes pour tout ce qu'il considère comme un échec, alors ici, tout compte dont l'écart dépasse un dollar fait échouer la construction. Ce type de test n'existe pas dans la plupart des modèles de données non financières, principalement parce que la plupart des données non financières n'ont pas de vérité de référence vérifiable indépendamment, comme le fait un grand livre. En fintech, c'est habituellement le cas, et sauter cette vérification signifie simplement que la première personne à détecter un écart est un client plutôt qu'une suite de tests, ce qui est exactement à l'envers de la façon dont on souhaite l'apprendre.

## La couche de modélisation est la couche de confiance

Rien de tout cela n'est exotique, honnêtement. Les modèles en couches, les stratégies incrémentales avec fenêtre de rattrapage, les tests de rapprochement, ce sont tous des modèles dbt plutôt standards une fois qu'on les a construits quelques fois. Ce qui change dans un contexte fintech, c'est à quel point il y a peu de marge pour se tromper. Un tableau de bord qui est erroné de quelques pourcents à cause d'une mauvaise jointure est agaçant dans la plupart des entreprises. Dans un produit où les gens vérifient leur solde avant de décider s'ils peuvent se permettre quelque chose, cette même petite erreur n'est pas seulement agaçante, c'est ce qui se trouve entre un flux d'événements brut et un chiffre sur lequel quelqu'un est sur le point de prendre une vraie décision.
