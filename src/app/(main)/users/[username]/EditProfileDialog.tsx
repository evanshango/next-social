import React, {useRef, useState} from 'react';
import {UserData} from "@/lib/types";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useForm} from "react-hook-form";
import {UpdateUserProfileData, updateUserProfileSchema} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {useUpdateProfileMutation} from "@/app/(main)/users/[username]/mutations";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import LoadingButton from "@/components/LoadingButton";
import Image, {StaticImageData} from "next/image";
import {Label} from "@/components/ui/label";
import avatarPlaceholder from '@/assets/avatar-placeholder.png'
import {Camera} from "lucide-react";
import CropImageDialog from "@/components/CropImageDialog";
import Resizer from 'react-image-file-resizer'

interface IEditProfileProps {
    user: UserData,
    open: boolean,
    onOpenChange: (open: boolean) => void
}

const EditProfileDialog = ({user, open, onOpenChange}: IEditProfileProps) => {
    const form = useForm<UpdateUserProfileData>({
        resolver: zodResolver(updateUserProfileSchema),
        defaultValues: {
            displayName: user.displayName,
            bio: user.bio || '',
        }
    });

    const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);

    const mutation = useUpdateProfileMutation()

    const onSubmit = async (values: UpdateUserProfileData) => {
        const newAvatarFile = croppedAvatar ? new File([croppedAvatar], `avatar_${user.id}.webp`) : undefined;
        mutation.mutate({
                values,
            avatar: newAvatarFile
            }, {
                onSuccess: () => {
                    setCroppedAvatar(null)
                    onOpenChange(false)
                }
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-1.5">
                    <Label>Avatar</Label>
                    <AvatarInput
                        src={croppedAvatar ? URL.createObjectURL(croppedAvatar) : user.avatarUrl || avatarPlaceholder}
                        onImageCropped={setCroppedAvatar}
                    />
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="displayName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Display Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your display name" {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder='Tell us a little bit about yourself'
                                                  className='resize-none' {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <LoadingButton type="submit" loading={mutation.isPending}>
                                Save
                            </LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditProfileDialog;

interface IAvatarInputProps {
    src: string | StaticImageData
    onImageCropped: (blob: Blob | null) => void
}

const AvatarInput = ({src, onImageCropped}: IAvatarInputProps) => {
    const [imageToCrop, setImageToCrop] = useState<File>();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const onImageSelected = (image: File | undefined) => {
        if (!image) return

        Resizer.imageFileResizer(
            image,
            1024,
            1024,
            'WEBP',
            100,
            0,
            (uri) => setImageToCrop(uri as File),
            'file'
        )
    }

    return (
        <>
            <input
                type='file'
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => onImageSelected(e.target.files?.[0])}
                className="hidden sr-only"
            />
            <button
                type='button'
                onClick={() => fileInputRef.current?.click()}
                className="group relative block"
            >
                <Image
                    src={src}
                    alt='Avatar preview'
                    width={150}
                    height={150}
                    className="size-32 flex-none rounded-full object-cover"
                />
                <span
                    className='absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black
                    bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25'
                >
                    <Camera size={24}/>
                </span>
            </button>
            {imageToCrop && (
                <CropImageDialog
                    src={URL.createObjectURL(imageToCrop)}
                    cropAspectRatio={1}
                    onCropped={onImageCropped}
                    onClose={() => {
                        setImageToCrop(undefined);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                    }}
                />
            )}
        </>
    )
}