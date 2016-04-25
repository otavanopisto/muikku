#!/bin/bash
if [[ $run_tests = "true" && $test_suite = $suite || $run_tests = "true" && $it_profile = "rest-it" || $deploy_snapshot == "true" && $it_profile = "rest-it" ]]; then
  mvn clean
  mvn install -Pmongo-log-plugin,jndi-mail-plugin,pyramus-plugins,elastic-search-plugin,atests-plugin,evaluation-plugin -Dfindbugs.skip=$findbugs_skip -Dmaven.javadoc.skip=true -Dsource.skip=true
fi;