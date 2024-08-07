import React from 'react';
import {useInView} from "react-intersection-observer";

interface IInfiniteScrollContainerProps extends React.PropsWithChildren {
    onBottomReached: () => void
    className?: string
}

const InfiniteScrollContainer = ({children, onBottomReached, className}: IInfiniteScrollContainerProps) => {
    const {ref} = useInView({
        rootMargin: '200px',
        onChange: inView => {
            if (inView) {
                onBottomReached();
            }
        }
    })
    return (
        <div className={className}>
            {children}
            <div ref={ref}/>
        </div>
    );
};

export default InfiniteScrollContainer;