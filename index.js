// npm
var program = require('commander');

// local
var pkg = require("./package.json"),
    bookmark = require('./lib/bookmark');

program
    .option('-v', 'output the version number');

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

// Fudge things a little:
// - hide the fact that the script is being called from a shell script
program._name = 'bm';

// - change the last command from '*' to '<bookmark_name>' to be
//   more clear in --help
program.commands[5]._name = '<bookmark_name>';

// Go go go!
program.parse(process.argv);

// Custom parse for version number
if (program.V) console.log(pkg.version);

// show help docs if no args:
if (!program.args.length && !program.V) program.help();