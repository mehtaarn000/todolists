import React from "react";
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'


interface FormProps {
    error?: string
}

export default function Hello(props: FormProps): JSX.Element {
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [error, setError] = React.useState(props.error)
    const router = useRouter()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        setUsername("")
        setPassword("")
        event.preventDefault()
        const res = await fetch(
            "/api/login",
            {
                body: JSON.stringify({
                    username: username,
                    password: password
                }),

                method: "POST"
            }
        )

        const data = await res.json()
        if (data.message !== "ok") {
            setError(data.message)
            return
        }

        Cookies.set("token", data.token)
        router.push("/home")
    }

    return (
        <div>
            <div>
                <h1>{error}</h1>
            </div>
            <div>
                <form onSubmit={(event) => onSubmit(event)}>
                    <input name="username" type="username" value={username} onChange={(event) => setUsername(event.target.value)} required></input>
                    <input name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required></input>
                    <input type="submit"></input>
                </form>
            </div>
        </div>
    )
}