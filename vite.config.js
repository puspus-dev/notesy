import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '', // GitHub Pages esetén később beállíthatod: '/REPO_NEV/'
})
