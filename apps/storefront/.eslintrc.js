/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@mock-my-draft/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
