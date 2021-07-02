import { validateByToken, getDbConnection } from "./getUser";

export async function createItem(token: string, todolist_id: number, url: string): Promise<string | null | number> {
    const user = await validateByToken(token)

    if (!user) {
        return null
    }

    const db = await getDbConnection()

    try {
        await db.query(`INSERT INTO urls(wishlist_id, url) VALUES (${db.escape(todolist_id)}, ${db.escape(url)})`)
        const row = await db.query(`SELECT LAST_INSERT_ID();`)
        return row[0]["LAST_INSERT_ID()"]
    } catch {
        return "DATABASE ERROR"
    } finally {
        db.end()
    }
}