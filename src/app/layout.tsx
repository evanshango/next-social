import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from "react";
import dynamic from "next/dynamic";
import {Toaster} from "@/components/ui/toaster";
import ClientOnly from "@/app/ClientOnly";
import {ReactQueryProvider} from "@/app/ReactQueryProvider";
import {NextSSRPlugin} from "@uploadthing/react/next-ssr-plugin";
import {extractRouterConfig} from "uploadthing/server";
import {fileRouter} from "@/app/api/uploadthing/core";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
});

const ThemeProvider = dynamic(() =>
    import('next-themes').then((mod) => mod.ThemeProvider), {
    ssr: false,
})

export const metadata: Metadata = {
    title: {
        template: '%s | bugbook',
        default: 'bugbook',
    },
    description: "The Social Media App for PowerNerds"
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)}/>
        <ReactQueryProvider>
            <ClientOnly>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
                <Toaster/>
            </ClientOnly>
        </ReactQueryProvider>
        </body>
        </html>
    );
}
