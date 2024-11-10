import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import invariant from 'tiny-invariant'

import * as schema from './schema'

const authToken = process.env.DATABASE_AUTH_TOKEN
invariant(authToken, 'DATABASE_AUTH_TOKEN is not set')

const databaseUrl = process.env.DATABASE_URL
invariant(databaseUrl, 'DATABASE_URL is not set')

const client = createClient({
  authToken,
  url: databaseUrl,
})

export const db = drizzle(client, { schema })
