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
      input: './index.html'
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
