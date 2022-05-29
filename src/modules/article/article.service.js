import { prisma } from "../../utils/prisma.js";
import { JSDOM } from "jsdom";

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
                    id: true,
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
        const dom = new JSDOM(article.content);
        let content = dom.window.document.querySelector("p").textContent;
        let length = 300; 
        article.content = content.length > length ? 
                          content.substring(0, length) + "..." : 
                          content;
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
                    id: true,
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