import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change this to /YOUR-REPOSITORY-NAME/ if your GitHub repository has another name.
export default defineConfig({
  plugins: [react()],
  base: '/ARTMITHRA/',
})