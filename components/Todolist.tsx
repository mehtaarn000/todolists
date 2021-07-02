import Link from 'next/link'
import { TodolistsItems } from "../lib/sql_models";
import React from "react";

export default function TodolistJSX(props: TodolistsItems): JSX.Element {
    return (
        <div style={{height: "100px", width: "100px", borderColor: "violet"}}>
            <Link href={"/todolists/" + props.id}><a>{props.title}</a></Link>
        </div>
    )
}