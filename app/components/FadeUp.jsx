import { useInView } from "../hooks/useInView";
import { cx } from "../utils/cx";
import styles from "../LandingPage.module.css";

export default function FadeUp({ children, delay = 0, style: s }) {
    const [ref, inView] = useInView();
    return (
        <div
            ref={ref}
            className={cx(styles.fadeUpBox, inView && styles.visible)}
            style={{ transitionDelay: `${delay}s`, ...s }}
        >
            {children}
        </div>
    );
}