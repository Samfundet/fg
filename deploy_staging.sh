#!/usr/bin/env bash
LOGFILE="/home/fg/travis-deploys.log"
TIMESTAMP=`date "+%Y-%m-%d %H:%M:%S"`
cd fg
git reset --hard # TODO git clean -xdf? but that will remove node_modules and everything every time...
git pull
bash development.sh
cd src/angular_frontend
npm install
ng build  
echo $TIMESTAMP >> $LOGFILE
