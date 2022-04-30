import crypto from "crypto";

export function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

    return { hash, salt };
}

export function verifyPassword(password, salt, hash) {
    const candidateHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    console.log(candidateHash);
    return candidateHash === hash;
}