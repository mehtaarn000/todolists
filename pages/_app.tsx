import Cookies from 'js-cookie'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React from 'react'

export default function MyApp({ Component, pageProps }: AppProps) {

    const router = useRouter()
    React.useEffect(() => {
        async function checkToken() {
            const token = Cookies.get("token")
            if (!token) {
                if (router.basePath === "/login") {
                    return
                }

                router.push("/login")
            }

            const user = await fetch("/api/user")
            const jsonData = await user.json()

            if (!jsonData.user) {
                Cookies.remove("token")
                router.push("/login")
                return
            }

            router.push("/home")
        }

        checkToken()
    }, [])

    return  (
        <Component {...pageProps} />
    )
}