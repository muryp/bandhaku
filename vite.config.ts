import { defineConfig } from 'vite'
import { ViteMurypJsLiteral } from '@muryp/vite-html'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    ViteMurypJsLiteral({
      minify: {
        html: false,
        css: false,
      },
    }),
    tsconfigPaths(),
  ],
})