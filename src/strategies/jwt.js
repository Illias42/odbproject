import { verifyUser } from "../modules/user/user.service.js";

export const jwtStrategy = async (req, reply) => {
    try {
        if (!req.headers.authorization) {
            throw new Error('No token was sent');
        }
        const token = req.headers.authorization.replace("Bearer ", "");
        console.log("Token: ", token)
        const user = await verifyUser(token);

        if (!user) {
            throw new Error('Authentication failed!');
        }
        req.user = user;
        req.token = token;
        
    } catch (error) {
        reply.code(401).send(error);
    }
}