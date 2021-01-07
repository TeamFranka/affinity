#!/usr/bin/env bash
echo "RUNNING POST CLONE -----------------------------------"
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
sudo npm install yarn -g
sudo npm install -g ionic
cd ../../npm i
ionic build
npx cap sync