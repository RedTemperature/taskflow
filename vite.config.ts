import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.',
  base: './',
  build: {
    outDir: 'out/renderer',
    emptyOutDir: true,
    rollupOptions: {
      input: './index.html',
      output: {
        manualChunks: {
          i18n: ['i18next', 'react-i18next'],
          charts: ['recharts'],
          dnd: ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip'
          ],
          vendor: ['zustand', 'date-fns', 'nanoid', 'clsx', 'lucide-react']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@renderer': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './shared')
    }
  },
  server: {
    port: 5173,
    strictPort: true
  }
})
