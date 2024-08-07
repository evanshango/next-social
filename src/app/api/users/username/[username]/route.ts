import {validateRequest} from "@/auth";
import prisma from "@/lib/prisma";
import {getUserDataSelect} from "@/lib/types";

export const GET = async (req: Request, {params: {username}}: { params: { username: string } }) => {
    try {
        const {user: loggedInUser} = await validateRequest()
        if (!loggedInUser) {
            return Response.json({
                error: 'Unauthorized request'
            }, {
                status: 401,
            })
        }

        const user = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: 'insensitive'
                }
            },
            select: getUserDataSelect(loggedInUser.id)
        })

        if (!user) {
            return Response.json({
                error: 'User not found'
            }, {
                status: 404,
            })
        }

        return Response.json(user)
    } catch (err) {
        console.error(err);
        return Response.json({
            error: 'Internal Server Error',
        }, {
            status: 500
        });
    }
}