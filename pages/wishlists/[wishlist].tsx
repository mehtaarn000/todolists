import { useRouter } from "next/router"
import { GetServerSideProps } from 'next'
import React from "react"
import { WishlistsProps } from "../../lib/interfaces"

export default function App(props: {redirect?: boolean, message?: string, wishlists?: [string, Array<{url: string}>]}): JSX.Element {
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
            <p>{props.wishlists?.[0]}</p>
            <p>{JSON.stringify(props.wishlists?.[1])}</p>
        </div>
    }
}

export const getServerSideProps: GetServerSideProps = async (context): Promise<WishlistsProps> => {
    const wishlist = context.query.wishlist
    const sendToken = context.req.cookies.token
    const token = await fetch("http://localhost:3000/api/wishlists/" + wishlist, {method: "post", body: JSON.stringify({token: sendToken})})
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
                wishlists: data.wishlist
            }
        }
    }
}
