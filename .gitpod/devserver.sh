#!/bin/bash

# Set timeout to the number of seconds you are willing to wait.
timeout=500; counter=0

CONTAINER=affinity_parse_1
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
