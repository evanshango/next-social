'use server'

import {validateRequest} from "@/auth";
import prisma from "@/lib/prisma";
import {getPostDataInclude} from "@/lib/types";

export const deletePost = async (postId: string) => {
    const {user} = await validateRequest()
    if (!user) throw new Error('Unauthorized request')

    const post = await prisma.post.findUnique({
        where: {id: postId}
    })

    if (!post) throw Error('Post not found')

    if (post.userId !== user.id) throw Error('Unauthorized request')

    return prisma.post.delete({
        where: {id: postId,},
        include: getPostDataInclude(user.id)
    })
}