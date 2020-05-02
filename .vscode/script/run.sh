#!/bin/bash
git push origin master
ssh root@157.230.197.129 << EOF
cd /root/GitSource/NodeJS_Playground
git pull
npm install
npm run prod:build
EOF