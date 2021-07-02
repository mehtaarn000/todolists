import { NextApiRequest, NextApiResponse } from "next"
import { getList } from "../../../lib/getTodolist"

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const bodyString = req.body
    const body = JSON.parse(JSON.parse(JSON.stringify(bodyString)))
    const token = body.token

    if (!token) {
        res.status(400).json({message: "Invalid data sent"})
        return
    }

    const id = Number(req.query.todo)

    if (!id || typeof id === "object") {
        res.status(404).json({message: "Client error"})
        return
    }

    const todolist = await getList(id, token)

    if (typeof todolist === "string") {
        res.status(404).json({message:todolist})
        return
    }

    res.status(200).send({todolists: todolist})
}