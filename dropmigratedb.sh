#!/usr/bin/env bash
docker exec -u=postgres postgres sh /scripts/drop_and_recreate_database.sh
docker exec django bash migrate.sh
