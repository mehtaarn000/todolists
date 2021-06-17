import React from "react"

export default function NewWishlistForm(props: {token: string, setSuccess: () => void, refetchData: () => void}): JSX.Element {
    const [ title, setTitle ] = React.useState("")
    const [ error, setError ] = React.useState("")

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const body = {title: title, token: props.token}
        const res = await fetch("/api/wishlists/create", {method: "post", body: JSON.stringify(body)})

        if (res.status >= 400) {
            const jsonData = await res.json()
            setError(jsonData.message)
        } else {
            props.setSuccess()
            props.refetchData()
        }
        
    }

    return (
        <div>
            <h1>
                {error}
            </h1>
            <form onSubmit={onSubmit}>
                <input type="text" onChange={e => setTitle(e.target.value)}></input>
            </form>
        </div>
    )
}