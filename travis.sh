#!/usr/bin/env bash

set -e

colorYellow() { echo $(tput setaf 3); }
colorGreen() { echo $(tput setaf 2); }
colorRed() { echo $(tput setaf 1); }

colorRed
echo "docker-compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.travis.yml down"
docker-compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.travis.yml down

colorYellow
echo "docker-compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.travis.yml build"
docker-compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.travis.yml build

colorGreen
echo "docker-compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.travis.yml up -d"
docker-compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.travis.yml up -d

colorYellow
docker-compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.travis.yml ps

if [ $? -eq 0 ]
then
  colorGreen
  echo "Successfully built and upped docker containers"
else
  colorRed
  echo "travis.sh script failed" >&2
fi