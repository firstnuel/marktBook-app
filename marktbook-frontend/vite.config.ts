import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  css: {
    devSourcemap: false,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@auth': '/src/features/auth',
      '@utils': '/src/utils',
      '@hooks': '/src/hooks',
      '@styles': '/src/styles',
      '@services': '/src/services',
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@typess': '/src/types',
      '@features': '/src/features',
      '@reducers': '/src/reducers'
    }
  }
})


