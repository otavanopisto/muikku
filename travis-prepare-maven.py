#!/usr/bin/env python
import sys
import os
import os.path
import xml.etree.ElementTree as ET

if os.environ["TRAVIS_SECURE_ENV_VARS"] == "false":
  print("no secure env vars available, skipping deployment")
  sys.exit()

homedir = os.path.expanduser("~")

m2 = ET.parse(homedir + '/.m2/settings.xml')
root = m2.root
settings = root.find('settings')
servers = settings.find('servers')
if servers is None:
    servers = ET.SubElement(settings, 'servers')

oo_snapshots = ET.SubElement(servers, 'server')
ET.SubElement(oo_snapshots, 'id').text = 'otavanopisto-snapshots'
ET.SubElement(oo_snapshots, 'username').text = os.environ['OOSNAP_USERNAME']
ET.SubElement(oo_snapshots, 'password').text = os.environ['OOSNAP_PASSWORD']

oo_releases = ET.SubElement(servers, 'server')
ET.SubElement(oo_releases, 'id').text = 'otavanopisto-releases'
ET.SubElement(oo_releases, 'username').text = os.environ['OOREL_USERNAME']
ET.SubElement(oo_releases, 'password').text = os.environ['OOREL_PASSWORD']

for elem in root.findall(".//repository[id='codehaus-snapshots']"):
    elem.remove()

m2.write(homedir + '/.m2/mySettings.xml')
