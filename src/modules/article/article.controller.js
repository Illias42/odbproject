import { createArticle, getArticle, getArticles, getMyArticles } from "./article.service.js";

export async function getArticlesHandler(req, reply) {
    try {
        const page = Number(req.params.page);
        const articles = await getArticles(page);
        return reply.code(200).send(articles);
    } catch(e) {
        console.log(e);
        return reply.code(500).send("Failed to get articles");
    }
}

export async function createArticleHandler(req, reply) {
    try {
        const body = req.body;
        const user = req.user;
        const article = await createArticle(user, body);
        return reply.code(201).send({
            message: "Article was created",
            article
        });
    } catch(e) {
        console.log(e);
        return reply.code(500).send("Failed to create article");
    }
}

export async function getMyArticlesHandler(req, reply) {
    try {
        const user = req.user;
        const articles = await getMyArticles(user);
        return reply.code(200).send({
            articles
        });
    } catch(e) {
        console.log(e);
        return reply.code(500).send("Failed to get articles");
    }
}

export async function getArticleHandler(req, reply) {
    try {
        const articleId = Number(req.params.articleId);
        const article = await getArticle(articleId);
        return reply.code(200).send({
            article
        });
    } catch(e) {
        console.log(e);
        return reply.code(500).send("Failed to get article");
    }
}

export async function deleteArticleHandler(req, reply) {
    try {
        const articleId = Number(req.params.articleId);
        const article = await deleteArticle(articleId);
        return reply.code(204).send(article);
    } catch(e) {
        console.log(e);
        return reply.code(500).send("Failed to delete article");
    }
}