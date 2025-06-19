const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');


module.exports = merge(common, {
    mode: 'development',
    // sourcemap
    devtool: 'eval-source-map',
    // dev server
    devServer: {
        watchFiles: ["./src/template.html"],
    },
});