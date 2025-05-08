import { Query } from "@db/types";

export const INDEXES: Record<string, Query> = {
    LICENSE_CODE_INDEX: (db) =>
      db.exec(`CREATE INDEX IF NOT EXISTS idx_license_code ON license(code);`),
  
    USER_EMAIL_INDEX: (db) =>
      db.exec(`CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);`),
  
    SESSION_USER_INDEX: (db) =>
      db.exec(`CREATE INDEX IF NOT EXISTS idx_session_user_id ON session(user_id);`),
  
    SESSION_TIMESTAMP_INDEX: (db) =>
      db.exec(`CREATE INDEX IF NOT EXISTS idx_session_timestamp ON session(timestamp);`)
  };