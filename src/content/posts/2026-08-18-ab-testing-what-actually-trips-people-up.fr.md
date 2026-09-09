---
title: Les tests A/B en pratique : ce qui fait vraiment trébucher les gens
date: 2026-08-18
excerpt: Les mathématiques derrière un test t sont la partie facile. Presque tout test A/B qui tourne mal, tourne mal ailleurs, généralement avant même que le test commence ou pendant la semaine où quelqu'un s'impatiente et vérifie le tableau de bord trop tôt.
tags: [A/B Testing, Statistics, Experimentation]
---

Demandez à la plupart des analystes d'expliquer un test t, et ils s'en tirent bien. Demandez-leur d'expliquer pourquoi le résultat « significatif » du trimestre dernier ne s'est pas confirmé une fois la fonctionnalité réellement lancée, et la conversation devient plus intéressante. Les statistiques derrière les tests A/B sont vraiment la partie facile. Ce qui fait réellement dérailler les tests et induit les gens en erreur se passe presque toujours ailleurs : avant que le test commence, ou en plein milieu, quand quelqu'un s'impatiente.

## La conversation sur la taille d'échantillon que personne ne veut avoir

Tout test A/B a un effet minimal détectable, que quelqu'un le calcule à l'avance ou non. Si votre taux de conversion de référence est de 4 pour cent et que vous n'avez assez de trafic que pour faire tourner le test une semaine, il existe une taille d'effet en dessous de laquelle il est tout simplement impossible de détecter une différence de façon fiable, peu importe comment les chiffres se présentent. Faire tourner le test quand même et lire le résultat à la fin est la façon dont beaucoup de conclusions « aucune différence significative » sont rapportées, alors que la réponse honnête aurait été « nous n'aurions pas pu détecter ceci même si ça existait ».

```python
from scipy.stats import norm

def required_sample_size(baseline_rate, minimum_detectable_effect, alpha=0.05, power=0.8):
    p1 = baseline_rate
    p2 = baseline_rate * (1 + minimum_detectable_effect)
    pooled = (p1 + p2) / 2

    z_alpha = norm.ppf(1 - alpha / 2)
    z_beta = norm.ppf(power)

    numerator = (z_alpha * (2 * pooled * (1 - pooled)) ** 0.5
                 + z_beta * (p1 * (1 - p1) + p2 * (1 - p2)) ** 0.5) ** 2
    denominator = (p2 - p1) ** 2

    return numerator / denominator
```

Exécutez cela avec une référence de 4 pour cent et une hausse relative de 10 pour cent, et il faudra environ 20 000 visiteurs par groupe pour avoir une chance raisonnable de la détecter. Ce chiffre tend à être le moment où un intervenant accepte soit de faire tourner le test pendant un mois, soit décide qu'il préfère viser un écart plus grand qui soit réellement détectable avec le trafic dont il dispose.

## Le coup d'œil furtif finit par avoir raison de tout le monde

Vérifier la valeur p d'un test chaque jour et arrêter dès qu'elle franchit 0,05 semble inoffensif. Ça ne l'est pas. Un seul test de signification suppose qu'on a regardé une seule fois. Si on regarde dix fois au cours d'une expérience, la probabilité de tomber sur un résultat significatif par hasard à un moment donné est bien plus élevée que 5 pour cent, même s'il n'y a aucun effet réel du tout.

| Jour | Visiteurs cumulatifs | Valeur p |
|------|------------------------|----------|
| 3    | 900                    | 0,04     |
| 5    | 1 500                  | 0,09     |
| 7    | 2 100                  | 0,03     |
| 10   | 3 000                  | 0,11     |
| 14   | 4 200                  | 0,02     |

Ce tableau est une simulation d'un test où il n'existe aucune vraie différence entre les groupes, seulement du bruit qui se stabilise à mesure que plus de données arrivent. Quelqu'un qui vérifie au jour 3, au jour 7 ou au jour 14 aurait lancé la fonctionnalité. Quelqu'un qui vérifie au jour 5 ou au jour 10 aurait déclaré match nul. Les deux regardent exactement la même expérience sous-jacente. La solution n'est pas d'arrêter de vérifier, c'est soit de s'engager envers une taille d'échantillon fixe décidée avant le début du test, soit d'utiliser une méthode de test séquentiel réellement conçue pour être vérifiée à répétition sans gonfler le taux de faux positifs.

## L'indicateur qu'on optimise est rarement celui qui compte

Un test qui améliore le taux de clics sur un bouton de paiement de 8 pour cent semble être une victoire nette jusqu'à ce que quelqu'un vérifie s'il a aussi augmenté les retours, s'il a réellement bougé le chiffre d'affaires, ou s'il a simplement fait cliquer les gens deux fois plus souvent sans qu'ils achètent réellement plus. Choisir un seul indicateur principal avant le début du test, et une courte liste d'indicateurs de garde qui doivent rester stables, est ce qui empêche un test de devenir une histoire qu'on se raconte après coup à propos de n'importe quel chiffre qui a bougé.

## L'effet de nouveauté s'estompe, et la méfiance aussi

Une interface repensée obtient souvent une hausse à court terme simplement parce qu'elle est nouvelle et que les gens y prêtent plus attention, pas parce qu'elle est réellement meilleure. L'inverse est parfois vrai aussi, où un changement performe moins bien la première semaine simplement parce que les utilisateurs récurrents sont déroutés par quelque chose d'inhabituel, puis se rétablit une fois qu'ils s'ajustent. Un test qui ne tourne que quelques jours peut confondre l'un ou l'autre avec un effet permanent. Le faire tourner assez longtemps pour couvrir au moins un cycle comportemental complet, habituellement une semaine ou deux au minimum, attrape la plupart de ces cas avant qu'ils ne deviennent une mauvaise décision ancrée dans la feuille de route.

## La partie réellement difficile

Aucune des statistiques ici n'est avancée. Un test z à deux proportions est quelque chose que la plupart des gens apprennent dans un premier cours de statistiques. Ce qui est difficile, c'est la discipline qui l'entoure : décider d'une taille d'échantillon avant de commencer et s'y tenir, s'entendre sur un seul indicateur principal avant de voir la moindre donnée, et résister à l'envie bien humaine de vérifier le tableau de bord chaque matin et d'interpréter un sens dans ce qu'il indique ce jour-là. Le test lui-même est rarement le problème. Le processus qui l'entoure l'est habituellement.
