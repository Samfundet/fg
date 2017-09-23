#!/bin/bash

rm -rf ./fg/api/migrations/*
rm -rf ./fg/fg_auth/migrations/*
touch ./fg/api/migrations/__init__.py
touch ./fg/fg_auth/migrations/__init__.py

#find ./fg/api/migrations/* ! -name "__init__.py" -type d -exec rm -rf {} +
#find ./fg/fg_auth/migrations/* ! -name "__init__.py" -type d -exec rm -rf {} +
