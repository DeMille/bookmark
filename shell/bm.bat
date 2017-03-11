@echo off

set script="%~dp0\node_modules\bookmark\cli\cli.js"


:: Command Help (first, before the other cases below)
if "%2"=="-h" (
    goto :getCommandHelp
)
if "%2"=="--help" (
    goto :getCommandHelp
)


:: Add
if "%1"=="add" (
    goto :addBookmark
)
if "%1"=="a" (
    goto :addBookmark
)


:: Update
if "%1"=="update" (
    goto :updateBookmark
)
if "%1"=="up" (
    goto :updateBookmark
)
if "%1"=="u" (
    goto :updateBookmark
)


:: Remove
if "%1"=="remove" (
    goto :removeBookmark
)
if "%1"=="r" (
    goto :removeBookmark
)
if "%1"=="rm" (
    goto :removeBookmark
)


:: List
if "%1"=="list" (
    goto :listBookmark
)
if "%1"=="ls" (
    goto :listBookmark
)
if "%1"=="l" (
    goto :listBookmark
)


:: Color
if "%1"=="color" (
    goto :runAndEcho
)


:: Version
if "%1"=="-v" (
    goto :runAndEcho
)


:: Help
if "%1"=="--help" (
    goto :getHelp
)
if "%1"=="-h" (
    goto :getHelp
)


:: cd to bookmark
if "%1"=="" (
    goto :getHelp
) else (
    :: All other cases, fetch the bookmark
    goto :getBookmark
)


:addBookmark
for /f "delims=*" %%a in ('node %script% add %2 %3 ^| findstr /n "^"') do @if "%%a"=="1:exists" (
    goto :ifExists
    goto :EOF
) else (
    set "line=%%a"
    setlocal enableDelayedExpansion
    set "line=!line:\\=\!" :: remove extra escape \'s
    set "line=!line:*:=!"  :: remove line number, preserving empty newlines
    echo(!line!
    endlocal
)
goto :EOF


:updateBookmark
for /f "delims=*" %%a in ('node %script% update %2 %3 ^| findstr /n "^"') do @if "%%a"=="1:nonexistent" (
    goto :nonExists
    goto :EOF
) else (
    set "line=%%a"
    setlocal enableDelayedExpansion
    set "line=!line:\\=\!" :: remove extra escape \'s
    set "line=!line:*:=!"  :: remove line number, preserving empty newlines
    echo(!line!
    endlocal
)
goto :EOF


:removeBookmark
for /f "tokens=1* delims=:" %%a in ('node %script% remove %2 ^| findstr /n "^"') do echo(%%b
goto :EOF


:listBookmark
for /f "delims=*" %%a in ('node %script% list %2 ^| findstr /n "^"') do (
    set "line=%%a"
    setlocal enableDelayedExpansion
    set "line=!line:\\=\!" :: remove extra escape \'s
    set "line=!line:*:=!"  :: remove line number, preserving empty newlines
    echo(!line!
    endlocal
)
goto :EOF


:runAndEcho
for /f "delims=*" %%a in ('node %script% %* ^| findstr /n "^"') do (
    set "line=%%a"
    setlocal enableDelayedExpansion
    set "line=!line:\\=\!" :: remove extra escape \'s
    set "line=!line:*:=!"  :: remove line number, preserving empty newlines
    echo(!line!
    endlocal
)
goto :EOF


:getHelp
for /f "tokens=1* delims=:" %%a in ('node %script% --help ^| findstr /n "^"') do echo(%%b
goto :EOF


:getCommandHelp
for /f "tokens=1* delims=:" %%a in ('node %script% %1 --help ^| findstr /n "^"') do echo(%%b
goto :EOF


:getBookmark
for /f "delims=" %%a in ('node %script% %1') do @if "%%a"=="Bookmark not found" (
    echo This bookmark does not exist yet
) else (
    cd /d %%a
)
goto :EOF


:ifExists
set /P ANSWER=Bookmark already exists, do you want to update? %=%
if /i {%ANSWER%}=={yes} (
    goto :updateBookmark
    goto :EOF
)
if /i {%ANSWER%}=={yar} (
    goto :updateBookmark
    goto :EOF
)
if /i {%ANSWER%}=={y} (
    goto :updateBookmark
    goto :EOF
) else (
    goto :EOF
)


:nonExists
set /P ANSWER=Bookmark doesn't exist, do you want to create one here? %=%
if /i {%ANSWER%}=={yes} (
    goto :addBookmark
    goto :EOF
)
if /i {%ANSWER%}=={yar} (
    goto :addBookmark
    goto :EOF
)
if /i {%ANSWER%}=={y} (
    goto :addBookmark
    goto :EOF
) else (
    goto :EOF
)