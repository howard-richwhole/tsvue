require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  globals: {
    _: 'readonly',
  },
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
  ],
  rules: {
    'prettier/prettier': [
      2,
      {
        singleQuote: true, // 使用單引號 ；eslint => quotes
        semi: false, // 不使用尾部分號；eslint => semi
        trailingComma: 'all', // 禁止尾部逗號；eslint => comma-dangle
        jsxBracketSameLine: true, // html > 不單獨一列
        arrowParens: 'avoid', // 箭頭函式 argument 一個時不用括號；eslint => arrow-parens
        htmlWhitespaceSensitivity: 'ignore',
      },
    ],
  },
}
