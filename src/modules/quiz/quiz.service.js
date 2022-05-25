import {prisma} from "../../utils/prisma.js";

export async function createQuiz(body, user) {
    return await prisma.quiz.create({
        data: {
            authorId: user.id,
            ...body
        }
    });
}

export async function getAllQuizzes() {
    return await prisma.quiz.findMany({
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
            createdAt: 'asc'
        }
    }); 
}

export async function getMyQuizzes(myId) {
    return await prisma.quiz.findMany({
        where: {
            authorId: myId
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
                    name: true,
                    surname: true,
                    avatar: true
                }
            }
        },
    });
}