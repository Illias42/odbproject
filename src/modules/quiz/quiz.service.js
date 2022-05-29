import {prisma} from "../../utils/prisma.js";

export async function createQuiz(body, user) {
    return await prisma.quiz.create({
        data: {
            authorId: user.id,
            ...body
        }
    });
}

export async function getAllQuizzes(page) {
    const quizzes = await prisma.quiz.findMany({
        skip: (page - 1) * 9,
        take: 9,
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
    });

    const count = await prisma.quiz.count();

    return {quizzes, count}
}

export async function getMyQuizzes(myId) {
    return await prisma.quiz.findMany({
        where: {
            authorId: myId
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
    });
}

export async function getQuiz(id) {
    return await prisma.quiz.findFirst({
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
            }
        },
    });
}

export async function deleteQuiz(id) {
    return await prisma.quiz.delete({
        where: {
            id: id
        }
    });
}