import eslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
    },
    plugins: { '@typescript-eslint': eslint },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'eqeqeq': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-dupe-keys': 'error',
      'no-empty': 'error',
      'no-unreachable': 'error',
    },
  },
];
