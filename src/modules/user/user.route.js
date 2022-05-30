import FastifyAuth from "@fastify/auth";
import { upload } from "../../utils/s3.js";
import { credentialsStrategy } from "../../strategies/credentials.js";
import { jwtStrategy } from "../../strategies/jwt.js";
import { registerUserHandler, loginUserHandler, updateUserHandler, deleteUserHandler, getUserHandler } from "./user.controller.js";

async function userRoutes(app, options, done) {
    app
    .decorate("verifyJWT", jwtStrategy)
    .decorate("verifyCredentials", credentialsStrategy)
    .register(FastifyAuth)
    .after(() => {
        app.post("/register", {preHandler: upload.single('avatar')}, registerUserHandler);

        app.get(
            '/:id', 
            {}, 
            getUserHandler
        );

        app.post(
            "/login", 
            {   
                preHandler: app.auth([app.verifyCredentials]),
            }, 
            loginUserHandler
        );

        app.delete("/:id",
            {
                preHandler: app.auth([app.verifyJWT])
            }, 
            deleteUserHandler
        ); 

        app.put('/:id', 
            {
                preHandler: [
                    app.auth([app.verifyJWT]),
                    upload.single('avatar')
                ]
            }, 
            updateUserHandler
        );        
        
    })

    done();
}

export default userRoutes;