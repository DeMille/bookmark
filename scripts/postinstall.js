// Core
var fs = require('fs'),
	path = require('path'),
	exec = require('child_process').exec;


exec('npm config get prefix', function(err, stdout, stderr) {
	if (err) {
	 	console.log("Couldn't install bookmark scripts in path...");
		throw err;
	}
	installScripts(stdout.trim());
});


function installScripts(prefix) {

	var nixSource = path.join(__dirname, '../shell/bm');
	var winSource = path.join(__dirname, '../shell/bm.bat');
	var nixDest = path.join(prefix, 'bm');
	var winDest = path.join(prefix, 'bm.bat');

	if (process.platform === "win32") {
		fs.createReadStream(winSource).pipe(fs.createWriteStream(winDest));
	}
	fs.createReadStream(nixSource).pipe(fs.createWriteStream(nixDest));
}