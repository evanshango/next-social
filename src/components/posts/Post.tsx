'use client'

import React from 'react';
import {PostData} from "@/lib/types";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import {formatRelativeDate} from "@/lib/utils";
import {useSession} from "@/app/(main)/SessionProvider";
import PostMoreButton from "@/components/posts/PostMoreButton";
import Linkify from "@/components/Linkify";
import UserTooltip from "@/components/UserTooltip";

interface IPostProps {
    post: PostData
}

const Post = ({post}: IPostProps) => {
    const {user} = useSession()

    return (
        <article className='group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm'>
            <div className="flex justify-between gap-3">
                <div className="flex flex-wrap gap-3">
                    <UserTooltip user={post.user}>
                        <Link href={`/users/${post.user.username}`}>
                            <UserAvatar avatarUrl={post.user.avatarUrl}/>
                        </Link>
                    </UserTooltip>
                    <div>
                        <UserTooltip user={post.user}>
                            <Link href={`/users/${post.user.username}`} className='block font-medium hover:underline'>
                                {post.user.displayName}
                            </Link>
                        </UserTooltip>
                        <Link href={`/posts/${post.id}`}
                              className='block text-sm text-muted-foreground hover:underline'>
                            {formatRelativeDate(post.createdAt)}
                        </Link>
                    </div>
                </div>
                {post.user.id === user.id && (
                    <PostMoreButton post={post} className='opacity-0 transition-opacity group-hover/post:opacity-100'/>
                )}
            </div>
            <Linkify>
                <div className="whitespace-pre-line break-word">
                    {post.content}
                </div>
            </Linkify>
        </article>
    );
};

export default Post;