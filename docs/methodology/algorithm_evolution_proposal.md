# Proposition d'Évolution de l'Algorithme

Basé sur la structure actuelle et la méthode Joe Friel, voici les étapes d'amélioration pour `PlanGeneratorService.ts`.

## 1. Structure de Données Enrichie

Passer d'une distribution simple à une définition de "Template de Semaine" par phase :

- **Base 1** : 3x Swim (Technique/Endurance), 2x Bike (Endurance), 2x Run (Endurance).
- **Build 1** : 2x Swim (Vitesse), 3x Bike (Seuil), 2x Run (Enchaînement/Brick).

## 2. Calcul des Zones Personnalisées

L'algorithme doit pouvoir utiliser les données de profil utilisateur (si disponibles) :

```typescript
interface UserPhysio {
    swimTTime: number; // sec/100m
    bikeFTP: number; // Watts
    bikeLTHR: number; // BPM
    runLTHR: number; // BPM
    runFTPa: number; // sec/km
}
```

## 3. Logique de Génération de Séances (Smart Blocks)

Au lieu de chaînes de caractères `note` statiques, utiliser un moteur de template :

- **Entrée** : Phase + Sport + Type + Intensité Cible.
- **Sortie** : Blocs structurés avec description précise des zones.

### Exemple de conversion :

_Actuel_ : `Main Set: 4x8min @ Threshold with 2min rest`
_Futur Friel_ : `Main Set: 4x8min @ Zone 4 (Sub-Threshold) | R: 2min Zone 1`

## 4. Gestion de la Charge (TSS - Training Stress Score)

- Estimer le TSS de chaque séance.
- S'assurer que le TSS hebdomadaire ne progresse pas de plus de 10% par rapport à la semaine précédente (hors semaine de récup).

## 5. Workflow de Travail Proposé

1. **Étape A** : Définir les interfaces TypeScript pour les Zones et les Phases de Friel.
2. **Étape B** : Créer un dictionnaire de séances types (Workout Library) classées par Phase/Zone.
3. **Étape C** : Refactoriser `PlanGeneratorService` pour utiliser ce dictionnaire et la logique de progression de charge.
