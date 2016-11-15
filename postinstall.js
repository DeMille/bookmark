// only need to do this for windows
if (process.platform !== "win32") process.exit();

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

exec('npm config get prefix', function(err, stdout, stderr) {
  if (err) {
    console.log("Couldn't install bookmark scripts in path...");
    throw err;
  }

  var prefix = stdout.trim();

  var batSource  = path.join(__dirname, './shell/bm.bat');
  var bashSource = path.join(__dirname, './shell/bm');
  var batDest    = path.join(prefix, 'bm.bat');
  var bashDest   = path.join(prefix, 'bm');

  // write bm.bat
  fs.createReadStream(batSource).pipe(fs.createWriteStream(batDest));
  // overwirte bm bash script
  fs.createReadStream(bashSource).pipe(fs.createWriteStream(bashDest));
});
