#!/usr/bin/env bash
uwsgi --ini uwsgi.dev.ini
python manage.py test