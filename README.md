# bookmark

**A cross-platform command line bookmarking tool**

With bookmark you can type `bm myProject` to move to a bookmarked directory instead of `cd /really/long/path/to/myProject`.


## What?
I ain't tryin' to waste my time typing out long paths all day.  If you have used python's virtualenvwrapper before, you might miss how the `workon` command can switch directories for you. Bookmark aims to be like that, but for any directory.

![](https://raw.githubusercontent.com/DeMille/bookmark/imgs/bookmark.gif)

Much better right?


## Install
Bookmark requires [Node.js](http://nodejs.org/)

```
$ npm install -g bookmark
```

_then, for **bash** / **zsh**:_

```
$ . bm --add-alias
```
Bookmark relies on .sh/.bat scripts to do its magic. Bookmark feeds those scripts the path you want to `cd` to. For a script's `cd` command to actually change the directory in your current shell you need to 'source' that script.

Typing `$ source bm <bookmark>` every time is lame. You can avoid typing `source` each time by manually adding an alias (`bm="source bm"`) to your `.bash_aliases` or `.bashrc`, or you can let bookmark try to add it for you with `$ . bm --add-alias`.

## How to use
```
Usage: bm [options] [command]

Commands:

  add <bookmark_name> [bookmark_path]
  update <bookmark_name> [bookmark_path]
  remove <bookmark_name>
  list [bookmark_name]
  <bookmark_name>

Options:

  -h, --help  output usage information
  -v  output the version number
```

Commands can also be truncated for less typing:
- add / a
- update / up / u
- remove / rm / r
- list / ls / l

Bookmarks are saved in `bookmark.db` in your home directory.

## Examples
```
# Add a bookmark called myProject at current location:
$ bm add myProject

  Bookmark added:
  myProject C:\User\Person\Projects\myProjectStuff

# Add a bookmark called myProject at given path:
$ bm add myProject \User\Person\Projects\myProjectStuff

  Bookmark added:
  myProject C:\User\Person\Projects\myProjectStuff

# cd to your bookmark's directory
$ bm myProject
```


## Is there a better way to do this?
Probably, but I don't know what it is. I've seen some complex shell scripts floating around the web, but they didn't seem to do exactly what I wanted and I couldn't find any solutions for Windows machines.

It might have been better to exclude Node and only use .sh/.bat scripts, but my .sh/.bat-scripting-fu isn't up to that challenge.


## Changelog
0.2.0 - Support for zsh, fixes for npm prefix paths with spaces
0.2.1 - Fixed windows/cygwin accidental escape chars in path


## License

The MIT License (MIT)

Copyright (c) 2014 Sterling DeMille &lt;sterlingdemille@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.