#!/bin/bash
if [[ $run_tests == "true" && $test_suite == $suite || $run_tests == "true" && $it_profile == "rest-it" || $deploy_snapshot == "true" && $it_profile == "rest-it" || $deploy_release == "true" ]]; then
  echo would install muikku for testing.
fi;
