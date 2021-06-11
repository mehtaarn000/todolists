import { randomBytes } from "crypto";

export function generateRandom(): string {
    const token = randomBytes(40).toString('hex') 
    return token
}