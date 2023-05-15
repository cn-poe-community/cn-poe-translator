import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default [
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "esm",
    },
    plugins: [typescript()],
  },
  {
    input: "src/index.global.ts",
    output: {
      file: "dist/translator.global.min.js",
      format: "iife",
      name: "CnPoeTranslator",
    },
    plugins: [typescript(), terser()],
  },
];
