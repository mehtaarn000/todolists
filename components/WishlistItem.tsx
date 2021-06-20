import React from "react";
import styles from "../styles/WishlistItem.module.scss"
import { Url } from "../lib/sql_models";

export default function WishlistItem(props: Url): JSX.Element {
    return (
        <div className={styles.parent}>
            {props.url}
            <div style={{float:"right"}}>
                <button ></button>
            </div>
        </div>
    )
}