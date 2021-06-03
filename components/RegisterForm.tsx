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

    async function isEqual(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (password !== conpassword) {
            setEqual("Passwords don't match")
            setConPassword("")
            if (inputRef.current != null) {inputRef.current.value = ""}
        }

        if (!username) {
            setEqual("Username field must be filled")
            return false
        }
        
        else {
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
                <button type="submit"></button>
            </form> 
        </div>
    )
}
