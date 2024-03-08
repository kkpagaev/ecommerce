const { resolve } = require("node:path");
const project = resolve(process.cwd(), "tsconfig.json");

const stylistic = require('@stylistic/eslint-plugin')

const customized = stylistic.configs.customize({
  // the following options are the default values
  indent: 2,
  quotes: 'double',
  semi: true,
  arrowParens: 'always',
  // ...
})

module.exports = {
  plugins: ["only-warn", "@stylistic"],
  extends: [
    "eslint:recommended",
    "eslint-config-turbo",
  ],
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
    ".eslintrc.js", "vite.config.ts"
  ],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    // "require-await": "error",
    // "@typescript-eslint/require-await": "warn",
    ...customized.rules,
  },
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
  ],
}
