export interface User {
    id: number,
    username: string,
    pass: string,
    email: string,
    token: string
}

export interface Wishlist {
    id: number,
    owner_id: number,
    title: string
}

export interface WishlistURLS {
    id: number,
    title: string
}

export interface Url {
    id: number,
    url: string
}