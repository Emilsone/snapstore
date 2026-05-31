import { useState, useEffect } from "react";
import { useInView } from "../hooks/useInView";

export default function Counter({ to, suffix = "" }) {
    const [val, setVal] = useState(0);
    const [ref, inView] = useInView(0.3);
    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const step = Math.ceil(to / 60);
        const t = setInterval(() => {
            start += step;
            if (start >= to) { setVal(to); clearInterval(t); }
            else setVal(start);
        }, 16);
        return () => clearInterval(t);
    }, [inView, to]);
    return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}