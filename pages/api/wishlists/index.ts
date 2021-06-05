import { NextApiRequest, NextApiResponse } from "next"
import { getAllWishlists } from "../../../lib/getWishlist"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const bodyString = req.body
    const body = JSON.parse(bodyString)
    const token = body.token

    if (!token) {
        res.status(400).json({message: "Invalid data sent"})
        return
    }

    const wishlists = await getAllWishlists(token)
    if (wishlists === "SQL Error" || wishlists === "DATABASE ERROR") {
        res.status(500).json({message: wishlists})
        return
    }

    if (!wishlists) {
        res.status(401).json({message: "Unauthorized"})
    }

    if (wishlists === "You have 0 wishlists. Create one!") {
        res.status(204).json({message: wishlists})
        return
    }

    res.status(200).json({wishlists: wishlists})
}