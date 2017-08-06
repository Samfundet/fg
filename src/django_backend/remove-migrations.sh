#!/bin/bash

find . -path "./fg/api/migrations/*.py" -not -name "__init__.py" -delete
find . -path "./fg/api/migrations/*.pyc"  -delete
find . -path "./fg/fg_auth/migrations/*.py" -not -name "__init__.py" -delete
find . -path "./fg/fg_auth/migrations/*.pyc"  -delete