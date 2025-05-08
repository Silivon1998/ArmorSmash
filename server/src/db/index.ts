import Database from 'better-sqlite3';
import { setupSchema } from './schema';
import path from 'path';

const db = new Database(path.resolve(__dirname, './database.db'));

setupSchema(db); // run table/trigger creation

export default db;

