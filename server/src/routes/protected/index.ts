import db from "@DATABASE";
import { SessionState } from "@db/models/session";
import { QUERIES } from "@db/schema/queries";
import { response } from "@network/response";
import { User } from "@shared/types";
import { FastifyInstance } from "fastify";

export default function protectedRoutes(app: FastifyInstance) {
    var handler = { preHandler: [app.authenticate] };
    
    app.get(User.GetData.path, handler, async (req, reply) => {
        var { userId } = req.body as User.GetData.Request;

        if (!userId) return response.BAD_REQUEST(reply, 'Invalid user id');
        var user = QUERIES.USERS_QUERIES.getById(db, userId);
        if (!user) return response.NOT_FOUND(reply, 'User not found');

        return {
            email: user.email,
            last_activity: user.last_activity,
            ...(req.user.uid === userId ? { code: user.registered_with } : undefined)
        } as User.GetData.Response;
    });

    app.get(User.ValidateToken.path, handler, async (req, reply) => {
        return response.OK(reply, 'Token is valid');
    });

    app.post(User.Logout.path, handler, async (req, reply) => {
        const sid = req.user.sid;

        // Revoke session (if you're tracking state)
        QUERIES.SESSION_QUERIES.updateState(db, SessionState.REVOKED, sid);

        // Clear cookie
        reply.clearCookie('token', { path: '/' });
        return response.OK(reply, 'Logged out successfully');
    });
}

