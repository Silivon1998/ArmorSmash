import { License } from "@db/models/license";
import { Query } from "@db/types";

export const LICENSE_QUERIES = {
  getByCode: ((db, code) =>
    db.prepare(`SELECT * FROM license WHERE code = ?`).get(code)) as Query<[string], License | undefined>,

  getAll: ((db) =>
    db.prepare(`SELECT * FROM license`).all()) as Query<[], License[]>,

  getAvailable: ((db) =>
    db.prepare(`SELECT * FROM license WHERE uses < max_uses AND expires > ?`).all(Date.now())) as Query<[], License[]>,

  insert: ((db, id, code, created, expires, maxUses) =>
    db.prepare(`INSERT INTO license (id, code, created, expires, max_uses) VALUES (?, ?, ?, ?, ?)`)
      .run(id, code, created, expires, maxUses)) as Query<[string, string, number, number, number], void>,

  deleteByCode: ((db, code) =>
    db.prepare(`DELETE FROM license WHERE code = ?`).run(code)) as Query<[string], void>,

  deleteExpired: ((db, now) =>
    db.prepare(`DELETE FROM license WHERE expires < ?`).run(now)) as Query<[number], void>,

  update: ((db, code, maxUses, expires) =>
    db.prepare(`
      UPDATE license
      SET 
        ${maxUses !== undefined ? 'max_uses = ?, ' : ''}
        ${expires !== undefined ? 'expires = ? ' : ''}
      WHERE code = ?
    `).run(
      ...(maxUses !== undefined && expires !== undefined
        ? [maxUses, expires, code]
        : maxUses !== undefined
        ? [maxUses, code]
        : [expires, code])
    )) as Query<[string, number?, number?], void>
};