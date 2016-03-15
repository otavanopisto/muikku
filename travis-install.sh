#!/bin/bash
# Staging build and PRs
# is devel branch and is PR or rest-it profile
if [[ "$TRAVIS_BRANCH" == "devel" ]] && [[ "$TRAVIS_PULL_REQUEST" != "false" || "$it_profile" == "rest-it" ]]; then
 echo "Installoi testiä varten"
 # mvn install -Pmongo-log-plugin,jndi-mail-plugin,pyramus-plugins,elastic-search-plugin,atests-plugin,evaluation-plugin -Dfindbugs.skip=$findbugs_skip -Dmaven.javadoc.skip=true -Dsource.skip=true
fi;
if [[ $TRAVIS_BRANCH = "master" && TRAVIS_PULL_REQUEST != "false" && $it_profile == "rest-it"  ]]; then
  echo "Installoi RC testiä varten"
fi;
# Master build
# Master branch, not PR and is rest profile
if [[ "$TRAVIS_BRANCH" == "master" && "$TRAVIS_PULL_REQUEST" == "false" && "$it_profile" == "rest-it" ]]; then
 echo "Installoi master asetuksilla"
 #mvn install -Dfindbugs.skip=$findbugs_skip -Dmaven.javadoc.skip=true -Dsource.skip=true
fi;
