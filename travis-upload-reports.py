#!/usr/bin/env python2

import os
import glob
import subprocess

PUT_URL = "http://kooditohtori.ofw.fi/reports/{project}/{num}"
TRAVIS_BUILD_NUMBER = os.getenv('TRAVIS_BUILD_NUMBER')
KOODITOHTORI_PWD = os.getenv('KOODITOHTORI_PWD')

for filepath in glob.iglob('*/target/findbugs/findbugsXml.xml'):
    project = filepath.split('/')[0]
    subprocess.call([
            "curl",
            "--user", "kooditohtori:" + KOODITOHTORI_PWD,
            "-T", filepath,
            PUT_URL.format(project=project, num=TRAVIS_BUILD_NUMBER)])
