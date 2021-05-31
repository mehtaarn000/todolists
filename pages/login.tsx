import RegisterForm from "../components/RegisterForm"
import LoginForm from "../components/LoginForm"
import SwitchBetweenRegisterAndLogin from "../components/SwitchBetweenRegisterAndLogin"
import React from "react"

export default function App(props: { register?: number, error?: string }) {
    return (
        <LoginOrRegister error={props.error} register={props.register}></LoginOrRegister>
    )
}

function LoginOrRegister(props: { register?: number; error?: string }) {
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