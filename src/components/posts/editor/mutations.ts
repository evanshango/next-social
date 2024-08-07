import {useToast} from "@/components/ui/use-toast"
import {InfiniteData, QueryFilters, useMutation, useQueryClient} from "@tanstack/react-query";
import {submitPost} from "@/components/posts/editor/actions";
import {IPostPage} from "@/lib/types";
import {useSession} from "@/app/(main)/SessionProvider";

export const useSubmitPostMutation = () => {
    const {toast} = useToast()
    const {user} = useSession()
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: submitPost,
        onSuccess: async (newPost) => {
            const queryFilter = {
                queryKey: ["post-feed"], predicate(query) {
                    return query.queryKey.includes("for-you") ||
                        (query.queryKey.includes("user-posts") && query.queryKey.includes(user.id));
                }
            } satisfies QueryFilters;
            await queryClient.cancelQueries(queryFilter);

            queryClient.setQueriesData<InfiniteData<IPostPage, string | null>>(
                queryFilter, (prev) => {
                    const firstPage = prev?.pages[0];

                    if (firstPage) {
                        return {
                            pageParams: prev.pageParams,
                            pages: [
                                {
                                    posts: [newPost, ...firstPage.posts],
                                    nextCursor: firstPage.nextCursor,
                                },
                                ...prev.pages.slice(1),
                            ],
                        };
                    }
                },
            );
            await queryClient.invalidateQueries({
                queryKey: queryFilter.queryKey,
                predicate: query => queryFilter.predicate(query) && !query.state.data

            });
            toast({
                description: "Post created",
            });
        },
        onError: err => {
            console.log(err)
            toast({
                variant: "destructive",
                description: 'Failed to post. Please try again',
            })
        }
    })
}