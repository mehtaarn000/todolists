import { getDbConnection, getUser } from "./getUser";

export async function getFriends(username: string): Promise<string | { username: string; }[]> {
    const user = await getUser("username", username)

    if (typeof user === 'string') {
        return user
    }

    if (!user) {
        return "user does not exist"
    }

    const id = user.id
    const db = await getDbConnection()

    try {
        const sql = `
        SELECT users.username FROM friends, users
        WHERE CASE 
            WHEN friends.user1 = ${db.escape(id)} THEN friends.user2 = users.id
            WHEN friends.user2 = ${db.escape(id)} THEN friends.user1 = users.id
            END`

        const rows: Array<{username: string}> = await db.query(sql)
        
        if (!rows.length) {
            return "User does not exist"
        }

        return rows
    } catch {
        return "DATABASE ERROR"
    } finally {
        db.end()
    }
}