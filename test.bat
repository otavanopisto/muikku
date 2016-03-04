@echo off
SETLOCAL

set _build=0
set _builddir=%~dp0muikku-atests\target
set _builddir=%_builddir:\=/%

if "%1" == "build" (
  set build=1
  mvn clean install -Pmongo-log-plugin,jndi-mail-plugin,pyramus-plugins,elastic-search-plugin,atests-plugin,evaluation-plugin -Dfindbugs.skip=true -Dmaven.javadoc.skip=true -Dsource.skip=true
)

cd muikku-atests

if "%_build%" == "0" (
	set _test=%1
	set _debug=%2
) else (
	set _test=%2
	set _debug=%3
)

if "%_debug%" == "debug" (
  mvn clean verify -Pui-it -Dit.test=%_test% -Dmaven.failsafe.debug -Dit.build.directory=%_builddir%
) else (
  mvn clean verify -Pui-it -Dit.test=%_test% -Dit.build.directory=%_builddir%
)

ENDLOCAL
