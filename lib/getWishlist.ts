import { getUser, getDbConnection } from "./getUser"
import { Wishlist, WishlistURLS } from "./sql_models"

export async function getAllWishlists(token: string): Promise<string | WishlistURLS[] | null> {
    const rows = await getUser("token", token)

    if (typeof rows === "string" || !rows) {
        return rows
    }

    const id = rows.id
    const db = await getDbConnection()
    let wishlists: WishlistURLS[];

    try {
        wishlists = await db.query(`SELECT wishlists.title,urls.url FROM wishlists INNER JOIN urls ON wishlists.id = urls.wishlist_id WHERE owner_id = "${id}"`)
    } catch {
        return "DATABASE ERROR"
    } finally {
        db.end()
    }
    
    if (wishlists.length === 0) {
        return "You have 0 wishlists. Create one!"
    }

    return wishlists
}

export async function getWishlist(id: number, token: string): Promise<string | Wishlist | null> {
    const rows = await getUser("token", token)

    if (typeof rows === "string" || !rows) {
        return rows
    }

    const user_id = rows.id

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

    if (user_id !== wishlist[0].owner_id) {
        return "Unauthorized"
    }

    return wishlist[0]
}

// Any array = true
export async function checkWishlistExists(owner_id: number, title: string): Promise<null | string | boolean> {
    const db = await getDbConnection()
    let wishlist: Array<Wishlist>

    try {
        wishlist = await db.query(`SELECT * FROM wishlists WHERE owner_id = "${owner_id}" AND title = "${title}"`)
    } catch {
        return "DATABASE ERROR"
    } finally {
        db.end()
    }

    if (wishlist.length) {
        return true
    }

    return false
}

