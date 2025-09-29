import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite';
import svgr from "vite-plugin-svgr";
import { fileURLToPath } from 'node:url';

const prismaNodeModulesPath = `${getModulePath("@prisma/client")}/node_modules`;

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
  resolve: {
    alias: {
      ".prisma/client/index-browser": `${prismaNodeModulesPath}/.prisma/client/index-browser.js`,
    },
  }
})

function getModulePath(moduleName: string) {
  try {
    const moduleUrl = import.meta.resolve(moduleName);
    const modulePath = fileURLToPath(moduleUrl);
    return (
      modulePath
        .substring(0, modulePath.lastIndexOf("node_modules"))
        .replace(/\/+$/, "") || ""
    );
  } catch (error) {
    console.error(
      `Module ${moduleName} resolution failed:`,
      (error as Error).message,
    );
    return "";
  }
}

