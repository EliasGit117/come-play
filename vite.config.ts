import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite';
import svgr from "vite-plugin-svgr";


export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths({ projects: ['./tsconfig.json'] }),
    tanstackStart({
      react: {
        babel: {
          plugins: [['babel-plugin-react-compiler', { target: '19' }]],
        }
      }
    }),
    svgr(),
    tailwindcss()
  ],
})
