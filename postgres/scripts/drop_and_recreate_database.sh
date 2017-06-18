#!/usr/bin/env bash
if [ "$DEVELOPMENT" != "true" ]; then
  echo "Either you tried to do this in the wrong container..."
  echo "Or you really just tried to drop and recreate the database whilst in production. You humongous ape."
  exit 1
fi

dropdb --if-exists 'fg_dev_db' && createdb 'fg_dev_db'