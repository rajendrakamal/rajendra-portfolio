---
title: Les dimensions à évolution lente, et pourquoi le type 2 retient le plus l'attention
date: 2026-08-13
excerpt: Un client déménage, un produit change de catégorie, un employé change de titre. La façon dont votre table de dimension gère ce changement détermine si les rapports de l'an dernier ont encore un sens aujourd'hui. Inclut du code de snapshot dbt et quelques tableaux avant-après.
tags: [dbt, Data Modeling, SCD]
---

Les tables de dimension décrivent des choses : des clients, des produits, des employés, des magasins. La plupart du temps, ces descriptions ne restent pas figées. Un client déménage de Toronto à Calgary, un produit est réassigné à une nouvelle catégorie, un employé est promu. La question à laquelle répond une stratégie de dimension à évolution lente est simple à formuler et facile à mal résoudre en pratique : quand cet attribut change, qu'advient-il des rapports déjà produits sous l'ancienne valeur ?

Il existe une poignée d'approches nommées pour cela, généralement numérotées de zéro à six, mais en pratique, presque tout le monde finit par se tourner vers les deux ou trois mêmes. Je veux passer en revue celles qui reviennent réellement, avec assez de détails pour que la différence soit concrète plutôt qu'académique.

## Type 0 : certaines choses ne changent tout simplement pas

Un rapide d'abord. Le type 0 signifie que l'attribut est fixé une fois écrit et n'est plus jamais mis à jour, peu importe ce qui se passe en amont. La date d'inscription originale d'un client en est un bon exemple. Même si un système source « corrige » d'une façon ou d'une autre cette valeur plus tard, on veut souvent garder la toute première valeur enregistrée, parce que c'est celle sur laquelle les cohortes historiques ont été construites. Tout attribut n'a pas besoin d'une stratégie. Certains ont simplement besoin qu'on les laisse tranquilles.

## Type 1 : écraser, et accepter que l'historique est perdu

C'est l'option par défaut vers laquelle la plupart des gens se tournent sans y penser, parce que c'est simplement une mise à jour.

```sql
update dim_customers
set city = 'Calgary'
where customer_id = 100;
```

Avant la mise à jour, tout rapport exécuté sur cette ligne indiquait Toronto. Après, tout rapport, y compris ceux réexécutés sur les données de l'an dernier, indique Calgary. C'est très bien pour les attributs où seule la valeur actuelle compte, comme le statut actuel d'abonnement marketing d'un client. C'est un problème silencieux pour les attributs qui alimentent une analyse historique, parce que ça réécrit le passé sans le dire à personne.

| customer_id | city    | valide en date de   |
|-------------|---------|----------------------|
| 100         | Toronto | avant la mise à jour |
| 100         | Calgary | après, et rétroactivement aussi |

## Type 2 : ajouter une nouvelle ligne, et garder l'ancienne intacte

C'est celui qui reçoit le plus d'attention, parce que c'est celui qui préserve réellement l'historique. Au lieu d'écraser la ligne, on ferme l'ancienne version et on en insère une nouvelle, chacune avec sa propre fenêtre de validité.

```
Ligne 101  [Toronto]  ────────────●  fermée le 2026-03-14, is_current = false
Ligne 102  [Calgary]              ●───────────────────▶  is_current = true
                       2024-01-01     2026-03-15
```

| customer_key | customer_id | city    | valid_from | valid_to   | is_current |
|--------------|-------------|---------|------------|------------|------------|
| 101          | 100         | Toronto | 2024-01-01 | 2026-03-14 | false      |
| 102          | 100         | Calgary | 2026-03-15 | null       | true       |

Remarquez la clé de substitution. `customer_id` identifie toujours la personne, mais `customer_key` identifie cette version spécifique d'elle, et cette distinction est ce qui fait fonctionner tout le reste. Les tables de faits se joignent à la clé de substitution, pas à la clé naturelle, ce qui est ce qui permet à une ancienne commande de rester rattachée à l'ancienne ville du client.

dbt possède une fonctionnalité intégrée conçue exactement pour ça, appelée un snapshot, et elle évite d'avoir à écrire la logique de fermeture des lignes à la main.

