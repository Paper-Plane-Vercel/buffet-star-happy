const { merge } = require('webpack-merge')
const config = require('./webpack.config.js')

module.exports = merge(config, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 3000,
        open: true,
        proxy: [
            {
                context: '/',
                target: 'http://localhost:8001',
                changeOrigin: true,
                secure: false
            }
        ]
    }
})