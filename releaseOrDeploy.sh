#!/bin/bash
commitmessage=`git log --pretty=format:"%s" -1`;
if [[ ($commitmessage == *"Merge pull request"*) && ($commitmessage == *"from otavanopisto/devel"*) ]]; then 
  eval `ssh-agent -s`
  ssh-add - <<< "${GA_DEPLOY_KEY}"
  git config --global user.name "Github Actions Bot"
  git config --global user.email "github-actions[bot]@users.noreply.github.com"
  # Use default merge strategy.
  git config --global pull.rebase false
  # Push one branch at a time.
  git config --global push.default simple
  git pull
  git checkout master
  git reset --hard
  git pull
  echo Checking latest Pyramus SNAPSHOTS
  mvn org.codehaus.mojo:versions-maven-plugin:2.20.1:use-latest-snapshots -Dincludes=fi.otavanopisto.pyramus:* --settings ~/.m2/mySettings.xml
#  mvn versions:use-latest-snapshots -Dincludes=fi.otavanopisto.pyramus:* --settings ~/.m2/mySettings.xml
  echo Replacing SNAPSHOT versions to releases
  mvn versions:force-releases -Dincludes=fi.otavanopisto.pyramus:* --settings ~/.m2/mySettings.xml
  git add .
  git commit -m "Updated dependency versions"
  echo Releasing
  mvn -B release:prepare release:perform --settings ~/.m2/mySettings.xml
  echo Merging changes back to devel and replacing releases to SNAPSHOTS
  git checkout devel
  git pull
  git merge master
  mvn org.codehaus.mojo:versions-maven-plugin:2.20.1:use-latest-snapshots -Dincludes=fi.otavanopisto.pyramus:* --settings ~/.m2/mySettings.xml
#  mvn versions:use-latest-snapshots -Dincludes=fi.otavanopisto.pyramus:* --settings ~/.m2/mySettings.xml
  git add .
  git commit -m "Updated latest snapshot releases"
  git pull
  git push
fi;
