---
title: L'expérimentation est un programme, pas un seul test
date: 2026-08-18
excerpt: Faire tourner un test A/B, c'est l'affaire d'un mardi après-midi. Faire de l'expérimentation une discipline, où des dizaines de tests se chevauchent et où la moitié de vos idées ne peuvent pas réellement être randomisées, est un problème complètement différent.
tags: [Experimentation, A/B Testing, Analytics]
---

Il y a une différence entre faire tourner un test A/B et avoir un programme d'expérimentation, et ce n'est pas juste une question d'échelle. Un seul test est une question avec une réponse nette : est-ce que cette couleur de bouton convertit mieux que cette autre. Un programme, c'est ce qui se passe une fois qu'une entreprise fait tourner quinze tests à la fois, dont la moitié touchent la même page, dont certains durent des semaines, et où quelqu'un doit décider quels résultats croire et quelles idées ne peuvent tout simplement pas être testées de cette façon.

## Le premier problème est la contamination, pas les statistiques

Dès qu'on a plus d'une expérience qui tourne en même temps, il faut se demander si elles se marchent sur les pieds. Un test de tarification et un test de refonte du paiement qui tournent simultanément sur les mêmes utilisateurs signifient qu'aucun des deux résultats n'est propre à lui seul, parce qu'on ne peut pas dire si un changement de conversion vient du prix, de la refonte, ou de l'interaction entre les deux. Les programmes d'expérimentation matures résolvent cela avec une combinaison d'allocation de trafic mutuellement exclusive, où un utilisateur donné ne peut se trouver que dans une seule expérience d'un groupe en conflit à la fois, et d'un registre d'expériences qui rend au moins le chevauchement visible, même quand il ne peut pas être complètement évité.

| Expérience | Couche de trafic | Chevauche |
|------------|--------------------|-----------|
| Refonte du paiement | Couche A | aucune |
| Test d'affichage des prix | Couche A | Refonte du paiement |
| Test de ligne d'objet courriel | Couche B | indépendant de A |
| Algorithme de recommandation | Couche C | indépendant de A et B |

Une structure en couches comme celle-ci est une façon assez standard d'empêcher des expériences qui interféreraient réellement entre elles de jamais tourner sur les mêmes utilisateurs en même temps, tout en laissant des tests non liés tourner librement en parallèle.

## Les tests à horizon fixe ne sont pas le seul outil

La plupart des gens imaginent un test A/B classique en entendant le mot expérimentation : deux groupes, répartis également, exécutés pendant une période fixe, comparés à la fin. C'est le bon outil pour bien des questions, mais pas toutes. Une approche de type bandit manchot à plusieurs bras, qui déplace le trafic vers la variante qui performe le mieux au fur et à mesure que le test avance, échange la propreté statistique contre un coût d'opportunité plus faible, ce qui compte beaucoup plus quand le coût de montrer aux utilisateurs une moins bonne variante est élevé, comme la tarification ou une étape critique de l'entonnoir.

| | Test A/B à horizon fixe | Bandit manchot à plusieurs bras |
|---|---|---|
| Idéal pour | Comparaisons propres et défendables | Minimiser le coût d'une mauvaise variante |
| Répartition du trafic | Fixe du début à la fin | Se déplace vers le gagnant |
| Clarté statistique | Élevée | Plus faible, plus difficile à expliquer après coup |
| Bon choix pour | Décisions de fonctionnalités, changements d'interface | Enjeux élevés, entonnoirs à fort trafic |

Aucun des deux n'est universellement meilleur. Le choix dépend de si on a besoin d'une réponse défendable pour un document de décision, ou si on veut surtout arrêter de perdre de l'argent à cause de la moins bonne variante le plus vite possible.

## Parfois, on ne peut tout simplement pas randomiser

Certaines des questions les plus importantes dans une entreprise sont celles qu'on ne peut pas tester proprement en A/B. Déployer un nouveau processus de vente dans une région et pas une autre n'est pas aléatoire, c'est habituellement guidé par la maturité du marché ou la capacité de l'équipe, ce qui signifie que la région qui a reçu le changement et celle qui ne l'a pas reçu étaient probablement déjà différentes d'une façon qui affecte le résultat. Les effets de réseau causent un problème similaire dans les places de marché et les produits sociaux, où traiter un utilisateur différemment peut déborder et affecter les personnes qui lui sont liées, brisant discrètement l'hypothèse que chaque unité est indépendante.

Dans des situations comme celle-ci, une approche par différence de différences est souvent ce qui se rapproche le plus d'une vraie réponse. Plutôt que de comparer le groupe traité au groupe témoin directement, on compare le changement dans le temps du groupe traité au changement dans le temps d'un groupe non traité similaire, ce qui tient au moins compte des tendances qui se seraient produites de toute façon.

```sql
with region_metrics as (
    select
        region,
        case when region = 'treated_region' then 1 else 0 end as is_treated,
        case when metric_date >= '2026-06-01' then 1 else 0 end as is_post_period,
        avg(conversion_rate) as avg_conversion_rate
    from regional_daily_metrics
    where region in ('treated_region', 'control_region')
    group by 1, 2, 3
)

select
    (max(case when is_treated = 1 and is_post_period = 1 then avg_conversion_rate end)
     - max(case when is_treated = 1 and is_post_period = 0 then avg_conversion_rate end))
    -
    (max(case when is_treated = 0 and is_post_period = 1 then avg_conversion_rate end)
     - max(case when is_treated = 0 and is_post_period = 0 then avg_conversion_rate end))
    as difference_in_differences
from region_metrics
```

Cette requête calcule exactement ce que le nom suggère : le changement dans la région traitée moins le changement dans la région témoin, sur la même fenêtre de temps. Ce n'est pas aussi propre qu'un test randomisé, et ça s'appuie sur l'hypothèse que les deux régions auraient suivi une tendance similaire sans le changement, ce qui vaut la peine d'être vérifié par rapport aux données historiques avant de trop faire confiance au résultat. Mais c'est une vraie réponse à une question qui ne pouvait être répondue d'aucune autre façon.

## Ce qui rend vraiment un programme mature

Rien de tout cela n'a à voir avec le fait de faire tourner plus de tests. Une équipe qui fait tourner trente tests superficiels par trimestre sans registre, sans indicateurs de garde et sans plan pour ce qu'il faut faire quand deux expériences se chevauchent n'est pas plus rigoureuse qu'une équipe qui fait tourner cinq tests par trimestre correctement. La maturité se manifeste dans l'infrastructure ennuyeuse : un registre partagé pour que personne ne lance un test en conflit par accident, un ensemble par défaut d'indicateurs de garde que chaque test doit respecter peu importe ce qu'il optimise, et une reconnaissance honnête que certains des changements les plus importants qu'une entreprise fait n'allaient jamais être des expériences randomisées propres au départ, et ont plutôt besoin d'un type de rigueur différent.
