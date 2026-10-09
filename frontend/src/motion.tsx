import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { countValue } from "./count";

export function useInView<T extends Element>(options?: { threshold?: number; rootMargin?: string }) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const threshold = options?.threshold ?? 0.15;
  const rootMargin = options?.rootMargin ?? "0px 0px -8% 0px";

  useEffect(() => {
    const element = ref.current;
    if (!element || inView) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [inView, threshold, rootMargin]);

  return { ref, inView };
}

type RevealProps = {
  children: ReactNode;
  delay?: number;
  distance?: number;
  style?: CSSProperties;
};

export function Reveal({ children, delay = 0, distance = 28, style }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="ba-reveal"
      data-visible={inView ? "true" : "false"}
      style={{
        ...style,
        transitionDelay: `${delay}ms`,
        ["--ba-reveal-distance" as string]: `${distance}px`,
      }}
    >
      {children}
    </div>
  );
}

type CountUpProps = {
  to: number;
  from?: number;
  suffix?: string;
  duration?: number;
};

export function CountUp({ to, from = 0, suffix = "", duration = 1800 }: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.6, rootMargin: "0px" });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = (now - start) / duration;
      setValue(countValue(from, to, progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, from, to, duration]);

  return (
    <span ref={ref} aria-label={`${to}${suffix}`}>
      <span aria-hidden="true">
        {value}
        {suffix}
      </span>
    </span>
  );
}
