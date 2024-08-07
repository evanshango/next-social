'use client'

import {useSession} from "@/app/(main)/SessionProvider"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator,
    DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";
import {Check, LogOutIcon, Monitor, Moon, Sun, UserIcon} from "lucide-react";
import {signOut} from "@/app/(auth)/actions";
import {cn} from '@/lib/utils'
import {useTheme} from "next-themes";
import {useQueryClient} from "@tanstack/react-query";

interface IUserButtonProps {
    className?: string
}

export default function UserButton({className}: IUserButtonProps) {
    const {user} = useSession()
    const {theme, setTheme} = useTheme()
    const query = useQueryClient()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={cn('flex-none rounded-full', className)}>
                    <UserAvatar avatarUrl={user.avatarUrl} size={40}/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>
                    Logged in as @{user.username}
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <Link href={`/users/${user.username}`}>
                    <DropdownMenuItem>
                        <UserIcon className="mr-2 size-4"/>
                        Profile
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Monitor className="mr-2 size-4"/>
                        Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => setTheme('light')}>
                                <Sun className="mr-2 size-4"/>
                                Light
                                {theme === 'light' && <Check className={'ms-2'}/>}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('dark')}>
                                <Moon className="mr-2 size-4"/>
                                Dark
                                {theme === 'dark' && <Check className={'ms-2'}/>}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('system')}>
                                <Monitor className="mr-2 size-4"/>
                                System
                                {theme === 'system' && <Check className={'ms-2'}/>}
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => {
                    query.clear()
                    return signOut()
                }}>
                    <LogOutIcon className="mr-2 size-4"/>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}