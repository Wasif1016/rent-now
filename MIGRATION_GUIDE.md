# Schema Migration Guide

## Issue
`prisma db push` is hanging, likely due to:
- Connection pooler timeouts
- Complex schema changes requiring analysis
- Existing data conflicts

## Solution Options

### Option 1: Use Prisma Migrate (Recommended)
```bash
# This will create a migration file you can review
bun run db:migrate --name schema_redesign_add_towns_remove_types
```

If connection fails, ensure you're using `DIRECT_URL` instead of pooler URL in your `.env.local`:
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```

### Option 2: Manual Migration
If `db push` or `migrate dev` continues to hang:

1. **Backup your database first!**

2. Apply the migration SQL manually via Supabase dashboard SQL editor:
   - Go to Supabase Dashboard > SQL Editor
   - Run the migration SQL from `prisma/migrations/20260118000000_schema_redesign/migration.sql`

3. Mark migration as applied:
   ```bash
   # After manually applying SQL, mark it as applied
   bun run db:migrate resolve --applied schema_redesign_add_towns_remove_types
   ```

4. Regenerate Prisma client:
   ```bash
   bun run db:generate
   ```

### Option 3: Reset Database (⚠️ Data Loss)
If you don't need existing data:
```bash
bun run db:push --force-reset --accept-data-loss
```

## After Migration

1. Regenerate Prisma client:
   ```bash
   bun run db:generate
   ```

2. Seed the database:
   ```bash
   bun run db:seed
   ```

## Troubleshooting

- **Connection timeout**: Use `DIRECT_URL` instead of pooler URL
- **Hanging process**: Kill any stuck Prisma processes
- **Migration conflicts**: Review existing migrations and resolve conflicts manually

