import { useEffect, useRef, useState } from "react";

/**
 * useIntersectionObserver
 * Returns a [ref, isIntersecting] pair.
 * Once the element enters the viewport, it stays "true" (fire-once by default).
 *
 * @param {object} options  - IntersectionObserver options
 * @param {boolean} once    - Stop observing after first intersection (default true)
 */
export function useIntersectionObserver(
  options = { threshold: 0.15, rootMargin: "0px 0px -80px 0px" },
  once = true
) {
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (once) observer.disconnect();
      } else if (!once) {
        setIsIntersecting(false);
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [options, once]);

  return [ref, isIntersecting];
}
