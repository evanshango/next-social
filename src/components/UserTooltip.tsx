'use client'

import {PropsWithChildren} from "react";
import {IFollowerInfo, UserData} from "@/lib/types";
import {useSession} from "@/app/(main)/SessionProvider";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import FollowButton from "@/components/FollowButton";
import Linkify from "@/components/Linkify";
import FollowerCount from "@/components/FollowerCount";

interface IUserTooltipProps extends PropsWithChildren {
    user: UserData
}

const UserTooltip = ({user, children}: IUserTooltipProps) => {
    const {user: loggedInUser} = useSession()
    const followerState: IFollowerInfo = {
        followers: user._count.followers,
        isFollowedByUser: user.followers.some(({followerId}) => followerId === loggedInUser.id)
    }
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    <div className='flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52'>
                        <div className='flex items-center gap-2 justify-between'>
                            <Link href={`/users/${user.username}`}>
                                <UserAvatar size={70} avatarUrl={user.avatarUrl}/>
                            </Link>
                            {loggedInUser.id !== user.id && (
                                <FollowButton userId={user.id} initialState={followerState}/>
                            )}
                        </div>
                        <div>
                            <Link href={`/users/${user.username}`}>
                                <div className='text-lg font-semibold hover:underline'>
                                    {user.displayName}
                                </div>
                                <div className='text-muted-foreground'>
                                    @{user.username}
                                </div>
                            </Link>
                        </div>
                        {user.bio && (
                            <Linkify>
                                <div className='line-clamp-4 whitespace-pre-line'>
                                    {user.bio}
                                </div>
                            </Linkify>
                        )}
                        <FollowerCount userId={user.id} initialState={followerState}/>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default UserTooltip