import {useToast} from "@/components/ui/use-toast";
import {InfiniteData, QueryFilters, useMutation, useQueryClient} from "@tanstack/react-query";
import {usePathname, useRouter} from "next/navigation";
import {deletePost} from "@/components/posts/actions";
import {IPostPage} from "@/lib/types";

export const useDeletePostMutation = () => {
    const {toast} = useToast()
    const queryClient = useQueryClient()
    const router = useRouter()
    const pathname = usePathname()

    return useMutation({
        mutationFn: deletePost,
        onSuccess: async (deletedPost) => {
            const queryFilter: QueryFilters = {queryKey: ["post-feed"]};
            await queryClient.cancelQueries(queryFilter);

            queryClient.setQueriesData<InfiniteData<IPostPage, string | null>>(
                queryFilter, (prev) => {
                    if (!prev) return

                    return {
                        pageParams: prev.pageParams,
                        pages: prev.pages.map(page => ({
                            nextCursor: page.nextCursor,
                            posts: page.posts.filter(p => p.id !== deletedPost.id),
                        })),
                    }
                },
            );
            toast({
                description: 'Post deleted',
            })

            if (pathname === `/posts/${deletedPost.id}`) {
                router.push(`/users/${deletedPost.user.username}`)
            }
        },
        onError: err => {
            console.log(err)
            toast({
                variant: "destructive",
                description: 'Failed to delete post. Please try again',
            })
        }
    })
}