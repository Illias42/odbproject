import {prisma} from "../../utils/prisma.js";

export async function createQuiz(body, user) {
    const quiz = await prisma.quiz.create({
        data: {
            authorId: user.id,
            ...body
        }
    });
    console.log(quiz);
    return {};
}