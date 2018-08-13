#!/usr/bin/env bash
docker exec postgres dropdb -U postgres --if-exists 'fg_dev_db'
docker exec postgres createdb -U postgres 'fg_dev_db'
docker exec django python manage.py migrate
docker exec -u=postgres postgres sh /scripts/restore_old_db_from_dump.sh
docker exec django python convert_old_db.py
