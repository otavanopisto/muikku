#!/bin/sh

BUILD=$1
TEST=$2
DEBUG=$3

if [ "$BUILD" == "true" ] ; then 
  echo "-------------------------"
  echo "Building war"
  echo "-------------------------"
  mvn clean install -Pmongo-log-plugin,jndi-mail-plugin,pyramus-plugins,elastic-search-plugin,atests-plugin,evaluation-plugin -Dfindbugs.skip=true -Dmaven.javadoc.skip=true -Dsource.skip=true
fi;

echo "-------------------------"
echo "Running tests"
echo "-------------------------"

pushd .
cd muikku-atests
if [ "$DEBUG" == "true" ] ; then 
  mvn clean verify -Pui-it -Dit.test=$TEST -Dmaven.failsafe.debug
else
  mvn clean verify -Pui-it -Dit.test=$TEST
fi;

popd
