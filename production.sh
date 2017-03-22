#!/usr/bin/env bash
set -e

colorYellow() { echo $(tput setaf 3); }
colorGreen() { echo $(tput setaf 2); }
colorRed() { echo $(tput setaf 1); }

docker-compose stop
docker-compose build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

colorYellow
docker-compose ps

if [ $? -eq 0 ]
then
  colorGreen
  echo "Successfully built and upped docker containers"
else
  colorRed
  echo "production.sh script failed" >&2
fi

sudo chmod -R 777 db_data
