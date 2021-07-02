import React from "react";
import styles from "../styles/WishlistItem.module.scss"
import { Item } from "../lib/sql_models";

interface UrlDeletion {
    url: Item,
    deletion: (id: number) => Promise<void>
}

export default function TodolistItem(props: UrlDeletion): JSX.Element {
    return (
        <div className={styles.parent}>
            {props.url.url}
            <div style={{float:"right"}}>
                <button onClick={() => props.deletion(props.url.id)}></button>
            </div>
        </div>
    )
}