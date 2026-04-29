import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/volumio-panel.js",
  output: {
    file: "../custom_components/volumio_ws/frontend/volumio-panel.js",
    format: "es",
    sourcemap: false,
  },
  plugins: [
    resolve(),
    terser({
      output: {
        comments: false,
      },
    }),
  ],
};
