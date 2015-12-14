#!/bin/bash
if [[ $TRAVIS_BRANCH == 'master' ]]
then
  python travis-prepare-maven.py
  pushd .
  cd muikku
  mvn clean deploy --settings ~/.m2/mySettings.xml -Pdeus-nex-machina-plugin,google-calendar-plugin,mongo-log-plugin,jndi-mail-plugin,elastic-search-plugin,evaluation-plugin,pyramus-plugins -Dclassifier=otavanopisto
  mvn clean deploy --settings ~/.m2/mySettings.xml -Pmongo-log-plugin,jndi-mail-plugin,elastic-search-plugin,evaluation-plugin,pyramus-plugins -Dclassifier=janakkala
  popd
elif [[ $TRAVIS_BRANCH == 'devel' ]] && [[ $TRAVIS_PULL_REQUEST == 'false' ]] && [[ $use_sc == 'false' ]]
then
  if [[ $findbugs_skip == 'false' ]]; then
      python travis-upload-reports.py
  fi
  python travis-prepare-maven.py
  mvn clean install
  pushd .
  cd muikku
  mvn clean deploy --settings ~/.m2/mySettings.xml -Pdeus-nex-machina-plugin,google-calendar-plugin,mongo-log-plugin,jndi-mail-plugin,elastic-search-plugin,evaluation-plugin,pyramus-plugins -Dclassifier=otavanopisto
  mvn clean deploy --settings ~/.m2/mySettings.xml -Pmongo-log-plugin,jndi-mail-plugin,elastic-search-plugin,evaluation-plugin,pyramus-plugins -Dclassifier=janakkala
  popd
fi



