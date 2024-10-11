import { vi } from 'vitest';

export const observe = vi.fn();
export const unobserve = vi.fn();

// IntersectionObserverEntry 타입 정의
export interface IntersectionObserverEntry {
  isIntersecting: boolean;
}

// IntersectionObserver의 콜백 함수 타입 정의
export type IntersectionObserverCallback = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) => void;

// IntersectionObserver 모킹
export const IntersectionObserverMock = vi.fn(
  (callback: IntersectionObserverCallback) => ({
    observe,
    unobserve,
    disconnect: vi.fn(),
    trigger: (entries: IntersectionObserverEntry[]) =>
      callback(
        entries,
        IntersectionObserverMock as unknown as IntersectionObserver
      ),
  })
);
