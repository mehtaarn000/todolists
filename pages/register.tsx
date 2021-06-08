import { GetServerSideProps } from "next";
import { FormProps } from "../lib/interfaces";
import App from "./login"

export default App;

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
            register: 1
        }
    }
}