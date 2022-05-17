import Fastify from "fastify";
import formBodyPlugin from "@fastify/formbody";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import multer from "fastify-multer"
import userRoutes from "./modules/user/user.route.js";
import articleRoutes from "./modules/article/article.route.js";

const app = Fastify({logger: true});
app.register(cors, { origin: "*" })
app.register(fastifySwagger, {
    exposeRoute: true,
    routePrefix: '/apidocs',
    swagger: {
        info: { title: 'api' }
    }
});

app.register(formBodyPlugin);
app.register(multer.contentParser);

app.register(userRoutes, {prefix: "api/users"});
app.register(articleRoutes, {prefix: "api/articles"});

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