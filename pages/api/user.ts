import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserByToken } from "../../lib/getUser"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = req.cookies
    const token = cookies.token

    const user = await getUserByToken(token)
    if (!user) {
        res.json({user: null})
        return
    }

    res.json({user: user})
}