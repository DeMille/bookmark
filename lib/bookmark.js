// Node
var fs = require('fs'),
	path = require('path');

// npm
var Table = require('cli-table'),
	colors = require('colors'),
	Datastore = require('nedb');


var db = new Datastore({
	filename: path.join(__dirname, 'bm.db'),
	autoload: true
});


// Hacky check in here for color support
fs.exists(path.join(__dirname, 'colorless'), function (exists) {
	if (exists) {
		wipeColors();
	}
});


var bookmark = {};

bookmark.add = function add(bm_name, optionalPath) {

	var bm_path = getPath(optionalPath);

	db.findOne({name: bm_name}, function(err, doc) {
		if (!doc) {
			return addBookmark(bm_name, bm_path);
		}

		console.log('exists');
	});
};


bookmark.update = function update(bm_name, optionalPath) {

	var bm_path = getPath(optionalPath);

	db.findOne({name: bm_name}, function(err, doc) {
		if (doc) {
			return updateBookmark(bm_name, bm_path);
		}

		console.log('nonexistent');
	});
};


bookmark.list = function list(optionalName) {

	if (optionalName) {
		return getBookmark(optionalName);
	}

	var table = getTable();

	db.find({ name: { $exists: true } }, function (err, docs) {
		for (var i = 0; i < docs.length; i++) {
			table.push([docs[i].name, docs[i].path]);
		}

		console.log(table.toString());
	});
};


bookmark.remove = function remove(bm_name) {

	db.findOne({name: bm_name}, function(err, doc) {
		if (!doc) {
			return console.log("That bookmark doesn't exist yet");
		}
		removeBookmark(bm_name);
	});
};


bookmark.find = function find(bm_name) {
	getBookmark(bm_name);
};


bookmark.color = function color(setting) {
	if (setting == 'off') {
		fs.writeFile(path.join(__dirname, 'colorless'), '', function (err) {
			console.log('Colored output disabled');
		});
	}
	if (setting == 'on') {
		fs.unlink(path.join(__dirname, 'colorless'), function (err) {
			process.stdout.write("Colored output enabled".green);
		});
	}
};


module.exports = bookmark;


function addBookmark(bm_name, bm_path) {
	db.insert({
		name: bm_name,
		path: bm_path
	}, function(err, newDocs) {
		console.log('Bookmark added:'.bold);
		console.log(bm_name.green, bm_path.cyan);
	});
}


function updateBookmark(bm_name, bm_path) {
	db.update({ name: bm_name }, { $set: { path: bm_path } }, function (err) {
		console.log('Bookmark updated:'.bold);
		console.log(bm_name.green, bm_path.cyan);
	});
}


function removeBookmark(bm_name) {
	db.remove({ name: bm_name }, function (err, numRemoved) {
		console.log('Bookmark removed');
	});
}


function getBookmark(bm_name) {
	db.findOne({name: bm_name}, function(err, doc) {
		if (!doc) {
			return console.log('Bookmark not found');
		}
		process.stdout.write(doc.path);
	});
}


function getPath(optionalPath) {
	// check if optional path was provided and, if windows,
	// make sure optional path has a drive prefix. if not assume
	// prefix to be the same as the current drive
	var needsPrefix = optionalPath &&
					  process.platform === "win32" &&
					  !/^[a-z]:/i.test(optionalPath);

	if (needsPrefix) {
		var drive = process.cwd().split(path.sep)[0];
		optionalPath = path.join(drive, optionalPath);
	}

	// strip out any " that might have been added on the cmd (windows)
	if (optionalPath) {
		optionalPath = optionalPath.replace(/\"/g, '');
	}

	return optionalPath || process.cwd();
}


function getTable() {
	return new Table({
		chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
			   , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': ''
			   , 'bottom-right': '', 'left': '' , 'left-mid': '' , 'mid': ''
			   , 'mid-mid': '', 'right': '' , 'right-mid': '' , 'middle': ' ' }
	  , head: ['Bookmark', 'Path']
	  , style : {head: ['cyan']}
	});
}


function wipeColors() {
	(function(){
	    var oldLog = console.log;
	    console.log = function () {
	        var args = Array.prototype.slice.call(arguments);
	        for (var i in args) {
	        	args[i] = args[i].stripColors;
	        }
	        oldLog.apply(console, args);
	    };
	})();
}