import {validateRequest} from "@/auth";
import {NextRequest} from "next/server";
import prisma from "@/lib/prisma";
import {getPostDataInclude, IPostPage} from "@/lib/types";

export const GET = async (req: NextRequest) => {
    try {
        const pageSize = 10
        const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

        const {user} = await validateRequest()
        if (!user) {
            return Response.json({
                error: 'Unauthorized request'
            }, {
                status: 401,
            })
        }

        const posts = await prisma.post.findMany({
            where: {
                user: {
                    followers: {
                        some: {
                            followerId: user.id
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: pageSize + 1,
            cursor: cursor ? {id: cursor} : undefined,
            include: getPostDataInclude(user.id),
        })

        const nextCursor = posts.length > pageSize ? posts[pageSize].id : null

        const data: IPostPage = {
            posts: posts.slice(0, pageSize),
            nextCursor
        }
        return Response.json(data)
    } catch (err) {
        console.error(err);
        return Response.json({
            error: 'Internal Server Error',
        }, {
            status: 500
        });
    }
}