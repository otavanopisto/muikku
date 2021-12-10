#!/bin/bash
BUILD=$1
TEST=$2
DEBUG=$3
FULL=$4
TESTS=("AnnouncerTestsIT" "CommunicatorTestsIT" "CourseAnnouncerTestsIT" "CourseJournalPageTestsIT" "CourseManagementTestsIT" 
  "CourseAccessTestsIT" "CourseTestsIT" "CourseMaterialsPageTestsIT" "CourseMaterialsManagementTestsIT" "CoursePickerTestsIT" "CourseUsersTestsIT" "DiscussionTestsIT" 
  "FlagTestsIT" "GuiderTestsIT" "IndexPageTestsIT" "NewEvaluationTestsIT" "ToRTestsIT" "UserTestsIT")

if [ "$BUILD" == "true" ] ; then 
  echo "-------------------------"
  echo "Building war"
  echo "-------------------------"
  mvn clean install -Pmongo-log-plugin,dummy-mail-plugin,pyramus-plugins,atests-plugin,elastic-search-plugin,evaluation-plugin,developer-tools,timed-notifications-plugin,matriculation-plugin
fi;

echo "-------------------------"
echo "Running tests"
echo "-------------------------"
if [ "$FULL" = "true" ] ; then
  pushd .
  cd muikku-atests
  for i in "${TESTS[@]}"
  do
    mvn clean verify -Pui-it -Dit.test=$i ${@:5} || exit 1
  done
else
  pushd .
  cd muikku-atests
  if [ "$DEBUG" == "true" ] ; then 
    mvn clean verify -Pui-it -Dit.test=$TEST -Dmaven.failsafe.debug ${@:5}
  else
    mvn clean verify -Pui-it -Dit.test=$TEST ${@:5}
  fi;
fi;
popd
