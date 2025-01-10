import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@auth': '/src/features/auth',
      '@utils': '/src/utils',
      '@hooks': '/src/hooks',
      '@services': '/src/services',
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@typess': '/src/types'
    }
  }
})