#!/bin/bash
if [[ $run_tests == "true" ]]; then
  if [[ $start_sc_tunnel == "true" ]]; then 
    curl -sS https://saucelabs.com/downloads/sc-4.3.12-linux.tar.gz|tar -xzC /tmp/;
    /tmp/sc-4.3.12-linux/bin/sc -u $SAUCE_USERNAME -k $SAUCE_ACCESS_KEY -i $TRAVIS_JOB_NUMBER -f /tmp/sc-ready -r 10 --pidfile /tmp/sc.pid --vm-version dev-varnish --daemonize;
    t=0;
    while [ ! -f /tmp/sc-ready ]; do 
      sleep 0.5; 
      t=$((t+1)); 
      if [[ $t -gt 180 ]]; then 
        killall sc;
        echo "Unable to get Sauce connection within 3 minutes";
        exit 1;
      fi;
    done;
  fi;
  if [[ $browser == "phantomjs" && $test_suite == "phantom" ]]; then
    if [[ ! -f muikku-atests/.phantomjs/bin/phantomjs ]]; then
      rm -fR muikku-atests/.phantomjs
      curl -sSL "https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-linux-x86_64.tar.bz2"|tar -xvjC muikku-atests/
      mv muikku-atests/phantomjs-2.1.1-linux-x86_64 muikku-atests/.phantomjs
    fi;
  fi;
fi;
