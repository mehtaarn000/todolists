import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import React from "react"
import { WishlistURLS } from "../../lib/sql_models"
import type { WishlistsProps } from "../../lib/interfaces"
import NewWishlistForm from "../../components/NewWishlistForm"
import WishlistJSX from "../../components/Wishlist"
import { ClipLoader } from "react-spinners"

export default function App(props: {redirect?: boolean, message?: string, wishlists?: WishlistURLS[], token: string}): JSX.Element {
    const router = useRouter()
    const [ display, showDisplay ] = React.useState(false)
    const [ jsonData, setJsonData ] = React.useState(props.wishlists)

    React.useEffect(() => {
        if (props.redirect) {
            router.push("/login")
        }
    }, [])

    async function refetchData() {
        const token = await fetch("http://localhost:3000/api/wishlists", {method: "post", body: JSON.stringify({token: props.token})})
        const data = await token.json()

        setJsonData(data.wishlists)
    }

    if (props.redirect) {
        return <ClipLoader></ClipLoader>
    }

    if (props.message) {
        return <div>{props.message}</div>
    } 

    if (display) {
        return (
            <div>
                <button onClick={() => showDisplay(false)}></button>
                <NewWishlistForm token={props.token} setSuccess={() => showDisplay(false)} refetchData={refetchData}></NewWishlistForm>
                <div>
                    {jsonData?.map((wishlist, index) => {
                        return <WishlistJSX key={index} wishlists={wishlist}></WishlistJSX>
                    })}
                </div>
            </div>
        )
    } else {
        return <div>
            <button onClick={() => showDisplay(true)}></button>
            <div>
                {jsonData?.map((wishlist, index) => {
                    return <WishlistJSX key={index} wishlists={wishlist}></WishlistJSX>
                })}
            </div>
        </div>
    }
}

export const getServerSideProps: GetServerSideProps = async (context): Promise<WishlistsProps> => {
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
                token: sendToken,
                wishlists: data.wishlists
            }
        }
    }
}