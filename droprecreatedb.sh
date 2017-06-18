#!/usr/bin/env bash
read -p "Would you like to DROP THE DATABASE FOR DEVELOPMENT PURPOSES? (yes/no) " x
if [ "$x" = "yes" ]
then
  docker exec -u=postgres postgres sh /scripts/drop_and_recreate_database.sh
fi

read -p "Reseed the db? " x
if [ "$x" = "yes" ]
then
  docker exec django bash seed.sh
fi