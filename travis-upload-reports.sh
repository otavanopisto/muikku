#!/bin/sh

executable=$(readlink -f "$0")

if test "$1" == "upload_project"; then
  pushd ../../
  projname=$(basename $(pwd))
  popd
  curl \
    --user kooditohtori:$KOODITOHTORI_PWD \
    -T findbugsXml.xml \
    http://kooditohtori.ofw.fi/reports/$projname/$TRAVIS_BUILD_NUMBER
else
  PATH="/bin:/usr/bin" find . -name findbugsXml.xml -execdir $executable upload_project \;
fi
