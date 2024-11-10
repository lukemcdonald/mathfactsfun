import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

import * as schema from './schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const client = createClient({
  authToken: process.env.DATABASE_AUTH_TOKEN,
  url: process.env.DATABASE_URL,
})

export const db = drizzle(client, { schema })
