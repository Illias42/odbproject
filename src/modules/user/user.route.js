import FastifyAuth from "@fastify/auth";
import { credentialsStrategy } from "../../strategies/credentials.js";
import { jwtStrategy } from "../../strategies/jwt.js";
import { registerUserHandler, loginUserHandler } from "./user.controller.js";
import { loginSchema, registerSchema } from "./user.schema.js";

async function userRoutes(app, options, done) {
    app
    .decorate("verifyJWT", jwtStrategy)
    .decorate("verifyCredentials", credentialsStrategy)
    .register(FastifyAuth)
    .after(() => {

        app.post("/register", {schema: registerSchema}, registerUserHandler);

        app.post(
            "/login", 
            {   
                schema: loginSchema,
                preHandler: app.auth([
                    app.verifyCredentials,
                ]),
            }, 
            loginUserHandler
        );
        
    })

    done();
}

export default userRoutes;