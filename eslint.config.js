import js from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import eslintPluginAstro from 'eslint-plugin-astro';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // 忽略文件
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.astro/**',
      '*.min.js',
      'coverage/**',
      'public/**',
      'build/**',
      'out/**',
    ],
  },

  // React 配置 - 指定 React 版本
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    settings: {
      react: {
        version: 'detect', // 自动检测 React 版本
      },
    },
  },

  // JavaScript 文件配置
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        process: 'readonly', // 定义 process 全局变量
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 'error',
      'no-undef': 'off', // 关闭 no-undef，因为已经在 languageOptions.globals 中定义了
    },
  },

  // TypeScript 文件配置
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        process: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // '@typescript-eslint/prefer-const': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 'error',
      'no-undef': 'off',
    },
  },

  // Astro 文件配置

  ...eslintPluginAstro.configs.recommended,

  // JSX A11y 配置
  {
    files: ['**/*.{jsx,tsx,astro}'],
    plugins: {
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      ...jsxA11yPlugin.configs.recommended.rules,
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
    },
  },

  // 导入排序规则
  {
    files: ['**/*.{js,jsx,ts,tsx,astro}'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'astro/**',
              group: 'external',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
        },
      ],
    },
  },
];
