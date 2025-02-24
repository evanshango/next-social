import {createUploadthing, FileRouter} from "uploadthing/next";
import {validateRequest} from "@/auth";
import {UploadThingError} from "@uploadthing/shared";
import prisma from "@/lib/prisma";
import {UTApi} from "uploadthing/server";

const f = createUploadthing()

export const fileRouter = {
    avatar: f({
        image: {maxFileSize: '512KB'}
    }).middleware(async () => {
        const {user} = await validateRequest()

        if (!user) throw new UploadThingError('Unauthorized request')

        return {user}
    }).onUploadComplete(async ({metadata, file}) => {
        const prevAvatarUrl = metadata.user.avatarUrl

        if (prevAvatarUrl) {
            const key = prevAvatarUrl.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1]

            await new UTApi().deleteFiles(key)
        }

        const newAvatarUrl = file.url.replace(
            '/f/', `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
        )

        await prisma.user.update({
            where: {id: metadata.user.id},
            data: {
                avatarUrl: newAvatarUrl
            }
        })
        return {avatarUrl: newAvatarUrl}
    })
} satisfies FileRouter

export type AppFileRouter = typeof fileRouter