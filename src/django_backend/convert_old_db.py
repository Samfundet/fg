import os,sys
sys.path.append('/django')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "fg.settings")
import django
django.setup()

from django import db
from fg.api import models
from fg.legacy import models as old_models

def run():
    foo = old_models.ArchiveImagemodel.objects.using('old_db').all()
    print(len(foo))


run()
