import React, {cache} from 'react';
import prisma from "@/lib/prisma";
import {getUserDataSelect, IFollowerInfo, UserData} from "@/lib/types";
import {notFound} from "next/navigation";
import {validateRequest} from "@/auth";
import {Metadata} from "next";
import TrendsSidebar from "@/components/TrendsSidebar";
import UserAvatar from "@/components/UserAvatar";
import {formatDate} from "date-fns";
import {formatNumber} from "@/lib/utils";
import FollowerCount from "@/components/FollowerCount";
import FollowButton from "@/components/FollowButton";
import UserPostFeed from "@/app/(main)/users/[username]/UserPostFeed";
import Linkify from "@/components/Linkify";
import EditProfileButton from "@/app/(main)/users/[username]/EditProfileButton";

interface IPageProps {
    params: { username: string }
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
    const user = await prisma.user.findFirst({
        where: {
            username: {
                equals: username,
                mode: 'insensitive'
            }
        },
        select: getUserDataSelect(loggedInUserId)
    });

    if (!user) notFound()

    return user;
})

export const generateMetadata = async ({params: {username}}: IPageProps): Promise<Metadata> => {
    const {user: loggedInUser} = await validateRequest()

    if (!loggedInUser) return {}

    const user = await getUser(username, loggedInUser.id)

    return {
        title: `${user.displayName} (@${user.username})`
    }
}

const Page = async ({params: {username}}: IPageProps) => {
    const {user: loggedInUser} = await validateRequest()

    if (!loggedInUser) {
        return (
            <p className='text-destructive'>
                You&apos;re not authorized to view this page
            </p>
        )
    }

    const user = await getUser(username, loggedInUser.id)

    const displayName = user.displayName.endsWith('s') ? `${user.displayName}'` : `${user.displayName}'s`

    return (
        <main className='flex w-full min-w-0 gap-5'>
            <div className="w-full min-w-0 space-y-5">
                <UserProfile user={user} loggedInUserId={loggedInUser.id}/>
                <div className="rounded-2xl bg-card p-5 shadow-sm">
                    <h2 className="text-center text-2xl font-bold">
                        {displayName} posts
                    </h2>
                </div>
                <UserPostFeed userId={user.id}/>
            </div>
            <TrendsSidebar/>
        </main>
    );
};

export default Page;

interface IUserProfileProps {
    user: UserData,
    loggedInUserId: string
}

const UserProfile = async ({user, loggedInUserId}: IUserProfileProps) => {
    const followerInfo: IFollowerInfo = {
        followers: user._count.followers,
        isFollowedByUser: user.followers.some(({followerId}) => followerId === loggedInUserId)
    }

    return (
        <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
            <UserAvatar
                className='mx-auto size-full max-h-60 max-w-60 rounded-full'
                avatarUrl={user.avatarUrl}
                size={250}
            />
            <div className="flex flex-wrap gap-3 sm:flex-nowrap">
                <div className="me-auto space-y-3">
                    <div>
                        <h1 className="text-3xl font-bold">
                            {user.displayName}
                        </h1>
                        <div className='text-muted-foreground'>
                            @{user.username}
                        </div>
                    </div>
                    <div>Member since {formatDate(user.createdAt, 'MMM d, yyyy')}</div>
                    <div className="flex items-center gap-3">
                        <span>
                            Posts:{" "}
                            <span className='font-semibold'>
                                {formatNumber(user._count.posts)}
                            </span>
                        </span>
                        <FollowerCount userId={user.id} initialState={followerInfo}/>
                    </div>
                </div>
                {user.id === loggedInUserId ? (
                    <EditProfileButton user={user}/>
                ) : (
                    <FollowButton userId={user.id} initialState={followerInfo}/>
                )}
            </div>
            {user.bio && (
                <>
                    <hr/>
                    <Linkify>
                        <div className="whitespace-pre-line overflow-hidden break-words">
                            {user.bio}
                        </div>
                    </Linkify>
                </>
            )}
        </div>
    )
}