import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        target: 'es2020',
        sourcemap: false,
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    // Core React chunks
                    'react-vendor': ['react', 'react-dom'],
                    // Router
                    'router': ['react-router-dom'],
                    // Canvas engine — largest dependency, isolated
                    'fabric': ['fabric'],
                    // Animation
                    'framer-motion': ['framer-motion'],
                    // State management
                    'zustand': ['zustand'],
                    // UI utilities
                    'ui-utils': ['react-hot-toast', 'react-icons'],
                    // Export utilities — loaded on demand
                    'export-utils': ['jspdf', 'html2canvas'],
                    // DND kit
                    'dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
                    // Color picker
                    'color': ['react-color'],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
        include: ['fabric', 'zustand', 'framer-motion'],
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
});
