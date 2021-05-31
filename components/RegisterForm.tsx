import { useState, useRef } from "react"
import React from "react"

export default function RegisterForm(props: { error: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined }): JSX.Element {

    const [password, setPassword] = useState("")
    const [equal, setEqual] = useState("")
    const [conpassword, setConPassword] = useState("")
    const [username, setUsername] = useState("")
    const inputRef = useRef<HTMLInputElement | null>(null)

    function isEqual(e: React.FormEvent<HTMLFormElement>) {
        if (password !== conpassword) {
            e.preventDefault()
            setEqual("Passwords don't match")
            setConPassword("")
            if (inputRef.current != null) {inputRef.current.value = ""}
        }

        if (!username) {
            e.preventDefault()
            setEqual("Username field must be filled")
            return false
        }
        
        else {
            return true
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
                <button type="submit"></button>
            </form> 
        </div>
    )
}
