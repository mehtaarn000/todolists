import { getDbConnection, getUser } from "./getUser"
import { checkListExists } from "./getTodolist"

export async function createTodolist(token: string, title: string): Promise<string | null | boolean> {
    const rows = await getUser("token", token)

    if (typeof rows === "string" || !rows) {
        return rows
    }

    const user_id = rows.id

    const todolistExists = await checkListExists(user_id, title)

    if (todolistExists) {
        return "Todolist title already exists"
    }

    const db = await getDbConnection()
    
    try {
        await db.query(`INSERT INTO wishlists(owner_id, title) VALUES (${db.escape(user_id)}, ${db.escape(title)})`)
    } catch {
        return "DATABASE ERROR"
    } finally {
        db.end()
    }

    return true
}