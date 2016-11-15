var fs = require('fs');
var path = require('path');

var Datastore = require('nedb');
var Chalk = require('chalk');
var chalk = new Chalk.constructor({enabled: true});

// user's home dir to store the db
var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

// save bookmarks in user's home dir
var db = new Datastore({
  filename: path.join(home, 'bookmark.db'),
  autoload: true,
});


//
// Command obj:
//
var bookmark = {};

bookmark.add = function(name, optionalPath) {
  var path = getPath(optionalPath);

  db.findOne({name: name}, function(err, doc) {
    if (err) return dbError();

    if (!doc) addBookmark(name, path);
    else console.log('exists');
  });
};

bookmark.update = function(name, optionalPath) {
  var path = getPath(optionalPath);

  db.findOne({name: name}, function(err, doc) {
    if (err) return dbError();

    if (doc) updateBookmark(name, path);
    else console.log('nonexistent');
  });
};

bookmark.list = function(optionalName) {
  if (optionalName) return getBookmark(optionalName);

  db.find({name: {$exists: true}}, function (err, docs) {
    if (err) return dbError();

    if (!docs.length) return console.log('No bookmarks yet');

    // sort fn, sort bookmarks alphabetically
    function alpha(a, b) {
      if (a.name > b.name) return 1
      if (a.name < b.name) return -1
      else return 0;
    }

    // get largest column width (start with 8 for 'Bookmark' header)
    var width = docs.reduce(function(result, doc) {
      return (doc.name.length > result) ? doc.name.length : result;
    }, 8);

    // pad each name, @ least 2 spaces between name and path
    var table = docs.sort(alpha).map(function(doc) {
      return pad(doc.name, width) + '  ' + doc.path;
    });

    // add headers (also padded)
    var header = chalk.green(pad('Bookmark', width)) + '  ' + chalk.cyan('Path');
    table.splice(0, 0, header);

    console.log(table.join('\n'));
  });
};

bookmark.remove = function(name) {
  db.findOne({name: name}, function(err, doc) {
    if (err) return dbError();

    if (doc) removeBookmark(name);
    else console.log("That bookmark doesn't exist yet");
  });
};

bookmark.find = function(name) {
  getBookmark(name);
};


// db operations
function addBookmark(name, path) {
  db.insert({name: name, path: path}, function(err) {
    if (err) return dbError();

    console.log('Bookmark added:\n%s %s',
      chalk.green(name), chalk.cyan(path));
  });
}

function updateBookmark(name, path) {
  db.update({name: name}, {$set: {path: path}}, function (err) {
    if (err) return dbError();

    console.log('Bookmark updated:\n%s %s',
      chalk.green(name), chalk.cyan(path));
  });
}

function removeBookmark(name) {
  db.remove({name: name}, function (err) {
    if (err) return dbError();

    console.log('Bookmark removed');
  });
}

function getBookmark(name) {
  db.findOne({name: name}, function(err, doc) {
    if (err) return dbError();

    if (doc) process.stdout.write(doc.path);
    else console.log('Bookmark not found');
  });
}

// Generic db error handler
function dbError() {
  console.log('Error accessing bookmark db. Try again?');
}


// Parse out the absolute path for a new bookmark
function getPath(path) {
  if (!path) return process.cwd();

  // check if optional path was provided and, if on windows, make sure
  // optional path has a drive prefix (like 'C:\'). if not assume the
  // prefix to be the same as the current drive
  if (process.platform === "win32" && !/^[a-z]:/i.test(path)) {
    var drive = process.cwd().split(path.sep)[0];
    path = path.join(drive, path);
  }

  // strip out any " that might have been added on the cmd (windows)
  path = path.replace(/\"/g, '');

  return path;
}


function escape(str) {
  return str.replace(/\\/g, '\\\\');
}


function pad(str, len) {
  return (str.length >= len)
    ? str
    : str + Array(len - str.length + 1).join(' ');
}


//
// Export
//
module.exports = bookmark;
