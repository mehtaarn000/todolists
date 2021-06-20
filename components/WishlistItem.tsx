import React from "react";
import styles from "../styles/WishlistItem.module.scss"

export default function WishlistItem(props: {url: string}): JSX.Element {
    return (
        <div className={styles.parent}>
            {props.url}
            <div style={{float:"right"}}>
                <button onClick={}></button>
            </div>
        </div>
    )
}