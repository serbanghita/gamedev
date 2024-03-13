const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build")
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "inline-source-map",

    watch: false,

    node: {
        __dirname: true
    },

    resolve: {
        extensions: [".ts", ".json"]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
        ]
    }
};