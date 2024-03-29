#!/bin/sh

set -xv
until PGPASSWORD=$POSTGRES_PASSWORD PGUSER=$POSTGRES_USER PGHOST=$POSTGRES_DB_HOST PGDATABASE=$POSTGRES_DB_NAME psql -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 2
done

>&2 echo "Postgres is up"

npx prisma migrate deploy
npm build
exec "$@"