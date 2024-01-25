const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env) => {

    return {
        entry: './src/index.js',
        mode: env.NODE_ENV,
        target: 'node',
        watch: env.NODE_ENV === 'development',
        output: {
            path: path.resolve(__dirname, 'build/'),
            filename: 'bundle.js'
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
            ],
        },
        resolve: {
            extensions: ['.js'],
        },
        externals: [nodeExternals()],
        plugins: [
            new Dotenv(),
            env.NODE_ENV === 'development' && new WebpackShellPlugin({
                onBuildEnd: ['npm run build && npm run dev']
            }),
        ],
        //devserver
        devServer: {
            contentBase: path.join(__dirname, '/build'),
            watchContentBase: true,
            proxy: [
                {
                    context: ['/*', '/**/*', '/**/**/*'],
                    target: 'http://localhost:3030',
                    secure: false,
                },
            ],
            port: 8080, // port webpack-dev-server listens to, defaults to 8080
            overlay: { // Shows a full-screen overlay in the browser when there are compiler errors or warnings
                warnings: false, // defaults to false
                errors: false, // defaults to false
            },
        }
    }

}