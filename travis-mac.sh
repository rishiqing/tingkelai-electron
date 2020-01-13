#!/bin/bash

if echo $TRAVIS_BRANCH | grep "^master-deploy-" > /dev/null; then
  npm run rdp-mac-release
elif echo $TRAVIS_BRANCH | grep "^check-deploy-" > /dev/null; then
  npm run rdp-mac-check
elif echo $TRAVIS_BRANCH | grep "^beta-deploy-" > /dev/null; then
  npm run rdp-mac-beta
fi;
