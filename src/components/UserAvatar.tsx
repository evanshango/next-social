import Image from "next/image";
import avatarPlaceholder from '@/assets/avatar-placeholder.png'
import {cn} from "@/lib/utils";

interface IUserAvatarProps {
    avatarUrl: string | null | undefined;
    size?: number
    className?: string
}

export default function UserAvatar({avatarUrl, size, className}: IUserAvatarProps) {
    return (
        <Image
            src={avatarUrl || avatarPlaceholder}
            alt='User Avatar'
            width={size ?? 48}
            height={size ?? 48}
            priority
            className={cn('aspect-square h-fit flex-none rounded-full bg-secondary object-cover', className)}
        />
    )
}