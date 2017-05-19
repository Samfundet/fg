#!/usr/bin/env bash
LOGFILE="travis-deploys.log"
TIMESTAMP=`date "+%Y-%m-%d %H:%M:%S"`
ssh fg@146.185.181.250 "cd fg && git reset --hard && git pull && bash development.sh && echo $TIMESTAMP >> $LOGFILE"
