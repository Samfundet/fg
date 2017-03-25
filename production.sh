#!/usr/bin/env bash
if [[ $UID != 0 ]]; then
    echo "Please run this script with sudo:"
    echo "sudo $0 $*"
    exit 1
fi

set -e

colorYellow() { echo $(tput setaf 3); }
colorGreen() { echo $(tput setaf 2); }
colorRed() { echo $(tput setaf 1); }

colorRed
echo "docker-compose -f docker-compose.prod.yml stop"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml stop

colorYellow
echo "docker-compose -f build"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

colorGreen
echo "docker-compose up -fd"
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

sudo chmod -R 700 db_data

# On staging server, active webhook by calling bash production.sh webhook
for i in "$@" ; do
  if [[ $i == "webhook" ]] ; then
    echo "Setting up webhook"
    (cd webhook && webhook -hooks hooks.json -verbose &)
    break
  fi
done
