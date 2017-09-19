#!/bin/bash

find ./fg/api/migrations/ ! -name "__init__.py" -type d -exec rm -rf {} +
find ./fg/fg_auth/migrations/ ! -name "__init__.py" -type d -exec rm -rf {} +
