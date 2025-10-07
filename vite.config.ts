import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import { fileURLToPath } from 'node:url';
import viteReact from '@vitejs/plugin-react';
import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin'

const prismaNodeModulesPath = `${getModulePath('@prisma/client')}/node_modules`;

export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [
    tsConfigPaths({ projects: ['./tsconfig.json'] }),
    tanstackStart(),
    viteReact({ babel: { plugins: [['babel-plugin-react-compiler', { target: '19' }]] } }),
    tailwindcss(),
    svgr(),
    nitroV2Plugin()
  ],
  resolve: {
    alias: {
      '.prisma/client/index-browser': `${prismaNodeModulesPath}/.prisma/client/index-browser.js`
    }
  }
});

function getModulePath(moduleName: string) {
  try {
    const moduleUrl = import.meta.resolve(moduleName);
    const modulePath = fileURLToPath(moduleUrl);
    return (
      modulePath
        .substring(0, modulePath.lastIndexOf('node_modules'))
        .replace(/\/+$/, '') || ''
    );
  } catch (error) {
    console.error(
      `Module ${moduleName} resolution failed:`,
      (error as Error).message
    );
    return '';
  }
}

