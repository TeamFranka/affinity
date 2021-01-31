#!/usr/bin/env bash

# fail if any command fails
set -e
# debug log
set -x

sudo npm install -g n
sudo n stable

# go to root of project
cd ../..

# install ionic globally
npm install -g @ionic/cli

# install dependencies
npm i

# run optimized production build
npm run build -- --prod

# copy the web assets to the native projects and updates the native plugins and dependencies based in package.json
npx cap sync