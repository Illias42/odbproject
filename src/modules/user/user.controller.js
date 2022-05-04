import { createUser } from "./user.service.js";
import p from "@prisma/client";
import jwt from "jsonwebtoken";

const { Prisma } = p;

export async function registerUserHandler(req, reply) {
    const body = req.body;
    console.log(body);
    try {
        const [_, token] = await createUser(body);
        return reply.code(201).send({
            message: "User was created",
            token
        });
    } catch(e) {
        console.log(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                return reply.code(409).send('This email is already taken');
            }
        }
        
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