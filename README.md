## Supabase useful commands

### generate migrations

`bunx supabase db diff -f <file_name>`

### push migrations

`bunx supabase db push --db-url <db_url>`

### generate types

`bunx supabase gen types typescript --local > src/types/database.types.ts`

### reset && seed local database

`bunx supabase db reset --local`
