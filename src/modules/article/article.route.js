import FastifyAuth from "@fastify/auth";
import { jwtStrategy } from "../../strategies/jwt.js";
import { createArticleHandler, deleteArticleHandler, getArticleHandler, getArticlesHandler, getMyArticlesHandler } from "./article.controller.js";

async function articleRoutes(app, options, done) {
    app
    .decorate("verifyJWT", jwtStrategy)
    .register(FastifyAuth)
    .after(() => {
        app.post(
            "/createarticle", 
            {preHandler: app.auth([app.verifyJWT])}, 
            createArticleHandler
        );

        app.get(
            "/page/:pageNumber", 
            {}, 
            getArticlesHandler
        );

        app.get(
            "/myarticles", 
            {preHandler: app.auth([app.verifyJWT])}, 
            getMyArticlesHandler
        );

        app.get(
            "/:articleId", 
            {}, 
            getArticleHandler
        );

        app.delete(
            "/:articleId", 
            {preHandler: app.auth([app.verifyJWT])}, 
            deleteArticleHandler
        );
    })

    done();
}

export default articleRoutes;