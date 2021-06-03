import { User } from "./sql_models"
import { getDbConnection } from "./getUser"
import { generateRandom } from "./generateRandom"

async function getUser(username: string, email: string): Promise<string> {
    const connection = await getDbConnection()
    
    let rows;

    try {
        rows = await connection.query(`SELECT * FROM users WHERE username = "${connection.escape(username)}" AND email = ${connection.escape(email)}`) 
    } catch (err) {
        return "DATABASE ERROR"
    }
    
    const users = rows as unknown as User[]

    if (users.length > 0) {
        if (users[0].username === username || users[1].username === username) {
            return username
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
        const connection = await getDbConnection()
        try {
            connection.query(`INSERT INTO users (username, pass, email, token) VALUES ("${username}", "${pass}", "${email}", "${token}")`) 
            return "token " + token
        } catch {
            return "DATABASE ERROR"
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
