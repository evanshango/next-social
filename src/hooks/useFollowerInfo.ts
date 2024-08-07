import {IFollowerInfo} from "@/lib/types";
import {useQuery} from "@tanstack/react-query";
import kyInstance from "@/lib/ky";

export const useFollowerInfo = (userId: string, initialState: IFollowerInfo) => {
    return useQuery({
        queryKey: ['follower-info', userId],
        queryFn: () => kyInstance.get(`/api/users/${userId}/followers`).json<IFollowerInfo>(),
        initialData: initialState,
        staleTime: Infinity,
    })
}