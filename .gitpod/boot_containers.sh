#!/bin/bash

sleep 2

# start docker if not running
if ! pgrep -x "docker-up" > /dev/null
then
  echo "docker daemon not running"
  sudo docker-up 2> /dev/null &
fi

# wait for docker to run
while [ ! -S /var/run/docker.sock ]; do sleep 1; done
while ! pgrep -x "docker-up" > /dev/null; do sleep 1; done

echo "docker running"

CONTAINER=affinity_dashboard_1

# start docker-compose if not running
if [[ ! $(docker inspect --format '{{json .State.Running}}' $CONTAINER 2> /dev/null) ]]; then
  echo "containers not running"
  export VUE_APP_PARSE_URL=$(gp url 8080)/parse
  docker-compose up -d
fi
