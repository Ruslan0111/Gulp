const path = require('path');
const source_folder = './app';
const project_folder = './dist';

module.exports = {
	mode: 'production',
	devtool: 'inline-source-map',
	entry: source_folder + '/js/index.js',
	output: {
		filename: 'main.min.js',
		path: path.resolve(__dirname, project_folder + '/js/'),
	},
};