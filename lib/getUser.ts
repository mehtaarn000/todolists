import util from "util"
import mysql from "mysql"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { User } from "./sql_models"

dotenv.config({path: "./.env.local"})

export async function validateUser(username: string, password: string): Promise<boolean|string> {
    const connection = mysql.createConnection({
        user: "root",
        password: process.env.DATABASE_PW,
        database: process.env.DATABASE
    })

    const query = util.promisify(connection.query).bind(connection);
    
    const rows: any = await query(`SELECT * FROM users WHERE username = "${username}"`)
    const users = rows as User[]
    
    if (users.length > 1) {
        return "SQL Error"
    }

    if (users.length === 0) {
        return "User not found"
    }

    if (await bcrypt.compare(password, users[0].pass)) {
        return true
    }

    return false
}   

export async function getUserByToken(token: string): Promise<string | null> {
    const connection = mysql.createConnection({
        user: "root",
        password: process.env.DATABASE_PW,
        database: process.env.DATABASE
    })

    const query = util.promisify(connection.query).bind(connection);
    
    const rows: any = await query(`SELECT * FROM users WHERE token = "${token}"`)
    const users = rows as User[]

    if (users.length > 1) {
        return "SQL Error"
    }

    if (users.length < 1) {
        return null
    }

    return users[0].username
}

export async function getTokenByUser(username: string): Promise<string|null> {
    const connection = mysql.createConnection({
        user: "root",
        password: process.env.DATABASE_PW,
        database: process.env.DATABASE
    })

    const query = util.promisify(connection.query).bind(connection);
    
    const rows: any = await query(`SELECT * FROM users WHERE username = "${username}"`)
    const users = rows as User[]

    if (users.length > 1) {
        return "SQL Error"
    }

    if (users.length < 1) {
        return null
    }

    return users[0].token
}