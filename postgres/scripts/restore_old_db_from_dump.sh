dropdb --if-exists 'old_fg'
createdb -U postgres -T template0 old_fg
psql -U postgres -d old_fg -f /data/dump.sql
