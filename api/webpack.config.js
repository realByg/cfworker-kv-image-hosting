const path = require('path')

module.exports = {
	mode: 'production',
	entry: './src/index.ts',
	node: {
		// fs: 'empty',
		// tls: 'empty',
		// net: 'empty',
		// os: true,
	},
	output: {
		filename: 'worker.js',
		path: path.join(__dirname, 'dist'),
	},
	performance: {
		hints: false,
	},
	resolve: {
		extensions: ['.ts', '.js', '.json'],
	},
	module: {
		rules: [
			{
				test: /application.js$/,
				include: /@cfworker/,
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env'],
					plugins: [
						'@babel/plugin-transform-runtime',
						'@babel/plugin-proposal-optional-chaining',
						'@babel/plugin-proposal-nullish-coalescing-operator',
					],
				},
			},
			{
				test: /\.(ts|js)$/,
				include: /src/,
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env', '@babel/preset-typescript'],
					plugins: [
						'@babel/plugin-proposal-class-properties',
						'@babel/plugin-transform-runtime',
						'@babel/plugin-proposal-optional-chaining',
						'@babel/plugin-proposal-nullish-coalescing-operator',
					],
				},
			},
		],
	},
}
