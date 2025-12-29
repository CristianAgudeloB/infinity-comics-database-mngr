import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    
  ],
  
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    allowedHosts: [
      'https://library-updater.onrender.com/'
    ]
  },
  
  preview: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
  }
})

