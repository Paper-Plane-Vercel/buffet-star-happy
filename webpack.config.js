const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const publicPath = path.join(__dirname, 'public')
const serverPath = path.join(__dirname, 'server')
const clientPath = path.join(__dirname, 'client')
const viewsPath = path.join(serverPath, 'views')
const jsPath = path.join(clientPath, 'js')
const cssPath = path.join(clientPath, 'css')

const copyServerFiles = fs.readdirSync(viewsPath, { withFileTypes: true })
    .filter(folder => folder.isDirectory() && folder.name === 'emails')
    .map(folder => {
        return {
            from: path.join(viewsPath, folder.name),
            to: publicPath,
            noErrorOnMissing: true
        }
    })

const copyClientFiles = fs.readdirSync(clientPath, { withFileTypes: true })
    .filter(folder => folder.isDirectory() && !['js', 'css'].includes(folder.name))
    .map(folder => {
        return {
            from: path.join(clientPath, folder.name),
            to: publicPath,
            noErrorOnMissing: true
        }
    })

const copyFiles = [...copyServerFiles, ...copyClientFiles]

module.exports = {
    entry: {
        app: path.join(jsPath, 'app.js'),
        style: path.join(cssPath, 'style.css')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new CopyPlugin({
            patterns: copyFiles
        })
    ],
    output: {
        path: publicPath
    }
}