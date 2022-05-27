import { prisma } from "../../utils/prisma.js";
import { convert } from "html-to-text";

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
    console.log('asd');
    const article = await prisma.article.findFirst({
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
    console.log(article);
    return article;
}