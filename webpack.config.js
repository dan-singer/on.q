const path = require('path');

module.exports = {
    entry: {
        landing: './client/landing.js',
        event: './client/event.js',
        'act-signup': './client/act-signup.js',
        
    },
    output: {
        path: path.resolve(__dirname, 'dist/js')
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.m?js?/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }

        ]
    },
    watch: true
}