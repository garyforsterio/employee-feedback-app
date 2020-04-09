module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'simple-import-sort', 'prettier', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'prettier/prettier': ['error', { singleQuote: true }],
    'simple-import-sort/sort': [
      'error',
      {
        groups: [
          // Node.js packages.
          [`^(${require('module').builtinModules.join('|')})(/|$)`],
          // NPM packages. `react` related packages come first.
          ['^react', '^@?\\w'],
          // Absolute imports and other imports such as Vue-style `@/foo`.
          // Anything that does not start with a dot.
          ['^[^.\\u0000]'],
          // Relative imports.
          // Anything that starts with a dot.
          ['^\\.'],
          // Side effect imports.
          ['^\\u0000'],
        ],
      },
    ],
  },
};
