import { GetStaticPaths, GetStaticProps } from "next";
import { getFriends } from "../../lib/getFriends";

export default function App(props: {friends: Array<{username: number}> | string}) {
    if (typeof props.friends === "string") {
        return <h1>{props.friends}</h1>
    }

    return <div>
        {props.friends.map((value, index) => {
            return <h3 key={index}>{value.username}</h3>
        })}
    </div>
    
}

// Placeholder for now
export const getStaticPaths: GetStaticPaths = async () => {
    return {paths: [{params: {profile: "newuser"}}], fallback: false}
}

export const getStaticProps: GetStaticProps = async (context): Promise<{props: {friends: Array<{username: string}> | string}}> => {
    const profile = context.params?.profile
    const friends = await getFriends(profile as string)

    return {
        props: {
            friends: JSON.parse(JSON.stringify(friends))
        }
    }
    
}