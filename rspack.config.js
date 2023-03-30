const path = require("path");
const html = require("@rspack/plugin-html").default;
const env = process.env.NODE_ENV || "development";
const dotEnvFiles =
  env === "development" ? [".env.development"] : [".env.production"];

dotEnvFiles.forEach((doteEnvFile) => {
  require("dotenv-expand")(require("dotenv").config({ path: doteEnvFile }));
});
const REACT_APP = /^REACT_APP_/i;

const filterEnv = {};
const define = Object.keys(process.env)
  .filter((key) => REACT_APP.test(key))
  .reduce((env, key) => {
    filterEnv[key] = process.env[key];
    env[`process.env.${key}`] = JSON.stringify(process.env[key]);
    return env;
  }, {});
/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  context: __dirname,
  entry: {
    main: "./src/index.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.scss/,
        use: [
          {
            loader: "sass-loader",
          },
        ],
        type: "css",
      },
    ],
  },
  builtins: {
    define: {
      ...define,
      "import.meta.env && import.meta.env.MODE": JSON.stringify(env),
      "process.env": JSON.stringify(filterEnv),
    },
    copy: {
      patterns: [
        {
          from: "public",
          globOptions: {
            ignore: ["**/index.html"]
          },
        },
      ],
    },
  },
  plugins: [
    new html({
      template: "./public/index.html",
      templateParameters: false,
    }),
  ],
};
