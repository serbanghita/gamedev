const path = require("path");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "demo.js",
        path: path.resolve(__dirname, "build"),
        publicPath: "/"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    devServer: {
        open: true,
        static: {
            directory: path.join(__dirname, 'build'),
            serveIndex: true,
        },
    },

    watch: false,

    node: {
        __dirname: true
    },

    resolve: {
        extensions: [".ts", ".json", ".js"],
        // https://github.com/dividab/tsconfig-paths-webpack-plugin
        // This plugin helps Webpack reading modules from tsconfig.json "paths".
        plugins: [new TsconfigPathsPlugin({})]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            // { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

            {
                test: /\.png/,
                type: 'asset/inline'
            },
        ]
    }
};