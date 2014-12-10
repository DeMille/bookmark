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

_then, for **bash** / **cygwin**:_

```
$ bm --add-alias
```
Bookmark relies on .sh/.bat scripts to do its magic. Bookmark feeds those scripts the path you want to `cd` to. For a script's `cd` command to actually change the directory in your current shell you need to 'source' that script.

Typing `$ source bm <bookmark>` every time is lame. You can avoid typing `source` each time by manually adding an alias (`bm="source bm"`) to your `.bash_aliases` or `.bashrc`, or you can let bookmark try to add it for you with `$ bm --add-alias`.

Once you've done that, you need to `$ source .bash_aliases` (or .bashrc, wherever the alias is) for the changes to take effect in your current shell.

## How to use
```
Usage: bm [options] [command]

Commands:

  add <bookmark_name> [bookmark_path]
  update <bookmark_name> [bookmark_path]
  remove <bookmark_name>
  list [bookmark_name]
  color <on/off>
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

Using old busted cmd.exe and ANSI escape codes are coming out funky like: `\033[K \033[%dd`? <br/>
No problem, run `bm color off`.

As a side note, if you don't have a nice Windows terminal set up, check out one of these:
- [cmder](http://bliker.github.io/cmder/) (built on [ConEmu](https://conemu.codeplex.com/))
- [Babun](http://babun.github.io/)

If you use Babun, just be aware that bookmark doesn't work with zsh yet.

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