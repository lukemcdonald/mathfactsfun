import { LibSQLDatabase } from 'drizzle-orm/libsql'

/**
 * Represents a connection to the database with the schema defined in the 'drizzle/schema' module.
 */
export type Database = LibSQLDatabase<typeof import('app/db/db.schema.server')>

/**
 * Type that represents the properties of a component enhanced with additional properties P
 * excluding any properties in P from the base component properties.
 *
 * @template T Type of the HTML element or React Component. It extends ElementType.
 * @template P Type of the additional properties to add to the base component properties.
 */
export type EnhancedComponentProps<T extends React.ElementType, P> = Omit<
  React.ComponentPropsWithoutRef<T>,
  keyof P
> &
  P
