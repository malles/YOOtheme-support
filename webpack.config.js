var path = require("path");
var webpack = require("webpack");
module.exports = {
    entry: "./app/app.js",
    debug: true,
    output: {
        path: __dirname + '/app/bundle',
        publicPath: "",
        filename: "yoo-support.js"
    },
    resolve: {
        root: [path.join(__dirname, "vendor/assets")]
    },
    module: {
        loaders: [
            { test: /\.vue$/, loader: "vue" },
            { test: /\.html$/, loader: "html" }
        ]
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
    ]
};
