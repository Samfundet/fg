#!/usr/bin/env bash
# Must be last
./manage.py collectstatic --no-input
uwsgi --ini uwsgi.prod.ini
