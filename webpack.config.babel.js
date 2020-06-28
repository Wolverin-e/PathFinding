import path from 'path';

export default {
	entry: path.join(__dirname, './src/index.js'), 
	output: {
		path: path.join(__dirname, './page/scripts/'), 
		filename: 'PathFinding.bundle.js'
	}, 
	module: {
		rules: [{
			test: /\.js$/, 
			exclude: /node_modules/, 
			use: [{
				loader: 'babel-loader', 
				options:{
					presets: [
						[
							"@babel/preset-env",
							{
								"targets": "defaults"
							}
						]
					]
				}
			}]
		}, {
			test: /\.js$/, 
			exclude: /node_modules/, 
			use: [{
				loader: 'eslint-loader'
			}]
		}]
	}, 
	stats: {
		colors: true
	},
	devServer: {
		publicPath: '/PathFinding/page/scripts/',
		contentBase: path.join(__dirname, './page'), 
		contentBasePublicPath: '/PathFinding/page/', 
		watchContentBase: true, 
		port: 8000
	}, 
	devtool: 'source-map'
};