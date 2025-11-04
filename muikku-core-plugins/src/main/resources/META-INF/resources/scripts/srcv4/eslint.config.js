import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";
import jsdoc from "eslint-plugin-jsdoc";

export default defineConfig([
  globalIgnores([
    "dist",
    "generated",
    "node_modules",
    "vite.config.ts",
    "tsconfig.node.json",
    "tsconfig.app.json",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      jsdoc,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,

      // Alternatively, use this for stricter rules. Can be enabled if needed.
      //tseslint.configs.strictTypeChecked,

      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,

      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Core ESLint rules from old config
      camelcase: "warn",
      "no-console": "warn",
      "arrow-body-style": ["warn", "as-needed"],
      "prefer-const": "warn",
      "no-var": "error",

      // TypeScript rules from old config
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",

      // JSDoc rules - only require for specific contexts
      "jsdoc/newline-after-description": "off",
      "jsdoc/require-param-type": "off",
      "jsdoc/require-returns-type": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/tag-lines": "off",
      "jsdoc/require-jsdoc": [
        "warn",
        {
          contexts: [
            "TSMethodSignature",
            "TSInterfaceDeclaration",
            "ClassDeclaration",
            "ClassExpression",
            "MethodDefinition",
            "FunctionDeclaration",
          ],
          require: {
            ClassDeclaration: true,
            ClassExpression: true,
            MethodDefinition: true,
            FunctionDeclaration: true,
          },
        },
      ],

      // React Hooks rules (already covered by reactHooks plugin)
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
]);
