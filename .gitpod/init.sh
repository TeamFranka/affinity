#!/bin/bash

export VUE_APP_PARSE_URL=`(gp url 1337)`/parse
npm run dev:db
npm run dev:db:mock-data
cp .env.development.local.template .env.development.local
echo "" >> .env.development.local
echo "VUE_APP_PARSE_URL=$(gp url 8080)/parse" >> .env.development.local
export CYPRESS_BASE_URL=$(gp url 8080) >> $HOME/.bashrc
export VUE_APP_PARSE_URL=`(gp url 8080)`/parse
