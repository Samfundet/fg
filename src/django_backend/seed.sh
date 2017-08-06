#!/usr/bin/env bash
if [ "$DEVELOPMENT" != "true" ]; then
  echo "Either you tried to seed whilst not in the correct docker container..."
  echo "Or you really just tried to flush and seed the database whilst in production. You humongous ape."
  exit 1
fi

# Delete all migrations
bash ./remove-migrations.sh

./manage.py flush --no-input
./manage.py makemigrations
./manage.py migrate
./manage.py loaddata auth_dump.json
cp ./fg/api/seed_migration.py ./fg/api/migrations/dev_seed.py
./manage.py makemigrations --merge --no-input
./manage.py migrate

# # Delete all migrations again
#bash ./remove-migrations.sh
