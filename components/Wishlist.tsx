import Link from 'next/link'
import { WishlistURLS } from "../lib/sql_models";
import React from "react";

export default function WishlistJSX(props: WishlistURLS): JSX.Element {
    return (
        <div style={{height: "100px", width: "100px", borderColor: "violet"}}>
            <Link href={"/wishlists/" + props.id}><a>{props.title}</a></Link>
        </div>
    )
}