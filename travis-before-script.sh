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
      echo "PhantomJS not found. Downloading..."
      rm -fR muikku-atests/.phantomjs
      wget -O phantomjs-1.9.8-linux-x86_64.tar.bz2 https://www.dropbox.com/s/u4roar334nu8n4c/phantomjs-1.9.8-linux-x86_64.tar.bz2?dl=1 & wait
      tar -jxf phantomjs-1.9.8-linux-x86_64.tar.bz2 & wait
      mv phantomjs-1.9.8-linux-x86_64 muikku-atests/.phantomjs
    else
      echo "Found PhantomJS"
    fi;
  fi;
fi;
