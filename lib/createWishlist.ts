import { getDbConnection, getUser } from "./getUser"
import { checkWishlistExists } from "./getWishlist"

export async function createWishlist(token: string, title: string): Promise<string | null> {
    const rows = await getUser("token", token)

    if (typeof rows === "string" || !rows) {
        return rows
    }

    const user_id = rows.id

    const wishlistExists = await checkWishlistExists(user_id, title)

    if (wishlistExists) {
        return "Wishlist title already exists"
    }

    const db = await getDbConnection()
    
    try {
        await db.query(`INSERT INTO wishlists(owner_id, title) VALUES (${db.escape(user_id)}, ${db.escape(title)})`)
    } catch {
        return "DATABASE ERROR"
    } finally {
        db.end()
    }

    return ""
}