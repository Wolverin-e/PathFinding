import path from 'path';

export default {
	mode: "development", 
	entry: {
		'PathFinding': path.join(__dirname, './src/PathFinding/index.js'), 
		'PageScripts': path.join(__dirname, './src/PageScripts/index.js')
	}, 
	output: {
		path: path.join(__dirname, './build/'), 
		filename: '[name].bundle.js', 
		library: '[name]'
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
		colors: true, 
		modules: false
	},
	devServer: {
		publicPath: '/PathFinding/build/',
		contentBase: path.join(__dirname, './page'), 
		contentBasePublicPath: '/PathFinding/page/', 
		watchContentBase: true, 
		port: 8000
	}, 
	devtool: 'source-map'
};