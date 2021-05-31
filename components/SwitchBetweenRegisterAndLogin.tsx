import React from "react"

export default function SwitchBetweenRegisterAndLoginA(props: {register: number, switchToRegister?: React.MouseEventHandler<HTMLButtonElement> | undefined, switchToLogin?: React.MouseEventHandler<HTMLButtonElement> | undefined}): JSX.Element {
    if (props.register) {
        return <button onClick={props.switchToLogin}>Login</button>
    } 

    return <button onClick={props.switchToRegister}>Register</button>
}