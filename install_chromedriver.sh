#!/bin/sh
if [[ $it_profile = "ui-it" || $it_profile = "wcag" ]]; then
  pushd .;
  cd ~
  wget https://chromedriver.storage.googleapis.com/2.35/chromedriver_linux64.zip
  unzip chromedriver_linux64.zip
  sudo cp chromedriver /usr/bin/chromedriver
  sudo chown root /usr/bin/chromedriver
  sudo chmod +x /usr/bin/chromedriver
  sudo chmod 755 /usr/bin/chromedriver
  popd;
fi;