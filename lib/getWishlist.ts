import { getUser, getDbConnection } from "./getUser"
import { Wishlist } from "./sql_models"

export async function getAllWishlists(token: string) {
    const rows = await getUser("token", token)

    if (typeof rows === "string" || !rows) {
        return rows
    }

    const id = rows.id
    const db = await getDbConnection()
    let wishlists: Wishlist[];

    try {
        wishlists = await db.query(`SELECT * FROM wishlists WHERE owner_id = "${id}"`)
    } catch {
        return "DATABASE ERROR"
    }
    
    if (wishlists.length === 0) {
        return "You have 0 wishlists. Create one!"
    }

    return wishlists
}