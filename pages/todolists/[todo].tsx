import { useRouter } from "next/router"
import { GetServerSideProps } from 'next'
import React from "react"
import { TodolistsProps } from "../../lib/interfaces"
import { ClipLoader } from "react-spinners"
import TodoListItem from "../../components/TodolistItem"
import { Item } from "../../lib/sql_models"
import styles from "../../styles/WishlistPage.module.scss"

async function getUrls(todolist: string, token: string) {

    const getTodolists = await fetch("http://localhost:3000/api/todolists/" + todolist, {method: "post", body: JSON.stringify({token: token})})
    const data = await getTodolists.json()

    if (data.message === "Invalid data sent") {
        return {
            props: {
                redirect: true
            }
        }
    }

    if (getTodolists.status > 200) {
        return {
            props: {
                message: data.message
            }
        }
    } else {
        return {
            props: {
                todolists: data.todolists,
                todolist_id: todolist,
                token: token
            }
        }
    }
}

export default function App(props: {redirect?: boolean, message?: string, todolists?: [string, Item[]], token?: string, todolist_id?: string}): JSX.Element {
    const router = useRouter()
    
    const [message, setMessage] = React.useState(props.message)
    const [todolists, setTodolists] = React.useState(props.todolists?.[1])
    const [showInput, setShowInput] = React.useState(false)
    const [newItem, setNewItem] = React.useState("")
    const [formError, setFormError] = React.useState("")
 
    function filterTodolists(id: number) {
        setTodolists(
            todolists?.filter((list) => {
                return id !== list.id
            })
        )
    }

    async function deleteItem(id: number) {
        const res = await fetch("http://localhost:3000/api/todolists/delete", {method: "post", body: JSON.stringify({token: props.token, id: id})})

        if (res.status !== 200) {
            const json = await res.json()
            setMessage(json.message)
        } else {
            filterTodolists(id)
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

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setShowInput(false)
        
        const res = await fetch("http://localhost:3000/api/todolists/createItem", {method: "post", body: JSON.stringify({token: props.token, url: newItem, todolist_id: router.query.todo})})
        const json = await res.json()

        if (res.status > 201) {
            const message = json.message
            setFormError(message)
        } else {
            const newArray = [...todolists as Item[], json.todolists]
            setTodolists(newArray)
        }
    }

    if (message) {
        return <div>{message}</div>
    } else {
        return (
            <div>
                <h1>{formError}</h1>
                <div className={styles["new-wishlist-box"]}>
                    <button className={styles["new-url"]} onClick={() => {setShowInput(true)}}>
                        <p>+</p>{showInput ? <form onSubmit={handleSubmit}>
                            <input onChange={((e) => setNewItem(e.target.value))}></input>
                        </form> : null}
                    </button>
                </div>
                <h1>{props.todolists?.[0]}</h1>
                {todolists?.map((item, index) => {
                    return <TodoListItem key={index} url={item} deletion={deleteItem}></TodoListItem>
                })}
            </div>
        )
    }
}

export const getServerSideProps: GetServerSideProps = async (context): Promise<TodolistsProps> => {
    const todo = context.query.todo
    const sendToken = context.req.cookies.token

    const urls = await getUrls(todo as string, sendToken)
    return urls
}
