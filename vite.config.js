import { defineConfig } from 'vite';
import { resolve } from 'path';
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [ mkcert() ],
  // Base public path (adjust for your deployment)
  base: '/advice-generator/',
  
  build: {
    // Where to output built files
    outDir: 'dist',
    
    // Directory for assets (JS, CSS, images)
    assetsDir: 'src',
    
    // Minify build
    minify: true,
    
    rollupOptions: {
      // Main entry point
      input: {
        main: resolve(__dirname, 'index.html')
      },
      
      // Ensure static assets are copied
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  },
  
  // Development server options
  server: {
    port: 3000,
    open: true
  },
  
  // Enable sourcemaps for debugging
  sourcemap: true
});
