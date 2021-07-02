import { getUser, getDbConnection } from "./getUser"
import { Todolist, TodolistsItems, Item } from "./sql_models"

export async function getAllLists(token: string): Promise<string | TodolistsItems[] | null> {
    const rows = await getUser("token", token)

    if (typeof rows === "string" || !rows) {
        return rows
    }

    const id = rows.id
    const db = await getDbConnection()
    let todolists: TodolistsItems[];

    try {
        todolists = await db.query(`SELECT id, title FROM wishlists WHERE owner_id = "${id}"`)
    } catch {
        return "DATABASE ERROR"
    } finally {
        db.end()
    }
    
    if (todolists.length === 0) {
        return "You have 0 todolists. Create one!"
    }

    return todolists
}

export async function getList(id: number, token: string): Promise<string | [string, Item[]] | null> {
    const rows = await getUser("token", token)

    if (typeof rows === "string" || !rows) {
        return rows
    }

    const user_id = rows.id

    const db = await getDbConnection()
    let todolist: Todolist[]
    let urls: Item[]

    try {
        todolist = await db.query(`SELECT title, id, owner_id FROM wishlists WHERE id = "${db.escape(id)}"`)
    } catch {
        return "DATABASE ERROR"
    }

    if (todolist.length === 0) {
        return "Wishlist does not exist"
    }

    if (todolist.length > 1) {
        return "DATABASE ERROR"
    }

    if (user_id !== todolist[0].owner_id) {
        return "Unauthorized"
    }

    try {
        urls = await db.query(`SELECT id, url FROM urls WHERE wishlist_id = "${todolist[0].id}"`)
    } catch {
        return "DATABASE ERROR"
    }

    console.log(urls)
    return [todolist[0].title, urls]
}

// Any array = true
export async function checkListExists(owner_id: number, title: string): Promise<null | string | boolean> {
    const db = await getDbConnection()
    let todolist: Array<Todolist>

    try {
        todolist = await db.query(`SELECT * FROM wishlists WHERE owner_id = "${owner_id}" AND title = "${title}"`)
    } catch {
        return "DATABASE ERROR"
    } finally {
        db.end()
    }

    if (todolist.length) {
        return true
    }

    return false
}

