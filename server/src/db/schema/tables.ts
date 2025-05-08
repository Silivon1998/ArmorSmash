import { Query } from "@db/types";

export const TABLES: Record<string, Query> = {
    CREATE_LICENSE_TABLE: (db) => db.exec(` 
    CREATE TABLE IF NOT EXISTS license (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      created INTEGER NOT NULL,
      expires INTEGER NOT NULL,
      max_uses INTEGER NOT NULL DEFAULT 1,
      uses INTEGER NOT NULL DEFAULT 0
    );`),

    CREATE_USERS_TABLE: (db) => db.exec(` 
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        registered_with TEXT NOT NULL,
        last_activity INTEGER,
        FOREIGN KEY (registered_with) REFERENCES license(code)
    );`),

    CREATE_SESSION_TABLE: (db) => db.exec(`
    CREATE TABLE IF NOT EXISTS session (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        state INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );`)

}; 