import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import path from 'path'

import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    // Танстак роутер всегда должен быть сверху
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    AutoImport({
      dirs: [
        'src/store', 
        'src/hooks',
        'src/components/*'
      ],
      imports: [
        'react',
        {
          'axios': [
            ['default', 'axios'],
          ],
        }
      ],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true, // генерировать .eslintrc-auto-import.json
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true
      }
    }),
    react(),
    tailwindcss(), 
    tsconfigPaths()
  ],
  server: {
    port: 5173
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
