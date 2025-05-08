export enum SessionState {
  ACTIVE = 0,
  REVOKED = 1,
  EXPIRED = 2,
  UNKNOWN = 3
}

export interface Session {
  id: string;
  user_id: string;
  timestamp: number;
  state: SessionState;
}