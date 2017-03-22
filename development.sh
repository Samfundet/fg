#!/usr/bin/env bash
set -e

endColor() { echo $(tput setaf 9); }
colorCyan() { echo $(tput setaf 6); }
colorRed() { echo $(tput setaf 1); }
colorGreen() { echo $(tput setaf 2); }
colorYellow() { echo $(tput setaf 3); }

colorRed
echo "docker-compose stop"
docker-compose stop

colorYellow
echo "docker-compose build"
docker-compose build

colorGreen
echo "docker-compose up -d"
docker-compose up -d

colorYellow
docker-compose ps

if [ $? -eq 0 ]
then
  colorGreen
  echo "Successfully built and upped docker containers"
else
  colorRed
  echo "development.sh script failed" >&2
fi

sudo chmod -R 777 db_data

endColor