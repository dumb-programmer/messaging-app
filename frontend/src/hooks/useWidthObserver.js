import { useEffect, useState } from "react";

const useWidthObserver = (ref) => {
    const [width, setWidth] = useState(ref?.current?.clientWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(ref?.current?.clientWidth);
        }
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, [ref]);

    return { width };
};

export default useWidthObserver;