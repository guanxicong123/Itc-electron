module.exports = {
  root: true,
  env: {
    node: true,
    "vue/setup-compiler-macros": true, // defineEmits、defineProps Warning error, see https://eslint.vuejs.org/user-guide/#faq
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
    "./.eslintrc-auto-import.json",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/no-var-requires": "off",
    "vue/no-v-model-argument": "off",
    "vue/multi-word-component-names": "off", // 关闭驼峰命名规则检查
    "@typescript-eslint/no-empty-function": "off", // 关闭空方法检查
    "@typescript-eslint/no-explicit-any": "off", // 关闭any类型的警告
  },
};
