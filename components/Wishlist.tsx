import { Wishlist } from "../lib/sql_models";
import React from "react";

export default function WishlistJSX(props: {wishlists: Wishlist}): JSX.Element {
    return (
        <div style={{height: "100px", width: "100px", borderColor: "violet"}}>
            <p>{props.wishlists.id}</p>
            <p>{props.wishlists.title}</p>
        </div>
    )
}

