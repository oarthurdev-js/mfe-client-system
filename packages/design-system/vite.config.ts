/* eslint-disable */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    federation({
      name: 'designSystem',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/components/Button',
        './Input': './src/components/Input',
        './Card': './src/components/Card',
        './Layout': './src/components/Layout',
        './theme': './src/theme'
      },
      shared: ['react', 'react-dom']
    })
  ],
  build: {
    target: 'esnext',
    minify: mode === 'production',
    cssCodeSplit: false,
    rollupOptions: {
      external: mode === 'development' ? [] : undefined
    }
  },
  server: {
    port: 5176,
    cors: true,
    fs: {
      allow: ['..', '../..']
    }
  },
  preview: {
    port: 5176,
    cors: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
}))