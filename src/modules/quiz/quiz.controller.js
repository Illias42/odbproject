import { createQuiz } from "./quiz.service.js";

export async function createQuizHandler(req, reply) {
    try {
        const {body, user} = req;
        const quiz = await createQuiz(body, user);
        return reply.code(201).send({
            message: "Quiz was created",
            quiz
        });
    } catch(e) {
        console.log(e);
        return reply.code(500).send("Failed to create quiz");
    }
}