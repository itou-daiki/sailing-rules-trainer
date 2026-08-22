import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/sailing-rules-trainer/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['app-icon.svg', 'app-icon-192.png', 'app-icon-512.png'],
      manifest: {
        name: 'セーリング・ルール練習帳',
        short_name: 'ルール練習帳',
        description: 'レース信号旗、セーリング競技規則、マーク回航を状況問題で学ぶ練習帳',
        theme_color: '#0b2942',
        background_color: '#eef3f2',
        display: 'standalone',
        start_url: '/sailing-rules-trainer/',
        scope: '/sailing-rules-trainer/',
        icons: [
          {
            src: 'app-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'app-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true
  }
})