```sql
-- snapshots/customers_snapshot.sql

{% snapshot customers_snapshot %}

{{
    config(
      target_schema='snapshots',
      unique_key='customer_id',
      strategy='timestamp',
      updated_at='updated_at',
    )
}}

select
    customer_id,
    city,
    email,
    updated_at
from {{ source('core', 'customers') }}

{% endsnapshot %}
```

Exécuter ceci sur une base planifiée donne automatiquement les colonnes `dbt_valid_from` et `dbt_valid_to`, ainsi qu'un `dbt_scd_id` qui agit comme clé de substitution. La stratégie peut aussi être `check`, qui compare une liste de colonnes plutôt que de s'appuyer sur un horodatage updated_at, utile quand le système source n'horodate pas ses mises à jour de façon fiable.

Le bénéfice apparaît en aval, dans la façon de joindre une table de faits à une dimension de type 2.

```sql
select
    f.order_id,
    f.order_date,
    d.city as customer_city_at_order_time
from {{ ref('fct_orders') }} as f
join {{ ref('dim_customers_scd2') }} as d
    on f.customer_id = d.customer_id
    and f.order_date >= d.valid_from
    and (f.order_date < d.valid_to or d.valid_to is null)
```

C'est tout l'intérêt du modèle. Une commande passée en 2025 se joint à la ligne Toronto, pas à celle de Calgary, parce que la condition de jointure correspond à la plage de dates où la commande a réellement eu lieu, pas à la ligne qui se trouve être actuelle aujourd'hui.

## Type 3 : ne garder que la valeur précédente

Parfois, on n'a pas besoin de l'historique complet, on a simplement besoin de pouvoir comparer la valeur actuelle à celle qui la précède immédiatement. Le type 3 fait cela avec une colonne supplémentaire plutôt qu'une ligne supplémentaire.

```sql
alter table dim_customers add column previous_city varchar;

update dim_customers
set previous_city = city,
    city = 'Calgary'
where customer_id = 100;
```

| customer_id | previous_city | city    |
|-------------|----------------|---------|
| 100         | Toronto        | Calgary |

C'est économique et facile à interroger, puisqu'il n'y a ni explosion du nombre de lignes ni jointures sur des plages de dates. Le compromis, c'est que ça ne mémorise qu'un seul pas en arrière. Si le même client déménage une seconde fois, la valeur Toronto est perdue pour de bon. C'est un choix raisonnable pour les attributs où « qu'est-ce qui a changé le plus récemment » est la vraie question d'affaires, comme suivre l'ancien territoire d'un représentant des ventes pendant une période de transition.

## Quelques variantes à connaître

Le type 4 déplace l'historique entièrement dans une table distincte, gardant la dimension principale petite et rapide pendant qu'une table d'historique compagne conserve chaque version passée. Le type 6 est un hybride qui combine les types 1, 2 et 3 dans une seule ligne, valeur actuelle écrasée sur place, historique complet préservé dans d'autres lignes, et une colonne de valeur précédente par commodité. Les deux sont des modèles réels qu'on retrouve dans les entrepôts de données matures, mais ce sont des raffinements du même compromis que représentent déjà les types 2 et 3, pas des idées fondamentalement nouvelles, alors je ne m'y attarderai pas ici.

## En choisir un

En pratique, la décision est moins compliquée que la numérotation ne le suggère. Optez par défaut pour le type 1 pour les attributs où seule la valeur actuelle est jamais interrogée. Tournez-vous vers le type 2 dès qu'un rapport historique doit refléter le monde tel qu'il était, pas tel qu'il est maintenant, ce qui est le cas la plupart du temps pour tout ce qui alimente l'analyse de tendances ou les rapports de cohortes. Réservez le type 3 au cas étroit où un seul pas d'historique est réellement tout ce qu'on demandera jamais. Les types ne forment pas une hiérarchie où plus haut est meilleur, ce sont des réponses différentes à la même question, et le bon choix dépend entièrement de si le passé est autorisé à changer quand le présent change.
