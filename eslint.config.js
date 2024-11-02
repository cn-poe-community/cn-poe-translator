import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config({
  files: ["src/**/*.ts"],
  ignores: ["dist/**/*", "**/__tests__/**"],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
  },
});
