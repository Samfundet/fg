#!/usr/bin/env bash
if [ "$DEVELOPMENT" != "true" ]; then
  echo "Either you tried to seed whilst not in the correct docker container..."
  echo "Don't..."
  exit 1
fi

# Delete all migrations
bash ./remove-migrations.sh

./manage.py flush --no-input
./manage.py makemigrations
./manage.py migrate
./manage.py loaddata auth_dump.json
cp ./old_data_importer.py ./fg/api/migrations/migrate.py
./manage.py makemigrations --merge --no-input
./manage.py migrate

# # Delete all migrations again
#bash ./remove-migrations.sh
