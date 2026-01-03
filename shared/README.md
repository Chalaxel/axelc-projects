# Dossier Shared

Ce dossier contient les types et utilitaires partagés entre le frontend et le backend.

## Structure

```
shared/
├── types/          # Types TypeScript partagés
│   ├── Todo.ts     # Types pour les todos
│   └── index.ts    # Point d'entrée pour tous les types
└── tsconfig.json   # Configuration TypeScript pour le dossier shared
```

## Utilisation

### Dans le backend

```typescript
import { Todo, TodoCreationAttributes } from '@shared/types/Todo';
```

### Dans le frontend

```typescript
import { Todo, TodoCreationAttributes } from '@shared/types/Todo';
```

## Configuration

Les alias de chemins `@shared/*` sont configurés dans :
- `backend/tsconfig.json` - pour la compilation TypeScript
- `frontend/tsconfig.json` - pour la compilation TypeScript
- `frontend/vite.config.ts` - pour la résolution des modules par Vite
- `backend/package.json` - utilise `tsconfig-paths` pour résoudre les alias à l'exécution

## Avantages

1. **Source unique de vérité** : Les types sont définis une seule fois
2. **Synchronisation automatique** : Les changements de types sont immédiatement disponibles partout
3. **Maintenance simplifiée** : Pas de duplication de code
4. **Type-safety** : Garantit la cohérence entre le frontend et le backend
