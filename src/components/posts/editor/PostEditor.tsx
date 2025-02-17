'use client'

import React from 'react';
import {EditorContent, useEditor} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import {Placeholder} from "@tiptap/extension-placeholder";
import UserAvatar from "@/components/UserAvatar";
import {useSession} from "@/app/(main)/SessionProvider";
import {Button} from "@/components/ui/button";
import './styles.css'
import {useSubmitPostMutation} from "@/components/posts/editor/mutations";
import LoadingButton from "@/components/LoadingButton";

const PostEditor = () => {
    const {user} = useSession();
    const mutation = useSubmitPostMutation()
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false,
            }),
            Placeholder.configure({
                placeholder: "What's crack-a-lackin'?",
            })
        ],
        immediatelyRender: false
    })
    const input = editor?.getText({
        blockSeparator: '\n',
    }) || ''

    const onSubmit = () => {
        mutation.mutate(input, {
            onSuccess: () => {
                editor?.commands.clearContent()
            },
        })
    }

    return (
        <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex gap-5">
                <UserAvatar avatarUrl={user.avatarUrl} className={'hidden sm:inline'}/>
                <EditorContent
                    editor={editor}
                    className="w-full max-h-[20rem] overflow-y-auto bg-background rounded-2xl px-5 py-3"
                />
            </div>
            <div className="flex justify-end">
                <LoadingButton
                    loading={mutation.isPending}
                    onClick={onSubmit}
                    disabled={!input.trim()}
                    className='min-w-20'
                >
                    Post
                </LoadingButton>
            </div>
        </div>
    );
};

export default PostEditor;