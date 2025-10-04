const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
    mode: 'production',
    bail: true,
    context: __dirname,
    entry: {
        main: './assets/js/app.js',
        head_async: ['lazysizes'],
        polyfills: './assets/js/polyfills.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: /(assets\/js|assets\\js|stencil-utils)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            '@babel/plugin-syntax-dynamic-import', // add support for dynamic imports (used in app.js)
                            'lodash', // Tree-shake lodash
                        ],
                        presets: [
                            ['@babel/preset-env', {
                                loose: true, // Enable "loose" transformations for any plugins in this preset that allow them
                                modules: false, // Don't transform modules; needed for tree-shaking
                                useBuiltIns: 'entry',
                                corejs: '^3.6.5',
                            }],
                        ],
                    },
                },
            },
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: '$',
                }],
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, 'assets/dist'),
        publicPath: '/',
        filename: 'theme-bundle.[name].js',
        chunkFilename: 'theme-bundle.chunk.[name].js'
    },
    performance: {
        hints: 'warning',
        maxAssetSize: 1024 * 300,
        maxEntrypointSize: 1024 * 300
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['assets/dist'],
            verbose: true,
            dry: false
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        }),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production'
        })
    ],
    resolve: {
        alias: {
            jquery: 'jquery/dist/jquery.min.js',
            jstree: 'jstree/dist/jstree.min.js',
            lazysizes: 'lazysizes/lazysizes.min.js',
            nanobar: 'nanobar/nanobar.min.js',
            'slick-carousel': 'slick-carousel/slick/slick.min.js',
            'svg-injector': 'svg-injector/dist/svg-injector.min.js',
            sweetalert2: 'sweetalert2/dist/sweetalert2.min.js'
        },
        extensions: ['.js', '.json'],
        modules: [
            path.resolve(__dirname, 'node_modules'),
            'node_modules'
        ]
    },
};
