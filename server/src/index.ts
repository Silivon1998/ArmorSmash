/// <reference path="./types/global.d.ts" />
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import cors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';

import { JWT_SECRET, SERVER_PORT } from '@env';
import { response } from '@network/response';
import { QUERIES } from '@db/schema/queries';
import registerRoutes from './routes';
import db from '@DATABASE';

async function main(){
  const app = Fastify();

  // Enable CORS for dev/testing
  app.register(cors, {
    origin: true,
    credentials: true,
  });
  
  app.register(fastifyCookie, {
    secret: 'cookie-secret',
  });
  
  app.register(fastifyJwt, {
    secret: JWT_SECRET,
  });
  
  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
  
      // Now that we've verified, request.user should be typed correctly
      const user = request.user; 
  
      const session = QUERIES.SESSION_QUERIES.getById(db, user.sid);
      if (!session) return response.UNAUTHORIZED(reply, 'Invalid or expired session');
    } catch (err) {
      return response.UNAUTHORIZED(reply, 'Unauthorized');
    }
  });
  
  registerRoutes(app);

  // Start the server
  const start = async () => {
    try {
      await app.listen({ port: SERVER_PORT });
      console.log('🚀 Server is up at http://localhost:3001');
    } catch (err) {
      app.log.error(err);
      console.log(err)
      process.exit(1);
    }
  };
  
  start();
}

main();