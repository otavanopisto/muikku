#!/bin/bash
if [[ "$TRAVIS_BRANCH" != "devel" ]]; then
  echo 'Branch is not devel, exiting.'
  exit 0
fi;
if [[ "$TRAVIS_PULL_REQUEST" != "false" || "$it_profile" == "rest-it" ]]; then
  echo PR : $TRAVIS_PULL_REQUEST , it_profile: $it_profile
  pushd .;
  cd muikku-atests;
  set -e; 
  mvn clean verify -Dmaven.javadoc.skip=true -Dsource.skip=true -Dit.browser="$browser" -Dit.browser.version="$browser_version" -Dit.browser.resolution="$browser_resolution" -Dit.platform="$platform" -Dit.package="$package" -P$it_profile;
  set +e;
  popd;
else
  echo Skipping it_profile: $it_profile, PR: $TRAVIS_PULL_REQUEST , BRANCH: $TRAVIS_BRANCH
fi;
