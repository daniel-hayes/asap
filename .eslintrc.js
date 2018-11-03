module.exports = {
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2018
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    'no-console': 0
  }
};
