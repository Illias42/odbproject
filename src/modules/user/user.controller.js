import { createUser } from "./user.service.js";
import jwt from "jsonwebtoken";

export async function registerUserHandler(req, reply) {
    const body = req.body;

    try {
        const [_, token] = await createUser(body);
        return reply.code(201).send({
            message: "User was created",
            token
        });
    } catch(e) {
        return reply.code(500).send("Failed to create new user");
    }
}

export async function loginUserHandler(req, reply) {
    try {
        const token = jwt.sign({id: req.user.id}, process.env.JWT_SECRET ?? "secretkey", {expiresIn: "1d"});
        return reply.code(201).send({
            message: "Authenticated",
            token
        });
    } catch(e) {
        return reply.code(500).send("Not authenticated");
    }
}