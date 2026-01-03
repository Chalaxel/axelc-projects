import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@apps': path.resolve(__dirname, '../../../apps'),
            '@monorepo/shared-types': path.resolve(__dirname, '../../../packages/shared-types/src'),
            '@monorepo/shared-frontend': path.resolve(__dirname, '../../../shared/frontend'),
        },
    },
    server: {
        port: 8081,
        proxy: {
            '/api': 'http://localhost:3000',
        },
    },
});

