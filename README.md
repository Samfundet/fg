[![Build Status](https://travis-ci.org/Samfundet/fg.svg?branch=master)](https://travis-ci.org/Samfundet/fg) Master

[![Build Status](https://travis-ci.org/Samfundet/fg.svg?branch=development)](https://travis-ci.org/Samfundet/fg) Development

# Setup

1. Get [docker](https://www.docker.com/products/overview).
2. Get [docker-compose](https://docs.docker.com/compose/install/).
3. Confirm that docker is installed (type 'docker -v' and 'docker-compose -v'), docker should be >=1.13 and docker-compose >=1.6
4. Clone the project, cd into the project directory.
5. Run ```bash development.sh```

If everything worked you should be able to see the angular application at [localhost and/or 127.0.0.1](http://127.0.0.1).

# Seeding
The database is seeded using migrations defined in
```./src/django_backend/fg/api/seed_migration.py```.
Simply bring the docker containers up and run ```droprecreatedb.sh```.

## TODO documentation
