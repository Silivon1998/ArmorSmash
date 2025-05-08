import { Session, SessionState } from "@db/models/session";
import { Query } from "@db/types";

export const SESSION_QUERIES = {
  // Insert new session
  create: ((db, id, userId, timestamp) =>
    db.prepare(`INSERT INTO session (id, user_id, timestamp, state) VALUES (?, ?, ?, ?)`)
      .run(id, userId, timestamp, SessionState.ACTIVE)) as Query<[string, string, number], void>,

  // Get sessions by user ID
  getByUserId: ((db, userId) =>
    db.prepare(`SELECT * FROM session WHERE user_id = ? ORDER BY timestamp DESC`).all(userId)) as Query<[string], Session[]>,

  // Get latest session
  getLatestByUserId: ((db, userId) =>
    db.prepare(`SELECT * FROM session WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1`).get(userId)) as Query<[string], Session | undefined>,

  // Get by session ID
  getById: ((db, id) =>
    db.prepare(`SELECT * FROM session WHERE id = ?`).get(id)) as Query<[string], Session | undefined>,

  // Get active sessions for a user
  getActiveByUserId: ((db, userId) =>
    db.prepare(`SELECT * FROM session WHERE user_id = ? AND state = ? ORDER BY timestamp DESC`)
      .all(userId, SessionState.ACTIVE)) as Query<[string], Session[]>,

  // Delete session by ID
  deleteById: ((db, id) =>
    db.prepare(`DELETE FROM session WHERE id = ?`).run(id)) as Query<[string], void>,

  // Delete all sessions older than timestamp
  deleteOlderThan: ((db, timestamp) =>
    db.prepare(`DELETE FROM session WHERE timestamp < ?`).run(timestamp)) as Query<[number], void>,

  // Delete sessions by state
  deleteByState: ((db, state) =>
    db.prepare(`DELETE FROM session WHERE state = ?`).run(state)) as Query<[SessionState], void>,

  // Count all sessions for a user
  countByUser: ((db, userId) =>
    db.prepare(`SELECT COUNT(*) as count FROM session WHERE user_id = ?`).get(userId)) as Query<[string], { count: number }>,

  // Update session state
  updateState: ((db, sessionId, state) =>
    db.prepare(`UPDATE session SET state = ? WHERE id = ?`).run(state, sessionId)) as Query<[SessionState, string], void>,
};
