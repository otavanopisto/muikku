#!/bin/bash
export run_tests=true
export start_sc_tunnel=false
#export deploy=false
export rc=false
export devel_merge=false
#export release=false

#if [[ $TRAVIS_PULL_REQUEST != "false" ]]; then
#  export run_tests=true
#  if [[ $TRAVIS_BRANCH == "master" ]]; then
#    export rc=true
#  fi;
#else
#  if [[ $TRAVIS_BRANCH == "master" ]]; then
#    export release=true
#  fi;
#fi;

if [[ $TRAVIS_PULL_REQUEST == "false" ]] && [[ $TRAVIS_BRANCH == 'devel' ]]; then
  export devel_merge=true
  export start_sc=true
fi;

if [[ $use_sc == "true" ]] && [[ $run_tests == "true" ]]; then
  export start_sc_tunnel=true
fi;

#if [[ $TRAVIS_PULL_REQUEST == "false" ]] && [[ $TRAVIS_BRANCH == "devel" ]]; then
#  export deploy=true
#fi;

echo "Test setup: run tests: $run_tests, start sauce tunnel: $start_sc_tunnel, deploy: $deploy, rc: $rc, release: $release"
