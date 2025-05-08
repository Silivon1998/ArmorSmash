import { FastifyInstance, FastifyReply } from 'fastify';
import * as bcrypt from '@node-rs/bcrypt';
import { randomUUID } from 'crypto';
import db from '@DATABASE';
import { QUERIES } from '@db/schema/queries';
import { response } from '@network/response';
import { Auth } from "@shared/types";
import { JWT_EXPIRES_IN } from '@env';

export default function authRoutes(app: FastifyInstance) {

  function createSession(reply : FastifyReply, userId: string) {
    var sessionId = randomUUID();
    var now = Date.now();
    QUERIES.SESSION_QUERIES.create(db, sessionId, userId, now);
    
    var token = app.jwt.sign(
      { uid: userId, sid: sessionId },
      { expiresIn: JWT_EXPIRES_IN }
    );

    reply.setCookie('token', token, {
      httpOnly: true,
      secure: true, // use false only in dev over HTTP
      sameSite: 'lax',
      path: '/',
      maxAge: JWT_EXPIRES_IN, // sync with token
    });
  }

  app.post(Auth.Register.path, async (req, reply) => {
    var result = {test : "sadfafa"};
    var { email, password, code } = req.body as Auth.Register.Request;

    if (typeof email !== 'string' || typeof password !== 'string' || typeof code !== 'string')
      return response.BAD_REQUEST(reply, 'Invalid input', result);

    var now = Date.now();
    var license = QUERIES.LICENSE_QUERIES.getByCode(db, code);

    if (!license) return response.NOT_FOUND(reply, 'Invalid license code', result);
    if (license.expires < now) return response.BAD_REQUEST(reply, 'License expired', result);
    if (license.uses >= license.max_uses) return response.BAD_REQUEST(reply, 'License has no remaining slots', result);

    var existingUser = QUERIES.USERS_QUERIES.getByEmail(db, email);
    if (existingUser) return response.CONFLICT(reply, 'Email already registered', result);

    var hashed = await bcrypt.hash(password, 10);

    
    var userId = randomUUID();
    QUERIES.USERS_QUERIES.insert(db, userId, email, hashed, code, now);

    createSession(reply, userId);
    return response.CREATED(reply, 'User registered successfully', result);
  });

  app.post(Auth.Login.path, async (req, reply) => {
    var { email, password } = req.body as Auth.Login.Request;

    if (typeof email !== 'string' || typeof password !== 'string')
      return response.BAD_REQUEST(reply, 'Invalid input');

    var user = QUERIES.USERS_QUERIES.getByEmail(db, email);
    if (!user) return response.BAD_REQUEST(reply, 'Invalid credentials');

    var match = await bcrypt.compare(password, user.password_hash);
    if (!match) return response.BAD_REQUEST(reply, 'Invalid credentials');

    createSession(reply, user.id);
    return response.OK(reply, 'Login successful');
  });

}