#!/usr/bin/env bash

set -e

colorYellow() { echo $(tput setaf 3); }
colorGreen() { echo $(tput setaf 2); }
colorRed() { echo $(tput setaf 1); }

colorRed
echo "docker-compose -f docker-compose.prod.yml down"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

colorYellow
echo "docker-compose -f docker-compose.yml -f docker-compose.prod.yml build"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

colorGreen
echo "docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

colorYellow
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps

if [ $? -eq 0 ]
then
  colorGreen
  echo "Successfully built and upped docker containers"
else
  colorRed
  echo "production.sh script failed" >&2
fi

# On staging server, active webhook by calling bash production.sh webhook
for i in "$@" ; do
  if [[ $i == "webhook" ]] ; then
    echo "Setting up webhook"
    (cd webhook && webhook -hooks hooks.json -verbose &)
    break
  fi
done
