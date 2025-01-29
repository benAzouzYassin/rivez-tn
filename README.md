### generate migrations

`bunx supabase db diff -f <file_name>`

### generate types

`bunx supabase gen types typescript --local > src/types/database.types.ts`

### seed local database

`bunx supabase db reset --local`
