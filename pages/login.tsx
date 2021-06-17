import RegisterForm from "../components/RegisterForm"
import LoginForm from "../components/LoginForm"
import SwitchBetweenRegisterAndLogin from "../components/SwitchBetweenRegisterAndLogin"
import React from "react"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { FormProps } from "../lib/interfaces"
import Cookies from "js-cookie"
import { ClipLoader } from "react-spinners"

export default function App(props: { redirect?: boolean, register?: number, error?: string }): JSX.Element {
    const router = useRouter()
    React.useEffect(() => {
        if (props.redirect) {
            router.push("/home")
            return
        }
    }, [])

    if (props.redirect) {
        return <ClipLoader color="blue"/>
    } else {
        Cookies.remove("token")
        return <LoginOrRegister error={props.error} register={props.register}></LoginOrRegister>
    }
}

function LoginOrRegister(props: { register?: number; error?: string }): JSX.Element {
    const [register, setRegister] = React.useState(props.register)

    if (register) {
        return (
            <div>
                <SwitchBetweenRegisterAndLogin switchToLogin={() => setRegister(0)} register={1}></SwitchBetweenRegisterAndLogin>
                <RegisterForm error={props.error}></RegisterForm>
            </div>
        )
    } else {
        return (
            <div>
                <SwitchBetweenRegisterAndLogin switchToRegister={() => setRegister(1)} register={0}></SwitchBetweenRegisterAndLogin>
                <LoginForm error={props.error}></LoginForm>
            </div>
        )
    }
}


export const getServerSideProps: GetServerSideProps = async (context): Promise<{ props: FormProps }> => {
    const sendToken = context.req.cookies.token
    const token = await fetch("http://localhost:3000/api/user", {method: "post", body: JSON.stringify({token: sendToken})})
    const data = await token.json()

    if (data.user) {
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