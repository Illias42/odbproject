import { prisma } from "../../utils/prisma.js";
import { convert } from "html-to-text";

export async function createArticle(user, body) {
    const { id } = user;
    const { title, content } = body;
    return await prisma.article.create({
        data: {
            authorId: id,
            title,
            content
        }
    });
}

export async function getArticles(page) {
    const articles = await prisma.article.findMany({
        skip: (page - 1) * 5,
        take: 5,
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
    
    articles.forEach((article) => {
        article.content = convert(article.content, {
            limits: {
                maxChildNodes: 1
            }
        })
    });

    const count = await prisma.article.count();

    return {articles, count};
}

export async function getMyArticles(user) {
    const { id } = user;
    return await prisma.article.findMany({
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
}

export async function getArticle(id) {
    return await prisma.article.findFirst({
        where: {
            id: id
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    avatar: true
                }
            },
            comments: {
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            surname: true,
                            avatar: true
                        }
                    }
                }
            }
        },
    })
}

export async function deleteArticle(articleId) {
    return await prisma.article.delete({
        where: {
            id: articleId
        }
    });
}