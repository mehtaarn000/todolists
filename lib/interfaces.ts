import { Todolist } from "./sql_models"

export interface FormProps {
    register?: number,
    error?: string,
    redirect?: boolean
}

export interface RegisterBody {
    username: string,
    password: string,
    conpassword: string,
    email: string
}

export interface LoginBody {
    username: string,
    password: string
}

export interface TodolistsProps {
    props: {
        redirect?: boolean,
        message?: string,
        todolists?: Todolist[],
        token?: string
    }
}
