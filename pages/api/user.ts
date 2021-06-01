import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from "../../lib/getUser"
import { User } from "../../lib/sql_models"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = req.cookies
    const token = cookies.token

    const user = await getUser("token", token)
    if (!user) {
        res.json({user: null})
        return
    }

    if (typeof user === "string") {
        res.json({user: user})
        return
    }

    const userObj = user as User
    res.json({user: userObj.username})
}