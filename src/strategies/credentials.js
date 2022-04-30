import { findByCredentials } from "../modules/user/user.service.js";

export const credentialsStrategy = async (req, reply) => {
    try {
        if (!req.body?.email || !req.body?.password) {
            throw new Error('Email and password is required!');
        }
        const user = await findByCredentials(req.body.email, req.body.password);
        if (!user) {
            throw new Error('Authentication failed!');
        }
        req.user = user;
    } catch (error) {
        reply.code(400).send(error);
    }
}