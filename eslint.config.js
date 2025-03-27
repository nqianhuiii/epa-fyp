module.exports = [
    {
      ignores: ["node_modules/", ".expo/", ".next/", "build/", "android/", "ios/", "assets/"],
      languageOptions: {
        ecmaVersion: 12,
        sourceType: "module",
        parser: require("@typescript-eslint/parser"),
        parserOptions: {
          ecmaFeatures: { jsx: true },
        },
      },
      plugins: {
        "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
        react: require("eslint-plugin-react"),
        reactHooks: require("eslint-plugin-react-hooks"),
      },
      rules: {
        "import/order": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "react/react-in-jsx-scope": "off",
        "react/display-name": "off",
        "@typescript-eslint/no-unused-vars": "warn",
      },
    },
  ];
  