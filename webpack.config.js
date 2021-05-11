const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function inlineOptions(loaders) {
    return loaders.map(({ loader, options = {} }) => {
        return loader + '?' + JSON.stringify(options);
    });
}

const config = {
    context: __dirname,
    entry: './src/app.tsx',
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },

    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.(woff|woff2)$/,
                use: {
                    loader: 'url-loader',
                },
            },
            {
                test: /\.ext$/,
                use: ['cache-loader', 'ts-loader'],
                include: path.resolve('src'),
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },

            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
            },

            {
                test: /.css$/,
                use: (info) => {
                    return inlineOptions([
                        { loader: 'style-loader' },

                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: !info.resource.includes('antd')
                                        ? '[path]-[name]__[local]'
                                        : '[local]',
                                },
                            },
                        },
                    ]);
                },
            },
        ],
    },

    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            caTypes: path.resolve(__dirname, 'src/types/'),
            caComponents: path.resolve(__dirname, 'src/components/'),
            caStore: path.resolve(__dirname, 'src/store/'),
            caScreens: path.resolve(__dirname, 'src/screens/'),
        },
    },

    devServer: {
        contentBase: path.join(__dirname, './public'),
        port: 3000,
        host: 'localhost',
        historyApiFallback: true,
        hot: true,
    },
};

module.exports = (env, argv) => {
    config.plugins = [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
        }),
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './src/assets/img',
                    to: './assets/img',
                },
            ],
        }),
    ];

    if (argv.mode === 'development') {
        config.devtool = 'source-map';
        config.plugins = [...config.plugins, new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)];
    }

    if (argv.mode === 'production') {
        config.plugins = [...config.plugins, new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)];
    }

    return config;
};
