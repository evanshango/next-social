import {validateRequest} from "@/auth";
import {redirect} from "next/navigation";
import React, {ReactNode} from "react";

export default async function Layout({children}: Readonly<{ children: ReactNode; }>) {
    const {user} = await validateRequest()
    if (user) redirect('/')
    return (
        <>
            {children}
        </>
    );
}