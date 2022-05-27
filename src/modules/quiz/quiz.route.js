import FastifyAuth from "@fastify/auth";
import { jwtStrategy } from "../../strategies/jwt.js";
import { createQuizHandler, getAllQuizzesHandler, getMyQuizzesHandler, getQuizHandler } from "../quiz/quiz.controller.js";

async function quizRoutes(app, options, done) {
    app
    .decorate("verifyJWT", jwtStrategy)
    .register(FastifyAuth)
    .after(() => {

        app.post("/", 
            {
                preHandler: app.auth([app.verifyJWT]),
            }, 
            createQuizHandler
        );

        app.get("/page/:page", 
            {}, 
            getAllQuizzesHandler
        );

        app.get("/my/:id", 
            {}, 
            getMyQuizzesHandler
        );

        app.get("/:id", 
            {}, 
            getQuizHandler
        );

    })

    done();
}

export default quizRoutes;