#!/usr/bin/env bash
if [ "$DEVELOPMENT" != "true" ]; then
  echo "Did you really just try to flush and seed the database whilst in production you humongous ape"
  exit 1
fi

./manage.py flush --no-input
./manage.py migrate --fake api zero
./manage.py makemigrations
./manage.py migrate
cp ./fg/api/seed_migration.py ./fg/api/migrations/dev_seed.py
./manage.py migrate
./manage.py loaddata auth.json
rm ./fg/api/migrations/dev_seed.py