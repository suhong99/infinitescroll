import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import useInfiniteScroll from '../useInfiniteScroll';

const observe = vi.fn();
const unobserve = vi.fn();

// IntersectionObserverEntry 타입 정의
interface IntersectionObserverEntry {
  isIntersecting: boolean;
}

// IntersectionObserver의 콜백 함수 타입 정의
type IntersectionObserverCallback = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) => void;

// IntersectionObserverMock 정의
const IntersectionObserverMock = vi.fn(
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

// INtersectionObserver를 모킹함
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

describe('useInfiniteScroll Hook', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('스크롤이 끝에 도달할 때 콜백이 호출되는지 확인', async () => {
    const mockCallback = vi.fn();
    renderHook(() => useInfiniteScroll(mockCallback, false, false));

    // IntersectionObserver가 호출됨 ( 모킹된 애가 호출)
    await waitFor(() => expect(IntersectionObserverMock).toHaveBeenCalled());

    // act 내에서 IntersectionObserver 콜백을 명시적으로 호출
    act(() => {
      const entry = [{ isIntersecting: true }];

      // trigger를 사용하여 observer 콜백 호출
      const observer = IntersectionObserverMock.mock.results[0].value;
      observer.trigger(entry); // IntersectionObserver 콜백 호출
    });

    // 콜백이 호출되었는지 확인
    expect(mockCallback).toHaveBeenCalled(); // 콜백이 호출됐는지 확인
  });

  it('isLoading 또는 isLastPage가 true일 때 observe가 호출되지 않는지 확인', () => {
    const mockCallback = vi.fn();

    // isLoading이 true일 때
    renderHook(() => useInfiniteScroll(mockCallback, true, false));
    expect(observe).not.toHaveBeenCalled();

    // isLastPage가 true일 때
    renderHook(() => useInfiniteScroll(mockCallback, false, true));
    expect(observe).not.toHaveBeenCalled();
  });
});
