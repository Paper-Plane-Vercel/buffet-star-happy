const { merge } = require('webpack-merge')
const config = require('./webpack.config.js')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = merge(config, {
    mode: 'production',
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: false
            }),
            new CssMinimizerPlugin()
        ]
    }
})