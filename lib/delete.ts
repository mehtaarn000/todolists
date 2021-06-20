import { getDbConnection } from "./getUser";

export async function deleteFromDb(table: string, key: string, value: string | number): Promise<string> {
    const db = await getDbConnection()

    try {
        db.query(`DELETE FROM ${table} WHERE ${key} = ${db.escape(value)}`)
    } catch {
        return "DATABASE ERROR"
    }

    return ""
}