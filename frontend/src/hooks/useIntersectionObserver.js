import { useState, useEffect, useRef } from "react";

const useIntersectionObserver = () => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef();
  const elementRef = useRef(null);

  const stopObserver = () => observerRef?.current?.disconnect();

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === elementRef.current) {
          setIsIntersecting(entry.isIntersecting);
        }
      });
    }, options);

    observerRef.current = observer;

    observer.observe(elementRef.current);

    return () => {
      stopObserver();
    };
  }, [elementRef]);

  return { isIntersecting, stopObserver, elementRef };
};

export default useIntersectionObserver;
