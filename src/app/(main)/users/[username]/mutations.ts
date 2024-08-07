import {useToast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {InfiniteData, QueryFilters, useMutation, useQueryClient} from "@tanstack/react-query";
import {useUploadThing} from "@/lib/uploadthing";
import {UpdateUserProfileData} from "@/lib/validation";
import {updateUserProfile} from "@/app/(main)/users/[username]/actions";
import {IPostPage} from "@/lib/types";

export const useUpdateProfileMutation = () => {
    const {toast} = useToast()
    const router = useRouter()

    const queryClient = useQueryClient()

    const {startUpload: startAvatarUpload} = useUploadThing('avatar')

    return useMutation({
        mutationFn: async ({values, avatar}: { values: UpdateUserProfileData, avatar?: File }) => {
            return Promise.all([
                updateUserProfile(values),
                avatar && startAvatarUpload([avatar])
            ])
        },
        onSuccess: async (
            [updatedUser, result]
        ) => {
            const newAvatarUrl = result?.[0].serverData.avatarUrl

            const queryFilter: QueryFilters = {
                queryKey: ['post-feed']
            }

            await queryClient.cancelQueries(queryFilter)

            queryClient.setQueriesData<InfiniteData<IPostPage, string | null>>(
                queryFilter, (prev) => {
                    if (!prev) return

                    return {
                        pageParams: prev.pageParams,
                        pages: prev.pages.map(page => ({
                            nextCursor: page.nextCursor,
                            posts: page.posts.map(post => {
                                if (post.user.id === updatedUser.id) {
                                    return {
                                        ...post,
                                        user: {
                                            ...updatedUser,
                                            avatarUrl: newAvatarUrl || updatedUser.avatarUrl
                                        }
                                    }
                                }
                                return post
                            })
                        })),
                    }
                }
            )
            router.refresh()

            toast({
                description: 'Profile updated',
            })
        },
        onError: (error) => {
            console.error(error)
            toast({
                variant: 'destructive',
                description: 'Failed to update profile. Please try again',
            })
        }
    })
}