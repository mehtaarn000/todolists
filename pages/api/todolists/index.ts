import { NextApiRequest, NextApiResponse } from "next"
import { getAllLists } from "../../../lib/getTodolist"

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const bodyString = req.body
    const body = JSON.parse(JSON.parse(JSON.stringify(bodyString)))
    const token = body.token

    if (!token) {
        res.status(400).json({message: "Invalid data sent"})
        return
    }

    const todolists = await getAllLists(token)

    if (todolists === "SQL Error" || todolists === "DATABASE ERROR") {
        res.status(500).json({message: todolists})
        return
    }

    if (!todolists) {
        res.status(401).json({message: "Unauthorized"})
    }

    if (todolists === "You have 0 todolists. Create one!") {
        res.status(204).json({message: todolists})
        return
    }

    res.status(200).json({todolists: todolists})
}