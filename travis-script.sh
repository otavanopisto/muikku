#!/bin/bash
if [[ $TRAVIS_BRANCH != 'master' ]] && [[ $TRAVIS_PULL_REQUEST != false ]]; then
  pushd .;
  cd muikku-atests;
  mvn clean verify 
    -Dmaven.javadoc.skip=true
    -Dsource.skip=true
    -Dit.sauce.browser="$browser"
    -Dit.sauce.browser.version="$browser_version"
    -Dit.sauce.browser.resolution="$browser_resolution"
    -Dit.sauce.platform="$platform"
    -Dit.package="$package"
    -P$it_profile & wait;
  popd;
  if [[ "$?" = "0" ]]; then
    exit 0;
  else
    echo "There were tests in error";
    exit 1;
  fi;
fi;
