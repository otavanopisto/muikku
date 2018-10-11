#!/bin/bash
if [[ $run_tests == "true" ]]; then
  if [[ $start_sc_tunnel == "true" ]]; then 
    curl -sS https://saucelabs.com/downloads/sc-4.5.1-linux.tar.gz|tar -xzC /tmp/;
    daemon -- /tmp/sc-4.5.1-linux/bin/sc -u $SAUCE_USERNAME -k $SAUCE_ACCESS_KEY -i $TRAVIS_JOB_NUMBER -f /tmp/sc-ready -r 10 --pidfile /tmp/sc.pid --vm-version dev-varnish;
    t=0;
    while [ ! -f /tmp/sc-ready ]; do 
      sleep 1; 
      t=$((t+1)); 
      if [[ $t -gt 180 ]]; then 
        kill -9 `cat /tmp/sc.pid`;
        echo "Unable to get Sauce connection within 3 minutes";
        wait;
        exit 1;
      fi;
    done;
  fi;
