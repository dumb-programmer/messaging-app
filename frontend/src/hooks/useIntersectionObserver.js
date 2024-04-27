import { useState, useEffect, useRef } from "react";

const useIntersectionObserver = (selector) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const observerRef = useRef();

    const stopObserver = () => observerRef?.current?.disconnect();

    useEffect(() => {
        const element = document.querySelector(selector);

        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 1.0
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.target === element) {
                    setIsIntersecting(entry.isIntersecting);
                }
            })
        }, options);

        observerRef.current = observer;


        observer.observe(element);

        return () => {
            stopObserver();
        }
    }, [selector]);

    return { isIntersecting, stopObserver };
};

export default useIntersectionObserver;