#!/bin/bash

if echo $TRAVIS_BRANCH | grep "^master-deploy-" > /dev/null; then
  # npm run rdp-ia32-release
  # npm run rdp-x64-release
  npm run rdp-release
elif echo $TRAVIS_BRANCH | grep "^check-deploy-" > /dev/null; then
  npm run rdp-ia32-check #这个是为了提交各种审核而打的包，包的内容和正式版一样
  npm run rdp-x64-check
elif echo $TRAVIS_BRANCH | grep "^beta-deploy-" > /dev/null; then
  npm run rdp-x64-beta
  npm run rdp-ia32-beta
  npm run rdp-release
fi;
