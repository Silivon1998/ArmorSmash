import { FastifyInstance } from 'fastify';
import db from '@DATABASE';
import { QUERIES } from '@db/schema/queries';
import { License } from '@shared/types';
import { response } from '@network/response';
import crypto from 'crypto';

export async function licenseRoutes(app: FastifyInstance) {
  var preHandler = { preHandler: [app.authenticate] };

  // CREATE LICENSE
  app.post(License.Create.path, async (req, reply) => {
    var { max_users, expires } = req.body as License.Create.Request;

    if (!max_users || !expires) return response.BAD_REQUEST(reply, 'Missing parameters');

    var code = crypto.randomUUID().slice(0, 16).toUpperCase();
    var now = Date.now();
    var id = crypto.randomUUID();

    QUERIES.LICENSE_QUERIES.insert(db, id, code, now, expires, max_users);

    return response.CREATED(reply, 'License created', { code });
  });

  // DELETE LICENSE
  app.post(License.Delete.path, async (req, reply) => {
    var { code } = req.body as License.Delete.Request;

    if (!code) return response.BAD_REQUEST(reply, 'Missing license code');

    var license = QUERIES.LICENSE_QUERIES.getByCode(db, code);
    if (!license) return response.NOT_FOUND(reply, 'License not found');

    QUERIES.LICENSE_QUERIES.deleteByCode(db, code);
    return response.OK(reply, 'License deleted', { success: true });
  });

  // UPDATE LICENSE
  app.post(License.Update.path, async (req, reply) => {
    var { code, max_users, expires } = req.body as License.Update.Request;

    if (!code) return response.BAD_REQUEST(reply, 'Missing license code');
    if (!max_users && !expires) return response.BAD_REQUEST(reply, 'Nothing to update');

    var license = QUERIES.LICENSE_QUERIES.getByCode(db, code);
    if (!license) return response.NOT_FOUND(reply, 'License not found');

    QUERIES.LICENSE_QUERIES.update(db, code, max_users, expires);
    return response.OK(reply, 'License updated', { updated: true });
  });

  
  // GET ALL LICENSE
  app.post(License.GetAll.path, async (req, reply) => {
    var {} = req.body as License.GetAll.Request;

    var license = QUERIES.LICENSE_QUERIES.getAll(db);
    if (!license) return response.NOT_FOUND(reply, 'License not found');

    return response.OK(reply, 'License list', license as License.GetAll.Response );
  });
}