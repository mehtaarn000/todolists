import React from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/router"

export default function AuthCheck(props: {children: any}) {
    const router = useRouter()
    React.useEffect(() => {
        async function checkToken() {
            const token = Cookies.get("token")
            if (!token) {
                if (router.basePath === "/login") {
                    return
                }

                router.push("/login")
                return
            }

            const user = await fetch("/api/user")
            const jsonData = await user.json()
            if (!jsonData.user) {
                Cookies.remove("token")
                router.push("/login")
                return
            }
            
            if (router.basePath === "/home") {
                return
            } else {
                router.push("/home")
            }
        }

        checkToken()
    }, [])

    return props.children
}