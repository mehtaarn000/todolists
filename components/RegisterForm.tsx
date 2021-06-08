import { useState, useRef } from "react"
import React from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/router"

export default function RegisterForm(props: { error: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined }): JSX.Element {

    const [password, setPassword] = useState("")
    const [equal, setEqual] = useState("")
    const [conpassword, setConPassword] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const inputRef = useRef<HTMLInputElement | null>(null)
    const router = useRouter()
    const usernameRegex = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9_]+(?<![_.])$/
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    async function isEqual(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!username || !password || !conpassword || !email) {
            setEqual("All fields must be filled")
            return false
        }

        if (password !== conpassword) {
            setEqual("Passwords don't match")
            setConPassword("")
            if (inputRef.current != null) {inputRef.current.value = ""}
            return false
        }

        if (username.length > 20 || username.length < 8) {
            setEqual("Username length must be between 8 and 20 characters")
            return false
        }

        if (email.length > 255) {
            setEqual("Email must be shorter than 255 characters")
            return false
        }

        if (password.length > 60) {
            setEqual("Password must be shorter than 60 characters")
            return false
        } 

        const testUsername = usernameRegex.test(username)

        if (!testUsername) {
            setEqual("Username can only contain numbers, underscores, and letters")
            return false
        }

        const testEmail = emailRegex.test(email)

        if (!testEmail) {
            setEqual("Provide a valid email address")
            return false
        }

        const res = await fetch(
            "/api/register",
            {
                body: JSON.stringify({
                    username: username,
                    password: password,
                    conpassword: conpassword,
                    email: email
                }),

                method: "POST"
            }
        )

        const data = await res.json()
        if (data.message) {
            setEqual(data.message)
            return
        }

        Cookies.set("token", data.token)
        router.push("/home")
        
    }


    return (
        <div>
            <div>
                <h1>{props.error}</h1>
            </div>
            <div>
                <h1>{equal}</h1>
            </div>
            <form method="post" action="/api/register" onSubmit={(e) => {isEqual(e)}}>
                <input name="username" type="username" onChange={(event) => {setUsername(event?.target?.value)}}></input>
                <input name="password" type="password" onChange={(event) => {setPassword(event?.target?.value)}}></input>
                <input name="confirmpassword" type="password" onChange={(event) => {setConPassword(event?.target?.value)}} ref={inputRef}></input>
                <input name="email" type="email" onChange={(event) => {setEmail(event?.target?.value)}}></input>
                <input type="submit"></input>
            </form> 
        </div>
    )
}
