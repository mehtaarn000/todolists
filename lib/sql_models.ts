export interface User {
    id: number,
    username: string,
    pass: string,
    email: string,
    token: string
}

export interface Todolist {
    id: number,
    owner_id: number,
    title: string
}

export interface TodolistsItems {
    id: number,
    title: string
}

export interface Item {
    id: number,
    url: string
}