import FastifyAuth from "@fastify/auth";
import { upload } from "../../utils/s3.js";
import { credentialsStrategy } from "../../strategies/credentials.js";
import { jwtStrategy } from "../../strategies/jwt.js";
import { registerUserHandler, loginUserHandler, getUserAvatar, updateUserHandler, deleteUserHandler } from "./user.controller.js";
import { loginSchema, registerSchema } from "./user.schema.js";

async function userRoutes(app, options, done) {
    app
    .decorate("verifyJWT", jwtStrategy)
    .decorate("verifyCredentials", credentialsStrategy)
    .register(FastifyAuth)
    .after(() => {

        app.get('/:userId/avatar', {}, getUserAvatar);
        app.post("/register", {preHandler: upload.single('avatar')}, registerUserHandler);

        app.post(
            "/login", 
            {   
                schema: loginSchema,
                preHandler: app.auth([app.verifyCredentials]),
            }, 
            loginUserHandler
        );

        app.delete("/:id",
            {preHandler: app.auth([app.verifyJWT])}, 
            deleteUserHandler); 

        app.put('/:id', 
            {preHandler: [
                app.auth([app.verifyJWT]),
                upload.single('avatar')
            ]}, 
            updateUserHandler);        
        
    })

    done();
}

export default userRoutes;