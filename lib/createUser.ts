import { User } from "./sql_models"
import { getDbConnection } from "./getUser"
import { generateRandom } from "./generateRandom"
import bcrypt from "bcrypt"

async function getUser(username: string, email: string): Promise<string> {
    const connection = await getDbConnection()
    
    let rows;

    try {
        const sql = `SELECT * FROM users WHERE username = ${connection.escape(username)} OR email = ${connection.escape(email)}`
        rows = await connection.query(sql) 
    } catch (err) {
        return "DATABASE ERROR"
    } finally {
        connection.end()
    }
    
    const users = rows as unknown as User[]

    let userCheck2

    try {
        userCheck2 = users[1].username
    } catch {
        userCheck2 = null
    }

    // Pretty bad logic to check whether the username or email or both is in the database
    if (users.length > 0) {
        if (userCheck2) {
            if (userCheck2 === username || users[0].username === username) {
                return username
            }
        } else if (!userCheck2) {
            if (users[0].username === username) {
                return username
            }
        }

        return email
    }

    return ""
}

export async function createUser(username: string, pass: string, email: string): Promise<string> {
    const user = await getUser(username, email)

    // If the username and email are not taken
    if (!user) {
        const token = generateRandom()
        const password = await bcrypt.hash(pass, 10)
        const connection = await getDbConnection()
        try {
            await connection.query(`INSERT INTO users (username, pass, email, token) VALUES ("${username}", "${password}", "${email}", "${token}")`) 
            return "token " + token
        } catch {
            return "DATABASE ERROR"
        } finally {
            connection.end()
        }
    }

    if (user === username) {
        return "username " + username
    }

    if (user === email) {
        return "email " + email
    }

    return user
}