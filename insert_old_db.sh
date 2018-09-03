#!/usr/bin/env bash
docker exec -i postgres dropdb -U postgres --if-exists 'fg_dev_db'
docker exec -i postgres createdb -U postgres 'fg_dev_db'
docker exec -i django python manage.py migrate
docker exec -i -u=postgres postgres sh /scripts/restore_old_db_from_dump.sh
docker exec -i django python convert_old_db.py
