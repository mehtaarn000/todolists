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

export async function getWishlist(id: number): Promise<string | Wishlist> {
    const db = await getDbConnection()
    let wishlist: Wishlist[]

    try {
        wishlist = await db.query(`SELECT * FROM wishlists WHERE id = "${db.escape(id)}"`)
    } catch {
        return "DATABASE ERROR"
    }

    if (wishlist.length === 0) {
        return "Wishlist does not exist"
    }

    if (wishlist.length > 1) {
        return "DATABASE ERROR"
    }

    return wishlist[0]
}