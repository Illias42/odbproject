import { createUser, deleteUser, getUser } from "./user.service.js";
import p from "@prisma/client";
import { prisma } from "../../utils/prisma.js";
import jwt from "jsonwebtoken";
import { hashPassword } from "../../utils/hash.js";

const { Prisma } = p;

export async function registerUserHandler(req, reply) {
    const body = req.body;
    body.avatar = req.file.location;
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
        const user = await prisma.user.findFirst({
            where: {id: req.user.id}
        })
        const token = jwt.sign({id: user.id, avatar: user.avatar, name: user.name, surname: user.surname, about: user.about, email: user.email}, process.env.JWT_SECRET ?? "secretkey", {expiresIn: "1d"});
        return reply.code(201).send({
            message: "Authenticated",
            token
        });
    } catch(e) {
        return reply.code(500).send("Not authenticated");
    }
}

export async function getUserHandler(req, reply) {
    try {
        const id = Number(req.params.id);
        const user = await getUser(id);
        return reply.code(200).send(user);
    } catch(e) {
        return reply.code(500).send("Failed to get user");
    }
}

export async function deleteUserHandler(req, reply) {
    try {
        const user = await deleteUser(req.user.id);
        console.log("deleted user: ", user);
        return reply.code(204).send(user);
    } catch(e) {
        return reply.code(500).send("Failed to delete user");
    }
}

export async function getUserAvatar(req, reply) {
    const user = await prisma.user.findFirst({where:{
        id: Number(req.params.userId)
    }});
    console.log(user.avatar);
    reply.sendFile(user.avatar, './uploads');
}

export async function updateUserHandler(req, reply) {
    try {
        let body = req.body;

        if (req.file?.location) {
            body.avatar = req.file.location;
        }
        
        if (body.password) {
            const {hash, salt} = hashPassword(body.password);
            body.password = hash;
            body.salt = salt;
        } else {
            delete body.password;
        }

        const user = await prisma.user.update({
            where: {id: req.user.id},
            data: {
                ...req.body
            }
        })

        const token = jwt.sign({id: user.id, avatar: user.avatar, name: user.name, surname: user.surname, about: user.about, email: user.email}, process.env.JWT_SECRET ?? "secretkey", {expiresIn: "5d"});
        return reply.code(201).send({user, token});
    } catch(e) {
        console.log(e);
        return reply.code(500).send("Not authenticated");
    }
}