import Fastify from "fastify";
import formBodyPlugin from "@fastify/formbody";
import fastifySwagger from "fastify-swagger";
import userRoutes from "./modules/user/user.route.js";

const app = Fastify({logger: true});
app.register(fastifySwagger, {
    exposeRoute: true,
    routePrefix: '/apidocs',
    swagger: {
        info: { title: 'api' }
    }
});
app.register(formBodyPlugin);
app.register(userRoutes, {prefix: "api/users"});


const port = process.env.PORT ?? 8000;

const start = async () => {
    try {
        await app.listen(port, '0.0.0.0');
    } catch(err) {
        app.log.error(err);
        process.exit(1);
    }
}
start();