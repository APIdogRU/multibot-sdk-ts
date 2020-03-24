const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const mode = isProduction ? 'production' : 'development';

module.exports = {
    mode,

    target: 'node',

    entry: {
        main: path.resolve('src', 'index.ts'),
    },

    output: {
        path: path.resolve('dist'),
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'ts-loader',
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
        ],
    },

    resolve: {
        extensions: [ '.ts', '.js' ],
    },

    optimization: {
        minimize: isProduction,
        minimizer: [new TerserPlugin()],
    },

    stats: 'minimal',
};