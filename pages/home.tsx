import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import React from "react"
import { FormProps } from "../lib/interfaces"
import Cookies from "js-cookie"

export default function App(props: { redirect: boolean }): JSX.Element {
    const router = useRouter()
    React.useEffect(() => {
        if (props.redirect) {
            Cookies.remove("token")
            router.push("/login")
            return
        }
    }, [])

    
    return (
        <div>
            <h1>Hello WorfflD!</h1>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context): Promise<{ props: FormProps }> => {
    const sendToken = context.req.cookies.token
    const token = await fetch("http://localhost:3000/api/user", {method: "post", body: JSON.stringify({token: sendToken})})
    const data = await token.json()

    if (!data.user || data.message) {
        return {
            props: {
                redirect: true,
            }
        }
    }
    
    return {
        props: {
            register: 0
        }
    }
}