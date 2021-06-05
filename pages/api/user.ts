import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from "../../lib/getUser"
import { User } from "../../lib/sql_models"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const bodyString = req.body
    const body = JSON.parse(bodyString)
    const token = body.token
    
    if (!token) {
        res.status(400).json({message: "The request failed"})
    }

    const user = await getUser("token", token)
    if (!user) {
        res.status(404).json({user: null})
        return
    }

    if (typeof user === "string") {
        res.status(500).json({user: user})
        return
    }

    const userObj = user as User
    res.status(200).json({user: userObj.username})
}