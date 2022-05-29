import { hashPassword, verifyPassword } from "../../utils/hash.js";
import { prisma } from "../../utils/prisma.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function createUser(input) {
    const { avatar, name, surname, email, password } = input;
    const {hash, salt} = hashPassword(password);

    const user = await prisma.user.create({
        data: {avatar, name, surname, email, salt, password: hash}
    })

    const token = jwt.sign({id: user.id, avatar, name, surname, about: "", email}, process.env.JWT_SECRET ?? "secretkey", {expiresIn: "5d"});

    return [user, token];
}

export async function deleteUser(id) {
    return await prisma.user.delete({
        where: {id}
    });
}

export async function findByCredentials(email, password) {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    if (user) {
        const verified = verifyPassword(password, user.salt, user.password)
        if (verified) {
            return user;
        }
    }
    return undefined;
}

export async function verifyUser(token) {
    try {
        if (!token) {
            return new Error('Missing token');
        }
        const decoded = jwt.verify(token, 'secretkey');
    
        return await prisma.user.findFirst({
            where: {
                id: decoded.id
            }
        });

    } catch(err) {
        return undefined;
    }

}