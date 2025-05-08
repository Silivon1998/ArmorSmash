import { FastifyInstance } from "fastify";
import authRoutes from "./auth";
import protectedRoutes from "./protected";
import { licenseRoutes } from "./license";

export default function registerRoutes(app: FastifyInstance) {

    // Simple test route
    app.get('/', async (request, reply) => {
        return { status: 'Armor Smash Server is running!' };
    });

    authRoutes(app);
    licenseRoutes(app);
    protectedRoutes(app);
}