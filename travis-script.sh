#!/bin/bash
if [[ $run_tests = "true" && $test_suite = $suite || $run_tests = "true" && $it_profile = "rest-it" ]]; then
  pushd .;
  cd muikku-atests;
  set -e;
  mvn $goals -Dmaven.javadoc.skip=true -Dsource.skip=true -Dit.browser="$browser" -Dit.browser.version="$browser_version" -Dit.browser.resolution="$browser_resolution" -Dit.platform="$platform" -Dit.package="$package" -P$it_profile;
  set +e;
  popd;
else
  echo Skipping testing.
fi;
