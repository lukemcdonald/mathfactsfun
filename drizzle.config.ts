import type { Config } from 'drizzle-kit'

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dbCredentials: {
    authToken: process.env.DATABASE_AUTH_TOKEN!,
    url: process.env.DATABASE_URL!,
  },
  dialect: 'turso',
  out: './app/db/migrations',
  schema: ['./app/features/**/**.db.ts'],
  strict: true,
  verbose: true,
}) satisfies Config
