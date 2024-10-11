import { render, screen, waitFor } from '@testing-library/react';
import InfinityScroll from '../InfinityScroll';
import { MockData } from '../../const/mock';
import useFetchData from '../../hooks/useFetchData';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock hooks
vi.mock('../../hooks/useFetchData');
vi.mock('../../hooks/useInfiniteScroll');

// Sample mock data
const mockData: MockData[] = [
  {
    productId: '1',
    productName: 'Product 1',
    price: 100,
    boughtDate: '2024-01-01',
  },
  {
    productId: '2',
    productName: 'Product 2',
    price: 200,
    boughtDate: '2024-01-02',
  },
];

describe('InfinityScroll Component', () => {
  const updateTotalPrice = vi.fn();

  beforeEach(() => {
    (useFetchData as Mock).mockReturnValue({
      list: mockData,
      isLastPage: false,
      isLoading: false,
      fetchData: vi.fn(),
    });

    (useInfiniteScroll as Mock).mockReturnValue({ current: null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('카드리스트를 제대로 렌더링 하는지', async () => {
    render(<InfinityScroll updateTotalPrice={updateTotalPrice} />);

    // 비동기적으로 텍스트가 화면에 나타날 때까지 기다림
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });

  it('로딩처리가 되는지', () => {
    // loading 상태를 시뮬레이션
    (useFetchData as Mock).mockReturnValue({
      list: mockData,
      isLastPage: false,
      isLoading: true,
      fetchData: vi.fn(),
    });

    render(<InfinityScroll updateTotalPrice={updateTotalPrice} />);

    // spinner가 표시되는지 확인
    expect(screen.getByText('로딩중...')).toBeInTheDocument();
  });

  it('renders the "last page" message when isLastPage is true', () => {
    // 마지막 페이지 상태를 시뮬레이션
    (useFetchData as Mock).mockReturnValue({
      list: mockData,
      isLastPage: true,
      isLoading: false,
      fetchData: vi.fn(),
    });

    render(<InfinityScroll updateTotalPrice={updateTotalPrice} />);

    // "마지막 페이지입니다" 메시지가 화면에 표시되는지 확인
    expect(screen.getByText('마지막 페이지 입니다')).toBeInTheDocument();
  });

  it('observer ref가 올바르게 위치하는지', () => {
    const observerRef = { current: null };
    (useInfiniteScroll as Mock).mockReturnValue(observerRef);

    render(<InfinityScroll updateTotalPrice={updateTotalPrice} />);

    // getByRole을 사용하여 'observer' role을 가진 div를 찾음
    const observerDiv = screen.getByRole('observer');

    // ref가 이 div 요소에 제대로 연결되었는지 확인
    expect(observerRef.current).toBe(observerDiv);
  });
});
