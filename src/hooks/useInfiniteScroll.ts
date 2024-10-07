import { useEffect, useRef } from 'react';

function useInfiniteScroll(
  callback: () => void,
  isLoading: boolean,
  isLastPage: boolean
) {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isLoading || isLastPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = observerRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isLoading, isLastPage, callback]);

  return observerRef;
}

export default useInfiniteScroll;
