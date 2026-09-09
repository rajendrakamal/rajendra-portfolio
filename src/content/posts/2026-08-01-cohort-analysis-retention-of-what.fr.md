---
title: L'analyse de cohortes, c'est facile. Rétention de quoi, c'est la vraie question.
date: 2026-08-01
excerpt: Les tableaux de cohortes sont partout dans les présentations analytiques. La plupart ne répondent toujours pas à la seule question qui compte vraiment, la rétention de quoi, exactement ?
tags: [Cohort Analysis, Retention, SQL]
---

Presque toute équipe d'analytique finit par construire un tableau de rétention par cohorte : regrouper les utilisateurs par mois d'inscription, puis tracer le pourcentage encore actif au mois 1, au mois 2, au mois 3. C'est un bon graphique. C'est aussi, à lui seul, un graphique superficiel, et je l'ai vu orienter la mauvaise conversation plus d'une fois.

## Le regroupement par défaut est souvent le mauvais

Le choix réflexe est de regrouper par **date d'inscription**. C'est la colonne la plus simple à utiliser, alors c'est celle qui se retrouve dans le premier tableau de bord. Mais la date d'inscription répond à « quand ce groupe a-t-il commencé », pas à « qu'est-ce que ces personnes ont en commun qui expliquerait pourquoi elles restent ou partent ». Deux utilisateurs inscrits la même semaine peuvent se comporter de façon totalement différente si l'un est arrivé par un canal d'acquisition payant et l'autre par une recommandation.

Les découpages les plus utiles sont généralement comportementaux ou structurels :

- **Canal d'acquisition** : les cohortes payantes, organiques et de recommandation ont souvent des courbes de rétention très différentes, et les regrouper dans une seule cohorte par date d'inscription ne fait que diluer l'histoire dans une moyenne.
- **Profondeur d'engagement la première semaine** : l'utilisateur a-t-il accompli l'action clé (téléversé des données, créé un tableau de bord, ou tout autre « moment déclencheur » propre à votre produit) durant la première semaine, ou non ?
- **Forfait ou palier de tarification** : l'économie de la rétention varie selon le segment, et une seule courbe agrégée peut cacher que votre palier à plus forte valeur perd en fait ses clients plus rapidement.

## Un point de départ SQL simple

Rien d'exotique. C'est la structure dont part presque toute requête de cohorte, alors il suffit de remplacer `signup_month` par la définition de cohorte qui compte réellement pour la question posée :

```sql
with cohort as (
  select
    user_id,
    date_trunc('month', signup_date) as cohort_month
  from users
),
activity as (
  select
    user_id,
    date_trunc('month', event_date) as activity_month
  from events
)
select
  c.cohort_month,
  date_diff('month', c.cohort_month, a.activity_month) as months_since_signup,
  count(distinct a.user_id) as active_users
from cohort c
join activity a using (user_id)
group by 1, 2
order by 1, 2;
```

Une fois cette requête exécutée, le vrai travail commence : joindre la colonne de segment (canal, forfait, comportement de la première semaine) qui explique réellement le *pourquoi* derrière la courbe, pas seulement le *quand*.

## À retenir

Un tableau de cohortes indique si la rétention monte ou descend. Il n'indique pas pourquoi, et le « pourquoi » est exactement ce dont une décision de tarification ou de produit a besoin. Si un graphique de rétention ne peut pas répondre à « la rétention de quel groupe, défini comment, comparé à quoi », c'est un graphique, pas encore une information exploitable.
