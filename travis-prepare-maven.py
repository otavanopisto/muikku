#!/usr/bin/env python
import sys
import os
import os.path
import xml.etree.ElementTree as ET

ns = 'http://maven.apache.org/SETTINGS/1.0.0'

if os.environ["TRAVIS_SECURE_ENV_VARS"] == "false":
  print("no secure env vars available, skipping deployment")
  sys.exit()

homedir = os.path.expanduser("~")

ET.register_namespace('', ns)
m2 = ET.parse(homedir + '/.m2/settings.xml')
settings = m2.getroot()
servers = settings.find('s:servers', {'s': ns})
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

repositories = settings.find('s:repositories', {'s': ns})
for elem in (repositories
        .findall("./s:repository[s:id='codehaus-snapshots']", {'s':ns})):
    repositories.remove(elem)

m2.write(homedir + '/.m2/mySettings.xml',
         xml_declaration = True,
         encoding = 'utf-8',
         method = 'xml')
