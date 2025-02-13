### generate migrations

`bunx supabase db diff -f <file_name>`

### push migrations

`bunx supabase db push --db-url postgresql://postgres.ejlmrncfwukursbmjyhe:DbvUrjcU2TkTDyw3@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`

### generate types

`bunx supabase gen types typescript --local > src/types/database.types.ts`

### reset && seed local database

`bunx supabase db reset --local`

## Assets management

![](/public/readme/assets-management.png)
