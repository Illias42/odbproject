import { createQuiz, deleteQuiz, getAllQuizzes, getMyQuizzes, getQuiz } from "./quiz.service.js";

export async function createQuizHandler(req, reply) {
    try {
        const body = JSON.parse(req.body);
        const user = req.user;
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

export async function getAllQuizzesHandler(req, reply) {
    try {
        const page = Number(req.params.page);
        const quizzes = await getAllQuizzes(page);
        return reply.code(200).send(quizzes);
    } catch(e) {
        console.log(e);
        return reply.code(500).send("Failed to get quizzes");
    }
}

export async function getMyQuizzesHandler(req, reply) {
    try {
        const myId = Number(req.params.id);
        const quizzes = await getMyQuizzes(myId);
        return reply.code(200).send(quizzes);
    } catch(e) {
        console.log(e);
        return reply.code(500).send("Failed to get quizzes");
    }
}

export async function getQuizHandler(req, reply) {
    try {
        const id = Number(req.params.id);
        const quiz = await getQuiz(id);
        return reply.code(200).send(quiz);
    } catch(e) {
        console.log(e);
        return reply.code(500).send("Failed to get quiz");
    }
}

export async function deleteQuizHandler(req, reply) {
    try {
        const id = Number(req.params.id);
        const quiz = await deleteQuiz(id);
        return reply.code(204).send(quiz);
    } catch(e) {
        console.log(e);
        return reply.code(500).send("Failed to delete quiz");
    }
}