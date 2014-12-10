@echo off


set script=%~dp0\node_modules\bookmark\index.js


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


:: Command Help (just in case, it seems fickle)
if "%2"=="-h" (
	goto :getCommandHelp
)
if "%2"=="--help" (
	goto :getCommandHelp
)


:: Help
if "%1"=="--help" (
    goto :getHelp
)
if "%1"=="-h" (
    goto :getHelp
)

if "%1"=="" (
    goto :getHelp

) else (
	:: All other cases, fetch the bookmark
    goto :getBookmark
)


:addBookmark
for /f "delims=" %%a in ('node %script% add %2 %3') do @if "%%a"=="exists" (
	goto :ifExists
	goto :EOF
) else (
	echo %%a
)
goto :EOF


:updateBookmark
for /f "delims=" %%a in ('node %script% update %2 %3') do @if "%%a"=="nonexistent" (
	goto :nonExists
	goto :EOF
) else (
	echo %%a
)
goto :EOF


:removeBookmark
for /f "delims=" %%a in ('node %script% remove %2') do @echo %%a
goto :EOF


:listBookmark
for /f "delims=" %%a in ('node %script% list %2') do @echo %%a
goto :EOF


:runAndEcho
for /f "delims=" %%a in ('node %script% %*') do @echo %%a
goto :EOF


:getHelp
for /f "delims=" %%a in ('node %script% --help') do @echo %%a
goto :EOF


:getCommandHelp
for /f "delims=" %%a in ('node %script% %1 --help') do @echo %%a
goto :EOF


:getBookmark
for /f "delims=" %%a in ('node %script% %1') do @if "%%a"=="Bookmark not found" (
	echo This bookmark does not exist yet
) else (
	cd /d %%a
)
goto :EOF


:ifExists
SET /P ANSWER=Bookmark already exists, do you want to update? %=%
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
SET /P ANSWER=Bookmark doesn't exist, do you want to create one here? %=%
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