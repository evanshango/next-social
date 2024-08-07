'use client'

import React from 'react';
import {IFollowerInfo} from "@/lib/types";
import {useFollowerInfo} from "@/hooks/useFollowerInfo";
import {formatNumber} from "@/lib/utils";

interface IFollowerCountProps {
    userId: string
    initialState: IFollowerInfo
}

const FollowerCount = ({userId, initialState}: IFollowerCountProps) => {
    const {data} = useFollowerInfo(userId, initialState);
    return (
        <span>
            Followers:{' '}
            <span className="semi-bold">
                {formatNumber(data.followers)}
            </span>
        </span>
    );
};

export default FollowerCount;