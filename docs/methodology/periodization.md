# Périodisation (Macro-cycle et Méso-cycles)

La périodisation de Joe Friel divise une saison (Macro-cycle) en phases distinctes (Méso-cycles) pour amener l'athlète à son pic de forme le jour de la course.

## Les Phases (Méso-cycles)

| Phase              | Durée (semaines) | Focus Principal        | Caractéristiques                                                     |
| :----------------- | :--------------- | :--------------------- | :------------------------------------------------------------------- |
| **Préparation**    | 3 - 4            | Reprise douce          | Cross-training, technique, renforcement général.                     |
| **Base (1, 2, 3)** | 8 - 12           | Endurance fondamentale | Gros volume à basse intensité, force maximale.                       |
| **Build (1, 2)**   | 6 - 8            | Intensité spécifique   | Travail au seuil (Threshold), séances plus proches du rythme course. |
| **Peak**           | 1 - 2            | Affûtage               | Diminution du volume, maintien de l'intensité, repos maximal.        |
| **Race**           | 1                | Compétition            | Objectif A.                                                          |
| **Transition**     | 1 - 4            | Récupération           | Activités libres, repos mental et physique post-course.              |

## Le Micro-cycle (La Semaine)

Une semaine type suit généralement un ratio Fatigue/Repos.

- **Principe du 3:1** : 3 semaines de charge progressive suivies d'1 semaine de récupération (volume réduit de 40 à 50%).
- Pour les athlètes plus âgés ou débutants, un ratio **2:1** peut être préférable.

## Implication pour l'Algorithme

L'algorithme doit pouvoir :

1. Calculer le nombre de semaines totales entre `startDate` et `endDate`.
2. Assigner chaque semaine à une phase (Base, Build, Peak, Taper).
3. Insérer automatiquement des semaines de récupération tous les 3 ou 4 cycles.
