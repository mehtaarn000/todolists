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