'use client'

import React from 'react';
import {IFollowerInfo} from "@/lib/types";
import {useFollowerInfo} from "@/hooks/useFollowerInfo";
import {useToast} from "@/components/ui/use-toast";
import {QueryKey, useMutation, useQueryClient} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";
import kyInstance from "@/lib/ky";

interface IFollowButtonProps {
    userId: string
    initialState: IFollowerInfo
}

const FollowButton = ({userId, initialState}: IFollowButtonProps) => {
    const {toast} = useToast();
    const queryClient = useQueryClient();
    const queryKey: QueryKey = ['follower-info', userId]
    const {data} = useFollowerInfo(userId, initialState);

    const {mutate} = useMutation({
        mutationFn: () => data.isFollowedByUser
            ? kyInstance.delete(`/api/users/${userId}/followers`)
            : kyInstance.post(`/api/users/${userId}/followers`),
        onMutate: async () => {
            await queryClient.cancelQueries({queryKey})

            const prevState = queryClient.getQueryData<IFollowerInfo>(queryKey)

            queryClient.setQueryData<IFollowerInfo>(
                queryKey, () => ({
                    followers: (prevState?.followers || 0) + (prevState?.isFollowedByUser ? -1 : +1),
                    isFollowedByUser: !prevState?.isFollowedByUser
                })
            )
            return {prevState}
        },
        onError: (err, _, context) => {
            queryClient.setQueryData(queryKey, context?.prevState)
            console.error(err)
            toast({
                variant: "destructive",
                description: 'Something went wrong. Please try again',
            })
        }
    })

    return (
        <Button variant={data.isFollowedByUser ? 'secondary' : 'default'} onClick={() => mutate()}>
            {data.isFollowedByUser ? 'Unfollow' : 'Follow'}
        </Button>
    );
};

export default FollowButton;