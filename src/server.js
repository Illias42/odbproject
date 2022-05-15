import Fastify from "fastify";
import formBodyPlugin from "@fastify/formbody";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifyStatic from "@fastify/static";
import crypto from "crypto";
import multer from "fastify-multer"
import userRoutes from "./modules/user/user.route.js";
import path from "path";
import {fileURLToPath} from "url";
import articleRoutes from "./modules/article/article.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        let customFileName = crypto.randomBytes(18).toString('hex');
        let fileExtension = file.originalname.split('.').pop();
        cb(null, customFileName + '.' + fileExtension)
    }
  })


export const upload = multer({storage: storage})



const app = Fastify({logger: true});
app.register(cors, { origin: "*" })
app.register(fastifySwagger, {
    exposeRoute: true,
    routePrefix: '/apidocs',
    swagger: {
        info: { title: 'api' }
    }
});
app.register(fastifyStatic, {
    root: path.join(__dirname, '../uploads')
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