#!/bin/bash

# Set timeout to the number of seconds you are willing to wait.
timeout=500; counter=0

CONTAINER=affinity_mongo_1
echo "Waiting for $CONTAINER to be ready (${counter}/${timeout})"

until [[ $(docker inspect --format '{{json .State.Running}}' $CONTAINER 2> /dev/null) ]]; do
  if [[ $timeout -lt $counter ]]; then
    echo "ERROR: Timed out waiting for $CONTAINER to come up."
    exit 1
  fi

  if (( $counter % 5 == 0 )); then
    echo -e "\e[1A\e[KWaiting for $CONTAINER to be ready (${counter}/${timeout})"
  fi

  sleep 1s
  ((counter++))
done

echo "$CONTAINER running"
echo "Containers running"
docker-compose ps
sleep 5s
echo "Init db"

#bash

# init db
npm run dev:db

echo "mock data"
# init db fixtures
npm run dev:db:mock-data

sleep 3s

# create .env file for live server

if [ ! -f .env.development.local.template ]; then
  echo "ERROR: db init did not work"
  exit 1
fi

echo "create env file"
cat .env.development.local.template > .env.development.local
cat >> .env.development.local << EOF

VUE_APP_PARSE_URL=$(gp url 8080)/parse
EOF

# run parse dev server
(npm run dev:run-parse & npm run serve)
