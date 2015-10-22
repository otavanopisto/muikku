#!/bin/bash
if [[ $TRAVIS_BRANCH == 'master' ]]
then
  python travis-prepare-maven.py
  pushd .
  cd muikku
  mvn clean deploy --settings ~/.m2/mySettings.xml -Pdeus-nex-machina-plugin,google-calendar-plugin,mongo-log-plugin,jndi-mail-plugin,elastic-search-plugin,pyramus-plugins -Dclassifier=otavanopisto
  mvn clean deploy --settings ~/.m2/mySettings.xml -Pmongo-log-plugin,jndi-mail-plugin,elastic-search-plugin,pyramus-plugins -Dclassifier=janakkala
  popd
elif [[ $TRAVIS_BRANCH == 'devel' ]]
then
  if [[ $findbugs_skip == 'false' ]]; then
      python travis-upload-reports.py
  fi
  python travis-prepare-maven.py
  pushd .
  cd muikku
  mvn clean deploy --settings ~/.m2/mySettings.xml -Pdeus-nex-machina-plugin,google-calendar-plugin,mongo-log-plugin,jndi-mail-plugin,elastic-search-plugin,pyramus-plugins -Dclassifier=otavanopisto
  mvn clean deploy --settings ~/.m2/mySettings.xml -Pmongo-log-plugin,jndi-mail-plugin,elastic-search-plugin,pyramus-plugins -Dclassifier=janakkala
  popd
fi
