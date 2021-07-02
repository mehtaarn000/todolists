import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import React from "react"
import { TodolistsItems } from "../../lib/sql_models"
import type { TodolistsProps } from "../../lib/interfaces"
import NewTodolistForm from "../../components/NewTodolistForm"
import TodolistJSX from "../../components/Todolist"
import { ClipLoader } from "react-spinners"

export default function App(props: {redirect?: boolean, message?: string, todolists?: TodolistsItems[], token: string}): JSX.Element {
    const router = useRouter()
    const [ display, showDisplay ] = React.useState(false)
    const [ jsonData, setJsonData ] = React.useState(props.todolists)

    React.useEffect(() => {
        if (props.redirect) {
            router.push("/login")
        }
    }, [])

    async function refetchData() {
        const token = await fetch("http://localhost:3000/api/todolists", {method: "post", body: JSON.stringify({token: props.token})})
        const data = await token.json()

        setJsonData(data.todolists)
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
                <button onClick={() => showDisplay(false)}>Create new todolist</button>
                <NewTodolistForm token={props.token} setSuccess={() => showDisplay(false)} refetchData={refetchData}></NewTodolistForm>
                <div>
                    {jsonData?.map((todolist, index) => {
                        return <TodolistJSX key={index} id={todolist.id} title={todolist.title}></TodolistJSX>
                    })}
                </div>
            </div>
        )
    } else {
        return <div>
            <button onClick={() => showDisplay(true)}>Create new todolist</button>
            <div>
                {jsonData?.map((todolist, index) => {
                    return <TodolistJSX key={index} id={todolist.id} title={todolist.title}></TodolistJSX>
                })}
            </div>
        </div>
    }
}

export const getServerSideProps: GetServerSideProps = async (context): Promise<TodolistsProps> => {
    const sendToken = context.req.cookies.token
    const token = await fetch("http://localhost:3000/api/todolists", {method: "post", body: JSON.stringify({token: sendToken})})
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
                todolists: data.todolists
            }
        }
    }
}