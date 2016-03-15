#!/bin/bash
export run_tests=false
export start_sc_tunnel=false
export deploy=false
export rc=false
export release=false
export test_suite=false

if [[ $TRAVIS_PULL_REQUEST != "false" ]] && [[ $TRAVIS_BRANCH == "devel" ]] then;
  export $test_suite="phantom"
  export $run_tests=true
fi;

if [[ $TRAVIS_PULL_REQUEST == "false" ]] && [[ $TRAVIS_BRANCH == "devel" ]] then;
  export $test_suite="phantom"
  export $run_tests=true
fi;

if [[ $TRAVIS_PULL_REQUEST != "false" ]] && [[ $TRAVIS_BRANCH == "master" ]] then;
  export $test_suite="full"
  export $run_tests=true
  export $rc=true
  export $start_sc_tunnel=true
  export deploy=true
fi;

if [[ $TRAVIS_PULL_REQUEST == "false" ]] && [[ $TRAVIS_BRANCH == "master" ]] then;
  commitmessage=`git log --pretty=format:"%s" -1`;
  if [[ ($commitmessage == *"Merge pull request"*) && ($commitmessage == *"from muikku/devel"*) ]]; 
    export release=true
fi;

echo "Test setup: run tests: $run_tests, test suite: $test_suite, start sauce tunnel: $start_sc_tunnel, deploy: $deploy, rc: $rc, release: $release"

