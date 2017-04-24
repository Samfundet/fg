#!/usr/bin/env bash
python manage.py test
echo "from django.contrib.auth.models import User; User.objects.create_superuser('fg', 'fg', 'qwer1234')" | python manage.py shell
python manage.py makemigrations
python manage.py migrate

# Must be last
uwsgi --ini uwsgi.dev.ini
