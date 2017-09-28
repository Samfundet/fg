#!/usr/bin/env bash

docker exec -i django bash remove-migrations.sh
docker exec -i django python manage.py makemigrations
docker exec -i django python manage.py test
