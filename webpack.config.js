const path = require('path');
const source_folder = './app';

module.exports = {
	mode: 'production',
	devtool: 'inline-source-map',
	entry: source_folder + '/js/src_js/index.js',
	output: {
		filename: 'main.min.js',
		path: path.resolve(__dirname, source_folder + '/js/'),
	},
};