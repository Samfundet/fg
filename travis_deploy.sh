#!/usr/bin/env bash
set -x

ssh fg@fgbeta.samfundet.no 'bash -s' < $TRAVIS_BUILD_DIR/deploy_script.sh
pwd
rsync -r $TRAVIS_BUILD_DIR/src/angular_frontend/dist fg@fgbeta.samfundet.no:./fg/src/angular_frontend/
