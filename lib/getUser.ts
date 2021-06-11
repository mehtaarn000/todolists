import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { User } from "./sql_models"
import { Connection, createConnection } from 'promise-mysql'

dotenv.config({path: "./.env.local"})

export const getDbConnection = async (): Promise<Connection> => {
    return await createConnection({
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PW,
        database: process.env.DATABASE
    })
}

export async function validateUser(username: string, password: string): Promise<boolean|string|null> {
    const userObj = await getUser("username", username)
    
    if (typeof userObj === 'string') {
        return userObj as string 
    }

    if (!userObj) {
        return userObj as null
    }

    const pass = userObj?.pass
    if (await bcrypt.compare(password, pass as string)) {
        return true
    }

    return false
}   

export async function getUser(field: string, value: string | number): Promise<string | null | User> {
    const connection = await getDbConnection()
    
    let rows;

    try {
        rows = await connection.query(`SELECT * FROM users WHERE ${field} = "${value}"`) 
    } catch (err) {
        return "DATABASE ERROR"
    } finally {
        connection.end()
    }
    
    const users = rows as unknown as User[]

    if (users.length > 1) {
        return "SQL Error"
    }

    if (users.length < 1) {
        return null
    }

    return users[0]
}

export async function getTokenByUser(username: string): Promise<string|null> {
    const users = await getUser("username", username)

    if (typeof users === "string") {
        return users
    }

    if (!users) {
        return users
    }

    return users.token
}