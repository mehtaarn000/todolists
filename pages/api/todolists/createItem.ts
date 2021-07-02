import { NextApiRequest, NextApiResponse } from "next"
import { createItem } from "../../../lib/createItem"

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const bodyString = req.body
    const body = JSON.parse(JSON.parse(JSON.stringify(bodyString)))

    const { token, todolist_id, url } = body
    if (!token || !url) {
        res.status(400).json({message: "Invalid data sent"})
        return
    }

    const newUrlID = await createItem(token, todolist_id, url)

    if (typeof newUrlID === "string") {
        res.status(500).json({message: "Internal server error"})
        return
    }

    if (!newUrlID) {
        res.status(401).json({message: "Unauthorized"})
        return
    }

    res.status(201).json({message: "success", todolists: {url: url, id: newUrlID}})
}