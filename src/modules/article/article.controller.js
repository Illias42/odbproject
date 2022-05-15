import { createArticle, getArticle, getMyArticles } from "./article.service.js";

export async function createArticleHandler(req, reply) {
    const body = req.body;
    const user = req.user;

    try {
        const article = await createArticle(user, body);
        console.log(article);
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
    const user = req.user;

    try {
        const articles = await getMyArticles(user);
        console.log(articles);
        return reply.code(200).send({
            articles
        });
    } catch(e) {
        console.log(e);
        return reply.code(500).send("Failed to get articles");
    }
}

export async function getArticleHandler(req, reply) {
    const articleId = Number(req.params.articleId);
    try {
        const article = await getArticle(articleId);
        console.log(article);
        return reply.code(200).send({
            article
        });
    } catch(e) {
        console.log(e);
        return reply.code(500).send("Failed to get article");
    }
}