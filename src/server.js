import Fastify from "fastify";
import formBodyPlugin from "@fastify/formbody";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import multer from "fastify-multer"
import userRoutes from "./modules/user/user.route.js";
import articleRoutes from "./modules/article/article.route.js";
import quizRoutes from "./modules/quiz/quiz.route.js";
import fastifyIO from "fastify-socket.io";
import { prisma } from "./utils/prisma.js";

const app = Fastify({logger: true});
app.register(cors, { origin: "*" })
app.register(formBodyPlugin);
app.register(multer.contentParser);
app.register(fastifyIO, {cors: { origin: "*" }});
app.register(fastifySwagger, {
    exposeRoute: true,
    routePrefix: '/apidocs',
    swagger: {
        info: { title: 'api' }
    }
});


app.register(userRoutes, {prefix: "api/users"});
app.register(articleRoutes, {prefix: "api/articles"});
app.register(quizRoutes, {prefix: "api/quiz"});

app.get("/", (req, reply) => {
    app.io.emit("hello");
})

app.ready().then(() => {
    app.io.on("connection", (socket) => {

        socket.on("join-room", (room) => {
            socket.join(room);
            console.log(`Socket ${socket.id} joined to room ${room}`)
        });

        socket.on("comment", async (room, data) => {
            const comment = await prisma.comment.create({
                data: {
                    authorId: data.authorId,
                    articleId: Number(data.articleId),
                    text: data.text,
                    createdAt: new Date(data.createdAt)
                }
            })
            console.log(comment);
            socket.to(room).emit("message", data);
        })
    });
    
})

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