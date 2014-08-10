// npm
var program = require('commander');

// Libs
var bookmark = require('./lib/bookmark');

// Package info
var pkg = require("./package.json");


program
  .version(pkg.version);


program
    .command('add <bookmark_name> [bookmark_path]')
    .action(bookmark.add);


program
    .command('update <bookmark_name> [bookmark_path]')
    .action(bookmark.update);


program
    .command('remove <bookmark_name>')
    .action(bookmark.remove);


program
    .command('list [bookmark_name]')
    .action(bookmark.list);


program
    .command('color <on/off>')
    .action(bookmark.color);


program
    .command('*')
    .action(bookmark.find);


// Fudge it up a little
//
// Hide the fact that the script is being called from a shell script
program._name = 'bm';

// Also change the last command from '*' to '<bookmark_name>' to be
// more clear in --help
program.commands[5]._name = '<bookmark_name>';


// Go go go!
program.parse(process.argv);

if (!program.args.length) program.help();
