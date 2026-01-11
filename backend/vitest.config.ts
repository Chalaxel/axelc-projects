import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.{test,spec}.{js,ts}', 'test/**/*.{test,spec}.{js,ts}'],
    },
    resolve: {
        alias: {
            '@shared': path.resolve(__dirname, '../shared'),
        },
    },
});
