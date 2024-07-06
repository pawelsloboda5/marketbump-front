import { useEffect, useRef, useState, RefObject } from 'react';

const useInfiniteScroll = (callback: () => Promise<void>): { bottomRef: RefObject<HTMLDivElement>, isFetching: boolean } => {
    const [isFetching, setIsFetching] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const bottomElement = bottomRef.current;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsFetching(true);
                }
            },
            {
                threshold: 1.0,
            }
        );

        if (bottomElement) {
            observer.observe(bottomElement);
        }

        return () => {
            if (bottomElement) {
                observer.unobserve(bottomElement);
            }
        };
    }, []);

    useEffect(() => {
        if (!isFetching) return;
        callback().then(() => {
            setIsFetching(false);
        });
    }, [isFetching, callback]);

    return { bottomRef, isFetching };
};

export default useInfiniteScroll;
