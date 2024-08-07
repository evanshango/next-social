'use client'

import React from 'react';
import {useInfiniteQuery} from "@tanstack/react-query";
import {IPostPage} from "@/lib/types";
import {Loader2} from "lucide-react";
import Post from "@/components/posts/Post";
import kyInstance from "@/lib/ky";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";

interface IUserPostFeed {
    userId: string
}

const UserPostFeed = ({userId}: IUserPostFeed) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        status
    } = useInfiniteQuery({
        queryKey: ['post-feed', 'user-posts', userId],
        queryFn: ({pageParam}) => kyInstance.get(
            `/api/users/${userId}/posts`,
            pageParam ? {searchParams: {cursor: pageParam}} : {}
        ).json<IPostPage>(),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage: IPostPage) => lastPage.nextCursor
    })

    const posts = data?.pages.flatMap(page => page.posts) || []

    if (status === 'pending') {
        return (
            <PostsLoadingSkeleton/>
        );
    }

    if (status === 'success' && !posts.length && !hasNextPage) {
        return (
            <p className={'text-center text-muted-foreground'}>
                This user hasn&apos;t posted anything yet
            </p>
        )
    }

    if (status === 'error') {
        return (
            <p className={'text-center text-destructive'}>
                An error occurred while loading posts
            </p>
        )
    }

    return (
        <InfiniteScrollContainer
            className={'space-y-3'}
            onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
        >
            {posts.map(post => (
                <Post key={post.id} post={post}/>
            ))}
            {isFetching && <Loader2 className="mx-auto my-3 animate-spin"/>}
        </InfiniteScrollContainer>
    );
};

export default UserPostFeed;