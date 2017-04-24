#!/usr/bin/env bash
uwsgi --ini uwsgi.dev.ini
python manage.py flush --no-input
python manage.py test
echo "from django.contrib.auth.models import User; User.objects.create_superuser('fg', 'fg', 'qwer1234')" | python manage.py shell
