#!/bin/bash
TESTS=(communicator course course/discussions course/materials course/management course/picker course/journal course/users course/announcer evaluation newevaluation indexpage announcer user discussions guider flags tor)

echo "-------------------------"
echo "Building war"
echo "-------------------------"
mvn clean install -Pmongo-log-plugin,dummy-mail-plugin,pyramus-plugins,elastic-search-plugin,atests-plugin,evaluation-plugin,timed-notifications-plugin

echo "-------------------------"
echo "Running tests"
echo "-------------------------"

pushd .
cd muikku-atests
set -e
for package in ${TESTS[@]}; do
  mvn clean verify -Pui-it -Dit.package="${package}"
done

popd