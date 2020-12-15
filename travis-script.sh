#!/bin/bash
if [[ $run_tests == "true" && $test_suite == $suite || $run_tests == "true" && $it_profile == "rest-it" ]]; then
  echo would run tests
else
  echo Skipping testing.
fi;
