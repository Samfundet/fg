# Django container

This container encapsulates the django webserver. 

**Dockerfile** Describes the image.

**dev_auth.json** Used in development, this is a django fixture that we ```python manage.py loaddata dev_auth.json```
in order to quickly set a user.

**docker-entrypoint** These are bash scripts that are run as **CMD** from the dockerfile,
they represent the first actions made upon running ```docker-compose up```. In development we seed the database.
 
**seed.sh** This bash script flushes the database and seeds it with initial test data for development purposes. Don't 
run this in production (even if you do there is an environment variable check that prevents you - and berates you).

The rest of the files are your typical django setup, the volume bindings to the different folders (./media, ./static etc.)
are described in the docker-compose file.