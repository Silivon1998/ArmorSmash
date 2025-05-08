import * as dotenv from 'dotenv';
import * as path from 'path';

function parseEnvInt(value: string | undefined, fallback: number): number {
  var parsed = parseInt(value || '');
  if (isNaN(parsed)) return fallback;
  return parsed;
}
dotenv.config({ path: path.resolve(__dirname, '.env.server') });
const env = process.env;

export const JWT_SECRET = env.JWT_SECRET || '';
export const JWT_EXPIRES_IN = parseEnvInt(env.JWT_EXPIRES_IN, 604800); // 7 days default
export const SERVER_PORT = parseEnvInt(env.SERVER_PORT, 3001);

