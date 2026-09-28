#!/bin/bash
eval `ssh-agent -s`
ssh-add - <<< "${GA_DEPLOY_KEY}"
git config --global user.name "Github Actions Bot"
git config --global user.email "github-actions[bot]@users.noreply.github.com"
# Use default merge strategy.
git config --global pull.rebase false
# Push one branch at a time.
git config --global push.default simple
git checkout devel
git reset --hard
git pull
echo Checking latest Pyramus SNAPSHOTS
mvn org.codehaus.mojo:versions-maven-plugin:2.19.1:use-latest-snapshots -Dincludes=fi.otavanopisto.pyramus:* --settings ~/.m2/mySettings.xml
