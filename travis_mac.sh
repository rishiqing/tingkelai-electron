#!/bin/bash

if echo $TRAVIS_BRANCH | grep "^master-deploy-" > /dev/null; then
  npm run rdp-mac-release
elif echo $TRAVIS_BRANCH | grep "^check-deploy-" > /dev/null; then
  npm run rdp-mac-check
elif echo $TRAVIS_BRANCH | grep "^beta-deploy-" > /dev/null; then
  npm run rdp-mac-beta
fi;

# 等后期时间充裕，学习 shell 脚本后可以去将两个 .sh 文件整合，可以通过 $TRAVIS_OS_NAME = 'osx' 判断环境