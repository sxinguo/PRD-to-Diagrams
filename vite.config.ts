import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // Mermaid v11 splits each diagram type into its own chunk (e.g. journeyDiagram,
  // flowchartDiagram) and loads them via dynamic import the first time the user
  // renders that type. Vite normally pre-bundles on demand, and the second load
  // hits "Outdated Optimize Dep" 504s — which manifest as a "Syntax error in text"
  // because the parser chunk never makes it to the browser. Pre-include the
  // diagram types this app uses so they ship as part of the initial dep bundle.
  optimizeDeps: {
    include: [
      'mermaid',
      'mermaid/dist/diagrams/flowchart/flowchartDiagram',
      'mermaid/dist/diagrams/sequence/sequenceDiagram',
      'mermaid/dist/diagrams/user-journey/journeyDiagram',
    ],
  },
})
