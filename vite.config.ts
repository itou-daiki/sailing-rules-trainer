import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/sailing-rules-trainer/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['app-icon.svg'],
      manifest: {
        name: 'セーリング・ルール練習帳',
        short_name: 'ルール練習帳',
        description: 'レース信号旗とセーリング競技規則を、状況問題で学ぶ練習帳',
        theme_color: '#0b2942',
        background_color: '#f4f1e8',
        display: 'standalone',
        start_url: '/sailing-rules-trainer/',
        icons: [
          {
            src: 'app-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
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
