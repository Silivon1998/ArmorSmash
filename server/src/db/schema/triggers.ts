import { Query } from "@db/types";

export const TRIGGERS: Record<string, Query> = {
    INCREMENT_LICENSE_USES_ON_USERS_INSERT: (db) => db.exec(`
    CREATE TRIGGER IF NOT EXISTS increment_license_uses
    AFTER INSERT ON users
    WHEN NEW.registered_with IS NOT NULL
    BEGIN
      UPDATE license
      SET uses = uses + 1
      WHERE code = NEW.registered_with;
    END;`),

    UPDATE_LAST_USER_ACTIVITY_ON_SESSION_INSERT : (db) => db.exec(`
    CREATE TRIGGER IF NOT EXISTS session_insert
    AFTER INSERT ON session
    BEGIN
    UPDATE users
    SET last_activity = NEW.timestamp
    WHERE id = NEW.user_id;
    END;`),
}; 