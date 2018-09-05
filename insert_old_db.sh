#!/usr/bin/env bash
set -o xtrace

docker exec -i postgres dropdb -U postgres --if-exists 'fg_dev_db'
docker exec -i postgres createdb -U postgres 'fg_dev_db'
docker exec -i django python manage.py makemigrations
docker exec -i django python manage.py migrate
docker exec -i postgres dropdb --if-exists 'old_fg'
docker exec -i postgres createdb -U postgres -T template0 old_fg
docker exec -i postgres psql -U postgres -d old_fg -f /data/dump.sql
docker exec -i django python convert_old_db.py
