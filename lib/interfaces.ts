import { Wishlist } from "./sql_models"

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

export interface WishlistsProps {
    props: {
        redirect?: boolean,
        message?: string,
        wishlists?: Wishlist[],
        token?: string
    }
}
