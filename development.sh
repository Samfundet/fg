#!/usr/bin/env bash
set -e

endColor() { echo $(tput setaf 9); }
colorCyan() { echo $(tput setaf 6); }
colorRed() { echo $(tput setaf 1); }
colorGreen() { echo $(tput setaf 2); }
colorYellow() { echo $(tput setaf 3); }

echo node -v $(node -v)
echo npm -v $(npm -v)
colorCyan
echo "Make sure node >= 6.9 and npm >= 3"

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

colorGreen
echo "Done"

endColor