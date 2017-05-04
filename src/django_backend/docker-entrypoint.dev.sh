#!/usr/bin/env bash
bash seed.sh

# Must be last
uwsgi --ini uwsgi.dev.ini
