import { Database } from 'better-sqlite3';

export type Query<Args extends any[] = any[], Result = any> = (db: Database, ...args: Args) => Result;
