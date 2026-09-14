import { defineConfig } from 'vite'
import { ViteMurypJsLiteral } from '@muryp/vite-html'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { devConsolePlugin } from './devTools'
import extractAddScriptArgs from './src/tesPluginsAst'

export default defineConfig({
  plugins: [
    extractAddScriptArgs(),
    devConsolePlugin(),
    ViteMurypJsLiteral({
      minify: {
        html: false,
        css: false,
      },
    }),
    tsconfigPaths(),
    tailwindcss(),
  ],
})