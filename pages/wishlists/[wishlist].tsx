import { useRouter } from "next/router"
import { GetServerSideProps } from 'next'
import React from "react"
import { WishlistsProps } from "../../lib/interfaces"
import { ClipLoader } from "react-spinners"
import WishlistItem from "../../components/WishlistItem"
import { Url } from "../../lib/sql_models"

async function getUrls(wishlist: string, token: string) {
    const getWishlists = await fetch("http://localhost:3000/api/wishlists/" + wishlist, {method: "post", body: JSON.stringify({token: token})})
    const data = await getWishlists.json()

    if (data.message === "Invalid data sent") {
        return {
            props: {
                redirect: true
            }
        }
    }

    if (getWishlists.status > 200) {
        return {
            props: {
                message: data.message
            }
        }
    } else {
        return {
            props: {
                wishlists: data.wishlist,
                wishlist_id: wishlist,
                token: token
            }
        }
    }
}

export default function App(props: {redirect?: boolean, message?: string, wishlists?: [string, Url[]], token?: string, wishlist_id?: string}): JSX.Element {
    const router = useRouter()
    const [message, setMessage] = React.useState(props.message)
    const [wishlists, setWishlists] = React.useState(props.wishlists?.[1])

    function filterWishlist(id: number) {
        setWishlists(
            wishlists?.filter((list) => {
                return id !== list.id
            })
        )
    }

    async function deleteUrl(id: number) {
        const res = await fetch("http://localhost:3000/api/wishlists/delete", {method: "post", body: JSON.stringify({token: props.token, id: id})})

        if (res.status !== 200) {
            const json = await res.json()
            setMessage(json.message)
        } else {
            filterWishlist(id)
        }
    }

    React.useEffect(() => {
        if (props.redirect) {
            router.push("/login")
        }
    }, [])

    if (props.redirect) {
        return <ClipLoader></ClipLoader>
    }

    if (message) {
        return <div>{message}</div>
    } else {
        return <div >
            <h1>{props.wishlists?.[0]}</h1>
            {wishlists?.map((item, index) => {
                return <WishlistItem key={index} url={item} deletion={deleteUrl}></WishlistItem>
            })}
        </div>
    }
}

export const getServerSideProps: GetServerSideProps = async (context): Promise<WishlistsProps> => {
    const wishlist = context.query.wishlist
    const sendToken = context.req.cookies.token

    const urls = getUrls(wishlist as string, sendToken)
    return urls
}
