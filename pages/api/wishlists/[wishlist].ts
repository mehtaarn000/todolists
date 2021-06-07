import { NextApiRequest, NextApiResponse } from "next"
import { getWishlist } from "../../../lib/getWishlist"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const bodyString = req.body
    const body = JSON.parse(bodyString)
    const token = body.token

    if (!token) {
        res.status(400).json({message: "Invalid data sent"})
        return
    }

    const id = Number(req.query.wishlist)

    if (!id || typeof id === "object") {
        res.status(404).json({message: "Client error"})
        return
    }

    const wishlist = await getWishlist(id, token)

    if (typeof wishlist === "string") {
        res.status(404).json({message: wishlist})
        return
    }

    res.status(200).send({wishlist: wishlist})
}