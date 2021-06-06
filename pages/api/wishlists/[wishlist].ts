import { NextApiRequest, NextApiResponse } from "next"
import { getWishlist } from "../../../lib/getWishlist"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const id = Number(req.query.wishlist)

    if (!id || typeof id === "object") {
        res.status(404).json({message: "Client error"})
        return
    }

    const wishlist = await getWishlist(id)

    if (typeof wishlist === "string") {
        res.status(404).json({message: wishlist})
        return
    }

    res.status(200).send({wishlist: wishlist})
}