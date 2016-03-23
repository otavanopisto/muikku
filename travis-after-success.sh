#!/bin/bash

if [[ $deploy = "true" ]]; then
  python travis-prepare-maven.py
  pushd .
  cd muikku
  mvn clean deploy --settings ~/.m2/mySettings.xml -Pgoogle-calendar-plugin,mongo-log-plugin,jndi-mail-plugin,elastic-search-plugin,evaluation-plugin,pyramus-plugins -Dclassifier=otavanopisto
  mvn clean deploy --settings ~/.m2/mySettings.xml -Pmongo-log-plugin,jndi-mail-plugin,elastic-search-plugin,evaluation-plugin,pyramus-plugins -Dclassifier=janakkala
  popd
fi;

if [[ $release = "true" ]]; then
  eval `ssh-agent -s`
  ssh-add .travisdeploykey
  git config user.name "Travis CI"
  git config user.email "travis@travis-ci.org"

  python travis-prepare-maven.py
  git checkout master
  git reset --hard 
  mvn versions:force-releases -Dincludes=fi.pyramus:* --settings ~/.m2/mySettings.xml
  mvn -B release:prepare release:perform -DdryRun=true --settings ~/.m2/mySettings.xml
  git checkout devel
  git reset --hard
  git pull
  git merge master
  mvn versions:use-latest-snapshots -Dincludes=fi.pyramus:* --settings ~/.m2/mySettings.xml
  git push
fi;




