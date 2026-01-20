import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Use fallback for generation when DIRECT_URL is not set
    // This allows prisma generate to work without a real database connection
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/dbname',
  },
});

