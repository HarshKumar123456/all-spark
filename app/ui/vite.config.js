import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // This below configuration will allow it to be reachable via any host and it is used when we host it onto some domain.
  server: { 
    allowedHosts: true,
  }
})
