#!/bin/bash
BUILD=$1
TEST=$2
DEBUG=$3

if [ "$BUILD" == "true" ] ; then 
  echo "-------------------------"
  echo "Building war"
  echo "-------------------------"
  mvn clean install -Pmongo-log-plugin,dummy-mail-plugin,pyramus-plugins,elastic-search-plugin,atests-plugin,evaluation-plugin,timed-notifications-plugin -Dfindbugs.skip=true -Dmaven.javadoc.skip=true -Dsource.skip=true
fi;

echo "-------------------------"
echo "Running tests"
echo "-------------------------"

pushd .
cd muikku-atests
if [ "$DEBUG" == "true" ] ; then 
  mvn clean verify -Pui-it -Dit.test=$TEST -Dmaven.failsafe.debug ${@:4}
else
  mvn clean verify -Pui-it -Dit.test=$TEST ${@:4}
fi;

popd
