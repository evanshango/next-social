import {ReactNode} from "react";
import {LinkIt, LinkItUrl} from "react-linkify-it";
import Link from "next/link";
import UserLinkWithTooltip from "@/components/UserLinkWithTooltip";

interface ILinkifyProps {
    children: ReactNode;
}

export const Linkify = ({children}: ILinkifyProps) => {
    return (
        <LinkifyUsername>
            <LinkifyHashtag>
                <LinkifyUrl>
                    {children}
                </LinkifyUrl>
            </LinkifyHashtag>
        </LinkifyUsername>
    )
}

export default Linkify;

const LinkifyUrl = ({children}: ILinkifyProps) => {
    return (
        <LinkItUrl className='text-primary hover:underline'>
            {children}
        </LinkItUrl>
    )
}

const LinkifyUsername = ({children}: ILinkifyProps) => {
    return (
        <LinkIt component={(match, key) => (
            <UserLinkWithTooltip username={match.slice(1)} key={key}>
                {match}
            </UserLinkWithTooltip>
        )} regex={/(@[a-zA-Z0-9_-]+)/}
        >
            {children}
        </LinkIt>
    )
}

const LinkifyHashtag = ({children}: ILinkifyProps) => {
    return (
        <LinkIt component={(match, key) => (
            <Link key={key} href={`/hashtag/${match.slice(1)}`} className='text-primary hover:underline '>
                {match}
            </Link>
        )} regex={/(#[a-zA-Z0-9]+)/}
        >
            {children}
        </LinkIt>
    )
}