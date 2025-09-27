# Using Neon for a Plane Testing Database

This guide walks through pointing a local or ephemeral Plane backend at a Neon-hosted PostgreSQL database for testing.

## 1. Configure the connection string

Use the Neon connection string provided by the Neon dashboard. For example:

```
postgresql://neondb_owner:YOURPASSWORD@ep-floral-bush-a848k9x8-pooler.eastus2.azure.neon.tech/neondb?sslmode=require
```

Add the string to your Django API environment as `DATABASE_URL`. You can drop the `channel_binding=require` parameter—Plane's Django/PostgreSQL adapter works with `sslmode=require`.

```
DATABASE_URL=postgresql://neondb_owner:YOURPASSWORD@ep-floral-bush-a848k9x8-pooler.eastus2.azure.neon.tech/neondb?sslmode=require
```

## 2. Ensure the backend can talk to Neon

Install a PostgreSQL driver such as `psycopg2-binary` (or `psycopg`, depending on your Plane fork) inside the API service. Restart the backend after updating the `.env` file so it picks up the new `DATABASE_URL`.

## 3. Run migrations

With the environment configured, run migrations from the API container/service to create Plane's tables in Neon:

```
python manage.py migrate
```

## 4. Testing considerations

For test environments you do not need to configure backups or replicas. Neon automatically scales and can sleep while idle, keeping the setup inexpensive during evaluation.
