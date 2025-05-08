import { User } from "@db/models/user";
import { Query } from "@db/types";

export const USERS_QUERIES = {
  getByEmail: ((db, email) =>
    db.prepare(`SELECT * FROM users WHERE email = ?`).get(email)) as Query<[string], User | undefined>,

  getById: ((db, id) =>
    db.prepare(`SELECT * FROM users WHERE id = ?`).get(id)) as Query<[string], User | undefined>,

  getAll: ((db) =>
    db.prepare(`SELECT * FROM users`).all()) as Query<[], User[]>,

  deleteById: ((db, id) =>
    db.prepare(`DELETE FROM users WHERE id = ?`).run(id)) as Query<[string], void>,

  countAll: ((db) =>
    db.prepare(`SELECT COUNT(*) as count FROM users`).get()) as Query<[], { count: number }>,

  getByLicenseCode: ((db, code) =>
    db.prepare(`SELECT * FROM users WHERE registered_with = ?`).all(code)) as Query<[string], User[]>,

  getInactiveBefore: ((db, timestamp) =>
    db.prepare(`SELECT * FROM users WHERE last_activity < ?`).all(timestamp)) as Query<[number], User[]>,

  insert: ((db, id, email, password_hash, registered_with, last_activity) =>
    db.prepare(`INSERT INTO users (id, email, password_hash, registered_with, last_activity) VALUES (?, ?, ?, ?, ?)`)
      .run(id, email, password_hash, registered_with, last_activity)) as Query<[string, string, string, string, number], void>,

  update: ((db, id, email, password_hash, registered_with, last_activity) =>
    db.prepare(`UPDATE users SET email = ?, password_hash = ?, registered_with = ?, last_activity = ? WHERE id = ?`)
      .run(email, password_hash, registered_with, last_activity, id)) as Query<[string, string, string, number, string], void>
};
