import { useState, useEffect, useRef } from "react";

export const useNearScreen = <T extends HTMLElement = HTMLElement>(options?: IntersectionObserverInit) => {
    const [isNearBottom, setIsNearBottom] = useState(false);
    const elRef = useRef<T | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                setIsNearBottom(entry.isIntersecting);
            },
            { root: null, rootMargin: "200px", threshold: 0.1, ...options }
        );

        if (elRef.current) {
            observer.observe(elRef.current);
        }

        return () => {
            if (elRef.current) {
                observer.unobserve(elRef.current);
            }
        };
    }, [options]);

    return { isNearBottom, elRef };
};