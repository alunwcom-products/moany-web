import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  esbuild: {
    // This will remove all console.log and debugger statements
    drop: ['console', 'debugger'],
  },
  build: {
    chunkSizeWarningLimit: 1000, // Raises limit to 1000 kB
  },
})
