#!/usr/bin/env bash
set -x

ssh fg@fgbeta.samfundet.no 'bash -s' < $TRAVIS_BUILD_DIR/deploy_script.sh
