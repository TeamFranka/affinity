#!/bin/bash

# start docker if not running
if ! pgrep -x "docker-up" > /dev/null
then
  sudo docker-up &
fi

# wait for docker to run
while ! pgrep -x "docker-up" > /dev/null; do
  sleep 1
done

DASHBOARD_CONTAINER=affinity_dashboard_1

if [[ $(docker inspect --format '{{json .State.Running}}' $DASHBOARD_CONTAINER) != true ]]; then
  echo "not running"
  docker-compose up &
else
  echo "running"
fi

# Set timeout to the number of seconds you are willing to wait.
timeout=500; counter=0

# This first echo is important for keeping the output clean and not overwriting the previous line of output.
echo "Waiting for $DASHBOARD_CONTAINER to be ready (${counter}/${timeout})"

#This says that until docker inspect reports the container is in a running state, keep looping.
until [[ $(docker inspect --format '{{json .State.Running}}' $DASHBOARD_CONTAINER) == true ]]; do
  # If we've reached the timeout period, report that and exit to prevent running an infinite loop.
  if [[ $timeout -lt $counter ]]; then
    echo "ERROR: Timed out waiting for $DASHBOARD_CONTAINER to come up."
    exit 1
  fi

  # Every 5 seconds update the status
  if (( $counter % 5 == 0 )); then
    echo -e "\e[1A\e[KWaiting for $DASHBOARD_CONTAINER to be ready (${counter}/${timeout})"
  fi

  # Wait a second and increment the counter
  sleep 1s
  ((counter++))
done

DASHBOARD_CONTAINER=affinity_mongo_1
echo -e "\e[1A\e[KWaiting for $DASHBOARD_CONTAINER to be ready (${counter}/${timeout})"

until [[ $(docker inspect --format '{{json .State.Running}}' $DASHBOARD_CONTAINER) == true ]]; do
  if [[ $timeout -lt $counter ]]; then
    echo "ERROR: Timed out waiting for $DASHBOARD_CONTAINER to come up."
    exit 1
  fi

  if (( $counter % 5 == 0 )); then
    echo -e "\e[1A\e[KWaiting for $DASHBOARD_CONTAINER to be ready (${counter}/${timeout})"
  fi

  sleep 1s
  ((counter++))
done

DASHBOARD_CONTAINER=affinity_parse_1
echo -e "\e[1A\e[KWaiting for $DASHBOARD_CONTAINER to be ready (${counter}/${timeout})"

until [[ $(docker inspect --format '{{json .State.Running}}' $DASHBOARD_CONTAINER) == true ]]; do
  if [[ $timeout -lt $counter ]]; then
    echo "ERROR: Timed out waiting for $DASHBOARD_CONTAINER to come up."
    exit 1
  fi

  if (( $counter % 5 == 0 )); then
    echo -e "\e[1A\e[KWaiting for $DASHBOARD_CONTAINER to be ready (${counter}/${timeout})"
  fi

  sleep 1s
  ((counter++))
done

echo "Containers running"

# copy .env file for live server
cp .env.development.local.template .env.development.local

# init db
npm run dev:db

# init db fixtures
npm run dev:db:mock-data

# run parse dev server
(npm run dev:run-parse & npm run serve)
