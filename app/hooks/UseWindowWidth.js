import { useState, useEffect } from "react";

export function useWindowWidth() {
    const [w, setW] = useState(1200);
    useEffect(() => {
        const fn = () => setW(window.innerWidth);
        fn();
        window.addEventListener("resize", fn);
        return () => window.removeEventListener("resize", fn);
    }, []);
    return w;
}
