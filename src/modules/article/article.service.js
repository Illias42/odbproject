import { prisma } from "../../utils/prisma.js";

export async function createArticle(user, body) {
    const { id } = user;
    const { title, content } = body;
    const article = prisma.article.create({
        data: {
            authorId: id,
            title,
            content
        }
    })
    return article;
}

export async function getMyArticles(user) {
    const { id } = user;
    const articles = prisma.article.findMany({
        where: {
            authorId: id
        },
        include: {
            author: {
                select: {
                    name: true,
                    surname: true,
                    avatar: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return articles;
}

export async function getArticle(id) {
    const article = prisma.article.findFirst({
        where: {
            id: id
        },
        include: {
            author: {
                select: {
                    name: true,
                    surname: true,
                    avatar: true
                }
            }
        },
    })

    return article;
}