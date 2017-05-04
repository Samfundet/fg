#!/usr/bin/env bash
if [ "$DEVELOPMENT" != "true" ]; then
  echo "Either you tried to seed whilst not in the correct docker container..."
  echo "Or you really just tried to flush and seed the database whilst in production. You humongous ape."
  exit 1
fi

rm -f ./fg/api/migrations/dev_seed.py
./manage.py flush --no-input
./manage.py migrate --fake api zero
./manage.py makemigrations
./manage.py migrate
cp ./fg/api/seed_migration.py ./fg/api/migrations/dev_seed.py
./manage.py migrate
./manage.py loaddata dev_auth.json
rm ./fg/api/migrations/dev_seed.py