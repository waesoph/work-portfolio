import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Custom domain (aesoph.ca) serves from site root.
  base: '/',
  plugins: [react()],
})
