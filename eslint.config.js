import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import lit from 'eslint-plugin-lit'

/** @type {import('eslint').Linter.Config[]} */
export default [
  // 1. Abaikan folder build/output
  { ignores: ['dist/', 'node_modules/'] },


  // 3. Config Recommended
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  // 4. Custom Rules & Parser untuk TypeScript
  {
    files: ['**/*.ts'], // Terapkan aturan ini secara spesifik ke file TS
    languageOptions: {
      parserOptions: {
        projectService: true, // Fitur terbaru typescript-eslint, lebih cepat dari path tsconfig manual
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'comma-dangle': ['error', 'always-multiline'],
      'prefer-template': ['error'],
      'no-multi-spaces': ['error', { ignoreEOLComments: false }],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-trailing-spaces': ['error'],
      'no-mixed-spaces-and-tabs': ['error'],
      'camelcase': ['error'],
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'no-console': ['warn'],
      'no-alert': ['warn'],
    },
  },

  // 5. Lit Plugin Config
  {
    ...lit.configs['flat/recommended'],
    files: ['src/view/**/*.ts'], // Perhatikan: hilangkan './' di depan path untuk pattern matching yang lebih stabil
    rules: {
      ...lit.configs['flat/recommended'].rules, // Pastikan rule bawaan tetap terbawa
      'lit/no-template-map': 'error',
      'lit/no-invalid-html': 'error',
      'lit/prefer-nothing': 'error',
      'lit/no-useless-template-literals': 'error',
      'lit/no-invalid-escape-sequences': 'error',
      'lit/no-duplicate-template-bindings': 'error',
      'lit/quoted-expressions': ['error', 'always'],
    },
  },
]
