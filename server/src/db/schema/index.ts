import { Database } from 'better-sqlite3';
import { TABLES } from '@db/schema/tables';
import { TRIGGERS } from '@db/schema/triggers';
import { INDEXES } from '@db/schema/indexes';

export function setupSchema(db: Database) {
  for (const QUERY_SET of [TABLES, TRIGGERS, INDEXES]) {
    for (const [name, query] of Object.entries(QUERY_SET)) {
      console.log('Executing -', name);
      try {
        query(db);
      } catch (error) {
        console.error('Execution', name, 'FAILED -', error);
      }
    }
  }
}