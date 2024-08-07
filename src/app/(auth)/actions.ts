'use server'

import {lucia, validateRequest} from "@/auth";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export const signOut = async () => {
    const {session} = await validateRequest()

    if (!session) {
        throw new Error('Unauthorized request')
    }

    await lucia.invalidateSession(session.id)

    const sessionCookie = lucia.createBlankSessionCookie()

    cookies().set(sessionCookie.name, sessionCookie.value)

    return redirect('/signin')
}