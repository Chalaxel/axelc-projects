# Instructions for AI Agents

When working on this monorepo, please follow these guidelines.

## Architecture Overview

```
/
├── apps/                          # Application-specific code
│   └── [app-name]/
│       ├── backend/               # App backend (routes, services, models)
│       │   ├── src/
│       │   │   ├── routes/
│       │   │   ├── services/
│       │   │   ├── models/
│       │   │   ├── migrations/
│       │   │   └── index.ts       # Exports router and init functions
│       │   └── package.json
│       └── frontend/              # App frontend (components, pages)
│           ├── src/
│           │   ├── presentation/
│           │   ├── services/
│           │   └── ...
│           └── package.json
├── shared/                        # Shared generic services
│   ├── backend/
│   │   ├── services/              # EmailService, etc.
│   │   └── config/                # Database config
│   └── frontend/
│       └── services/              # API client
├── backend/                       # Main backend server
│   └── src/server.ts              # Multi-app routing
├── frontend/                      # Main frontend
│   └── src/App.tsx                # Multi-app routing
└── packages/
    └── shared-types/              # Shared TypeScript types
```

## Documentation Rules

- **NEVER create documentation files (.md) unless explicitly requested**
- Provide explanations directly in conversation
- Only create docs if user explicitly asks

## Adding a New App

### Step 1: Create App Structure

```bash
mkdir -p apps/[app-name]/backend/src/{routes,services,models,migrations,config,utils}
mkdir -p apps/[app-name]/frontend/src/{presentation,services,assets}
```

### Step 2: Create Backend Files

**apps/[app-name]/backend/package.json:**
```json
{
  "name": "@monorepo/app-[app-name]-backend",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "ts-node-dev --respawn src/server.ts"
  },
  "dependencies": {
    "@monorepo/shared-types": "file:../../../packages/shared-types",
    "express": "^4.18.2",
    "sequelize": "^6.35.0",
    "pg": "^8.11.3"
  }
}
```

**apps/[app-name]/backend/src/index.ts:**
```typescript
import { router } from './routes/routes';
import { initializeDatabase, closeDatabase } from './utils/dbSync';

export { router, initializeDatabase, closeDatabase };
```

**apps/[app-name]/backend/src/routes/routes.ts:**
```typescript
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'healthy', app: '[app-name]' });
});

// Add your routes here

export { router };
```

### Step 3: Create Frontend Files

**apps/[app-name]/frontend/package.json:**
```json
{
  "name": "@monorepo/app-[app-name]-frontend",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@monorepo/shared-types": "file:../../../packages/shared-types",
    "react": "^18.2.0",
    "react-router-dom": "^7.9.3"
  }
}
```

**apps/[app-name]/frontend/src/services/api.config.ts:**
```typescript
export const API_CONFIG = {
    baseURL: '/api/[app-name]',
    timeout: 10000,
};
```

**apps/[app-name]/frontend/src/presentation/ui/App.tsx:**
```typescript
import { Routes, Route, Navigate } from 'react-router-dom';

export const App = () => {
    return (
        <Routes>
            <Route path="home" element={<div>Home</div>} />
            <Route index element={<Navigate to="home" replace />} />
            <Route path="*" element={<Navigate to="home" replace />} />
        </Routes>
    );
};
```

### Step 4: Register App in Main Frontend

**frontend/src/App.tsx** - Add lazy import and route:
```typescript
const NewApp = lazy(() => import('@apps/[app-name]/frontend/src/presentation/ui/App').then(m => ({ default: m.App })));

// In Routes:
<Route path="/[app-name]/*" element={<NewApp />} />
```

### Step 5: Enable App in Backend

Set environment variable:
```
ENABLED_APPS=ladm,[app-name]
```

### Step 6: Update Links in App

All Link components in the app should use the app base path:
```typescript
<Link to="/[app-name]/home">Home</Link>
<Link to="/[app-name]/products">Products</Link>
```

## Routing Conventions

### Backend Routes
- API base: `/api/[app-name]/*`
- Example: `/api/ladm/products`, `/api/myapp/users`

### Frontend Routes
- URL base: `/[app-name]/*`
- Example: `/ladm/home`, `/myapp/dashboard`

## Database Conventions

- Each app can use the same database with table prefixes
- Or configure separate databases via environment variables
- Prefix: `[APP_NAME]_POSTGRESQL_ADDON_*`

## Shared Services Usage

### Backend - Email Service
```typescript
import { BaseEmailService } from '@monorepo/shared-backend';

const emailService = new BaseEmailService();
await emailService.sendEmail({
    to: 'user@example.com',
    subject: 'Hello',
    text: 'Content'
});
```

### Frontend - API Client
```typescript
import { createAppApiClient } from '@monorepo/shared-frontend';

const api = createAppApiClient('app-name');
const response = await api.get('/endpoint');
```

## Development Commands

```bash
# Install all dependencies
npm install

# Build everything
npm run build

# Development mode
npm run dev

# Build specific app backend
cd apps/[app-name]/backend && npm run build

# Run migrations for app
cd apps/[app-name]/backend && npm run migrate
```

## Clean Code Principles

- Use descriptive names for variables, functions, classes
- Keep functions small and focused
- Follow Single Responsibility Principle
- Use proper error handling
- Remove dead code and unused imports
- Group related functionality together

## File Organization

- One component per file
- Group by feature, not by type
- Keep files focused and reasonably sized
- Use index.ts for clean exports
