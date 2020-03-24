const path = require('path');

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
                test: /\.tsx?$/,
                use: [
                    {
                        loader: require.resolve('ts-loader'),
                    },
                ],
                exclude: /node_modules/,

            },
        ],
    },

    resolve: {
        extensions: [ '.ts', '.js' ],
    },

    optimization: {
        minimize: isProduction
    },

    stats: 'minimal',
};