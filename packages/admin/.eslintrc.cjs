/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    project: ["./tsconfig.json", "test/tsconfig.json"],
  },
  extends: ["@repo/eslint-config/node.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: {
    "no-redeclare": "off"
  }
}
