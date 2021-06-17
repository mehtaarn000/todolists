import { WishlistURLS } from "../lib/sql_models";
import React from "react";

export default function WishlistJSX(props: {wishlists: WishlistURLS}): JSX.Element {
    return (
        <div style={{height: "100px", width: "100px", borderColor: "violet"}}>
            <p>{props.wishlists.url}</p>
            <p>{props.wishlists.title}</p>
        </div>
    )
}

