// core
var fs = require('fs'),
    path = require('path');

// npm
var colors = require('colors'),
    Datastore = require('nedb'),
    Table = require('cli-table');

// configure bookmark datastore-
// save in user's home dir so any updates/changes to bm wont
// kill saved bookmarks
var db = new Datastore({
    filename: path.join(getUserHome(), 'bookmark.db'),
    autoload: true
});

// check for color support
db.findOne({color: false}, function(err, doc) {
    if (doc) wipeColors();
});

//
// Command obj:
//
var bookmark = {};

bookmark.add = function(bm_name, optionalPath) {
    var bm_path = getPath(optionalPath);

    db.findOne({name: bm_name}, function(err, doc) {
        if (err) return dbError();
        if (!doc) return addBookmark(bm_name, bm_path);
        console.log('exists');
    });
};

bookmark.update = function(bm_name, optionalPath) {
    var bm_path = getPath(optionalPath);

    db.findOne({name: bm_name}, function(err, doc) {
        if (err) return dbError();
        if (doc) return updateBookmark(bm_name, bm_path);
        console.log('nonexistent');
    });
};

bookmark.list = function(optionalName) {
    if (optionalName) return getBookmark(optionalName);

    db.find({ name: { $exists: true } }, function (err, docs) {
        if (err) return dbError();

        // No bookmarks yet
        if (docs.length === 0) return console.log('No bookmarks yet');

        // Make & populate table
        var table = getTable();
        for (var i = 0; i < docs.length; i++) {
            table.push([docs[i].name, docs[i].path]);
        }
        console.log(table.toString());
    });
};

bookmark.remove = function(bm_name) {
    db.findOne({name: bm_name}, function(err, doc) {
        if (err) return dbError();
        if (!doc) return console.log("That bookmark doesn't exist yet");
        removeBookmark(bm_name);
    });
};

bookmark.find = function(bm_name) {
    getBookmark(bm_name);
};

bookmark.color = function(setting) {
    if (setting === 'off') {
        db.insert({color: false}, function (err) {
            if (err) return dbError();
            console.log('Colored output disabled');
        });
    }
    if (setting === 'on') {
        db.remove({color: false}, function(err) {
            if (err) return dbError();
            process.stdout.write("Colored output enabled".green);
        });
    }
};

// reusable db operations
function addBookmark(bm_name, bm_path) {
    db.insert({name: bm_name, path: bm_path}, function(err) {
        if (err) return dbError();
        console.log('Bookmark added:'.bold);
        console.log(bm_name.green, bm_path.cyan);
    });
}

function updateBookmark(bm_name, bm_path) {
    db.update({name: bm_name}, {$set: {path: bm_path}}, function (err) {
        if (err) return dbError();
        console.log('Bookmark updated:'.bold);
        console.log(bm_name.green, bm_path.cyan);
    });
}

function removeBookmark(bm_name) {
    db.remove({name: bm_name}, function (err) {
        if (err) return dbError();
        console.log('Bookmark removed');
    });
}

function getBookmark(bm_name) {
    db.findOne({name: bm_name}, function(err, doc) {
        if (err) return dbError();
        if (!doc) return console.log('Bookmark not found');
        process.stdout.write(doc.path);
    });
}

// Generic db error handler
function dbError() {
    console.log('Error accessing boomark db. Try again?'.bold);
}

// Get user's home dir to store the db
// (might break if people have USERPROFILE set to a dir w/o write access)
function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

// Parse out the absolute path for a new bookmark
function getPath(optionalPath) {
    // check if optional path was provided and, if on windows, make sure
    // optional path has a drive prefix (like 'C:\'). if not assume the
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

// Make & format a basic table to look like this:
function getTable() {
    return new Table({
        chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
               , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': ''
               , 'bottom-right': '', 'left': '' , 'left-mid': '' , 'mid': ''
               , 'mid-mid': '', 'right': '' , 'right-mid': '' , 'middle': ' ' }
      , head: ['Bookmark'.bold.cyan, 'Path'.bold.cyan]
    });
}

// Undo all the changes made by the colors module by monkey patching
// them out via .stripColors
//
// This lets us leave the .bold's ect above
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

//
// Export
//
module.exports = bookmark;