import { NextApiRequest, NextApiResponse } from "next";
import { deleteFromDb } from "../../../lib/delete";
import { validateByToken } from "../../../lib/getUser";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const bodyString = req.body
    const body = JSON.parse(JSON.parse(JSON.stringify(bodyString)))
    const { token, id } = body

    if (!token) {
        res.status(400).json({message: "Invalid data sent"})
        return
    }

    const validate = await validateByToken(token as string)

    if (!validate) {
        res.status(401).json({message: "Unauthorized"})
        return
    }

    const deleteTodolist = await deleteFromDb("urls", "id", id)

    // success
    if (!deleteTodolist) {
        res.status(200).json({message: "success"})
        return
    }

    res.status(500).json({message: "DATABASE ERROR"})
}