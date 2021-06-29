import type { NextApiRequest, NextApiResponse } from 'next'
import { validateUser, getTokenByUser } from "../../lib/getUser"
import { LoginBody } from "../../lib/interfaces"

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const bodyString = req.body
    const body: LoginBody = JSON.parse(JSON.parse(JSON.stringify(bodyString)))

    console.log(body.username)

    if (!body.username || !body.password) {
        res.status(400).json({message: "The request failed"})
        return
    }

    const isUser = await validateUser(body.username, body.password)

    if (typeof isUser === "string") {
        res.status(404).json({message: isUser})
        return
    }

    if (!isUser) {
        res.status(401).json({message: "Incorrect username or password"})
        return
    }

    const token = await getTokenByUser(body.username)

    res.status(200).json({message: "ok", token: token})
}