const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "demo.js",
        path: path.resolve(__dirname, "build"),
        publicPath: "/"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "inline-source-map",

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
        extensions: [".ts", ".json", ".js"]
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

            {
                test: /\.png/,
                type: 'asset/inline'
            },
        ]
    }
};