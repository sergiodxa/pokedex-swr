import { useState, useEffect, RefObject } from "react";

function useOnScreen(ref: RefObject<Element>, rootMargin = "0px"): boolean {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { rootMargin }
    );

    const element = ref.current;

    if (!element) return;

    observer.observe(element);
    return () => {
      observer.unobserve(element);
    };
  }, [ref.current, rootMargin]);

  return isIntersecting;
}

export default useOnScreen;
