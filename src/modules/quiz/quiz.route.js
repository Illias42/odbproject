import FastifyAuth from "@fastify/auth";
import { jwtStrategy } from "../../strategies/jwt.js";
import { createQuizHandler } from "../quiz/quiz.controller.js";

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
    })

    done();
}

export default quizRoutes;