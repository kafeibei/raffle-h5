let basePaths = 'category';
let buildPaths = '../kafeibei'

let baseConfig = {
	isDev : true,
	sourceMap : true,
	sassStyle: 'compact',
	cssRename : true,
	paths: {
		html	: basePaths+'/src',
		css		: basePaths+'/src',
		script	: basePaths+'/src',
		json 	: basePaths+'/src',
		image	: basePaths+'/src'
	},
	pathsDev: {
		html	: basePaths+'/dist',
		css		: basePaths+'/dist',
		script	: basePaths+'/dist',
		json 	: basePaths+'/dist',
		image	: basePaths+'/dist'
	},
	pathsTest: {
		html	: basePaths+'/dist_test',
		css		: basePaths+'/dist_test',
		script	: basePaths+'/dist_test',
		json 	: basePaths+'/dist_test',
		image	: basePaths+'/dist_test'
	},
	pathsBuild: {
		html	: buildPaths + '/raffle',
		css		: buildPaths + '/raffle',
		script	: buildPaths + '/raffle',
		json 	: buildPaths + '/raffle',
		image	: buildPaths + '/raffle'
	},
	autoprefixerConfig: {
		browsers: ['last 2 version']
	},
	base64Config: {
		extensions: ['png'],
		maxImageSize: 8*1024
	},
	pxToViewport: true
}

let projectConfig = require('./' + basePaths + '/project.config');

for ( let k in projectConfig ) {
	if ( projectConfig[k] != undefined) {
		baseConfig[k] = projectConfig[k]
	}
}

module.exports = baseConfig;
