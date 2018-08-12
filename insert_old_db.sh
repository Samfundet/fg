#!/usr/bin/env bash
docker exec -u=postgres postgres sh /scripts/restore_old_db_from_dump.sh
docker exec django python convert_old_db.py
