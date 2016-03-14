#!/bin/bash
if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
  echo PR. Skipping deploy
  exit 0
fi;
if [[ "$TRAVIS_BRANCH" == "master" && "$it_profile" == "rest-it" ]]; then
  python travis-prepare-maven.py
  pushd .
  cd muikku
  mvn clean deploy --settings ~/.m2/mySettings.xml -Pgoogle-calendar-plugin,mongo-log-plugin,jndi-mail-plugin,elastic-search-plugin,evaluation-plugin,pyramus-plugins -Dclassifier=otavanopisto
  mvn clean deploy --settings ~/.m2/mySettings.xml -Pmongo-log-plugin,jndi-mail-plugin,elastic-search-plugin,evaluation-plugin,pyramus-plugins -Dclassifier=janakkala
  popd
elif [[ "$TRAVIS_BRANCH" == "devel" && "$it_profile" == "rest-it" ]]; then
  if [[ "$findbugs_skip" == "false" ]]; then
      python travis-upload-reports.py
  fi;
  python travis-prepare-maven.py
  mvn clean install
  pushd .
  cd muikku
  mvn clean deploy --settings ~/.m2/mySettings.xml -Pgoogle-calendar-plugin,mongo-log-plugin,jndi-mail-plugin,elastic-search-plugin,evaluation-plugin,pyramus-plugins -Dclassifier=otavanopisto
  mvn clean deploy --settings ~/.m2/mySettings.xml -Pmongo-log-plugin,jndi-mail-plugin,elastic-search-plugin,evaluation-plugin,pyramus-plugins -Dclassifier=janakkala
  popd
else
  echo Skipping it_profile: $it_profile, PR: $TRAVIS_PULL_REQUEST , BRANCH: $TRAVIS_BRANCH
fi;



