import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import React from "react"
import { Wishlist } from "../../lib/sql_models"

export default function App(props: {redirect?: boolean, message?: string, wishlists?: Wishlist[]}) {
    const router = useRouter()

    React.useEffect(() => {
        if (props.redirect) {
            router.push("/login")
        }
    }, [])

    if (props.message) {
        return <div>{props.message}</div>
    } else {
        return <div>
            <pre>{JSON.stringify(props.wishlists)}</pre>
        </div>
    }
}

export const getServerSideProps: GetServerSideProps = async (context): Promise<any> => {
    const sendToken = context.req.cookies.token
    const token = await fetch("http://localhost:3000/api/wishlists", {method: "post", body: JSON.stringify({token: sendToken})})
    const data = await token.json()

    if (data.message === "Invalid data sent") {
        return {
            props: {
                redirect: true
            }
        }
    }

    if (token.status > 200) {
        return {
            props: {
                message: data.message
            }
        }
    } else {
        return {
            props: {
                wishlists: data.wishlists
            }
        }
    }
}