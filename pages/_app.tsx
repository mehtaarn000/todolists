import type { AppProps } from 'next/app'
import AuthCheck from "../components/AuthCheck"
import React from 'react'

export default function MyApp({ Component, pageProps }: AppProps) {
    return  (
        <AuthCheck>
            <Component {...pageProps} />
        </AuthCheck>
    )
}