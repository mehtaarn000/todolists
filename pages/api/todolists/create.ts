import { NextApiRequest, NextApiResponse } from "next"
import { createTodolist } from "../../../lib/createTodolist"

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const bodyString = req.body
    const body = JSON.parse(JSON.parse(JSON.stringify(bodyString)))

    const { token, title } = body
    if (!token || !title) {
        res.status(400).json({message: "Invalid data sent"})
        return
    }
    
    const success = await createTodolist(token, title)

    if (typeof success === "string" || !success) {
        res.status(404).json({message: success})
        return
    }

    res.status(201).json({message: "Todolist successfully created!"})
}