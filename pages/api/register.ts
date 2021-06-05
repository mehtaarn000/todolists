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
    const usernameRegex = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9_]+(?<![_.])$/
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (!username || !password || !email || !conpassword) {
        res.status(400).json({message: "The request failed"})
        return
    }

    if (password !== conpassword) {
        res.status(400).json({message: "Passwords don't match"})
        return
    }

    if (username.length > 20 || username.length < 8) {
        res.status(400).json({message: "Username length must be between 8 and 20 characters"})
        return 
    }

    if (email.length > 255) {
        res.status(400).json({message: "Email must be shorter than 255 characters"})
        return 
    }

    if (password.length > 60) {
        res.status(400).json({message: "Password must be shorter than 60 characters"})
        return 
    } 

    const testUsername = usernameRegex.test(username)

    if (!testUsername) {
        res.status(400).json({message: "Username can only contain numbers, underscores, and letters"})
        return 
    }

    const testEmail = emailRegex.test(email)

    if (!testEmail) {
        res.status(400).json({message: "Provide a valid email address"})
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