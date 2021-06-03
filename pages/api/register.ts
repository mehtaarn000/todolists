import type { NextApiRequest, NextApiResponse } from 'next'
import { createUser } from "../../lib/createUser"

interface Body {
    username: string,
    password: string,
    conpassword: string,
    email: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const bodyString = req.body
    const body: Body = JSON.parse(bodyString)
    const { username, password, email, conpassword } = body

    if (!username || !password || !email || !conpassword) {
        res.status(400).json({message: "The request failed"})
        return
    }

    if (password !== conpassword) {
        res.status(400).json({message: "Passwords don't match"})
        return
    }

    const user = await createUser(username, password, email)

    if (user.substring(0, 5) === "token") {
        res.status(200).json({token: user.substring(6)})
        return
    }

    if (user.substring(0, 8) === "username" || user.substring(0, 5) === "email") {
        res.status(409).json({message: user + " already taken"})
    } else {
        res.status(500).json({message: user})
    }
}