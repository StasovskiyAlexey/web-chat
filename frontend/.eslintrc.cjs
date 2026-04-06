module.exports = {
  root: true, // корневой конфигурационный файл
  env: {
    // сообщает ESLint какие глобальные переменные доступны.
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser', // ESLint по умолчанию не умеет читать TypeScript, поэтому нужен парсер
  parserOptions: {
    ecmaFeatures: { jsx: true }, // Позволяет использовать JSX в React.
    ecmaVersion: 'latest', // Разрешает весь современный JS.
    sourceType: 'module', // Разрешает import / export.
  },
  settings: {
    react: { version: 'detect' }, // Плагин автоматически определяет версию React → меньше проблем.
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'], // Если импорт не найден, попробуй эти расширения
      },
      alias: {
        map: [['@', './src']], // Алиасы которые упрощают создание путей
        extensions: ['.ts', '.tsx', '.js', '.jsx'], // Типы расширений файлов которые будут подхватываться
      },
    },
  },
  plugins: [
    // Плагины = дополнительные правила.
    'react',
    'react-hooks',
    '@typescript-eslint',
    'import',
    'prettier',
  ],
  extends: [
    //
    'eslint:recommended',

    // React
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',

    // TS
    'plugin:@typescript-eslint/recommended',

    // Prettier
    'plugin:prettier/recommended',

    // Импорт
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {
    // Применяем Prettier как ESLint-правило
    'prettier/prettier': 'error',

    // Общие правила
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',

    // Импорт
    'import/no-unresolved': 'error',

    // TypeScript рекомендуемые улучшения
    '@typescript-eslint/no-unused-vars': ['warn'],

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
