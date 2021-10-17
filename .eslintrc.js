module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    // This is already taken care of by the compiler.
    "@typescript-eslint/no-unused-vars" : "off",

    // Conflicts with sonarQubeLint
    "no-restricted-syntax": "off"
  },
  extends: [
      'airbnb-typescript',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: ['.eslintrc.js']
};
