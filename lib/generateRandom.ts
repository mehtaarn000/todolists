import { randomBytes } from "crypto";

export function generateRandom() {
    const token = randomBytes(40).toString('hex') 
    return token
}