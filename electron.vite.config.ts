import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  main: {
    build: {
      outDir: 'out/main',
      rollupOptions: {
        input: 'electron/main.ts',
        external: ['electron', 'electron-store']
      }
    },
    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, './shared')
      }
    }
  },
  preload: {
    build: {
      outDir: 'out/preload',
      rollupOptions: {
        input: 'electron/preload.ts',
        external: ['electron', '@electron-toolkit/preload']
      }
    }
  },
  renderer: {
    plugins: [react()],
    root: '.',
    build: {
      outDir: 'out/renderer',
      rollupOptions: {
        input: './index.html'
      }
    },
    resolve: {
      alias: {
        '@renderer': path.resolve(__dirname, './src'),
        '@shared': path.resolve(__dirname, './shared')
      }
    }
  }
})
