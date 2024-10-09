import { getMockData, getPage } from '../../utils/data';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useFetchData from '../useFetchData';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Mock } from 'vitest';

// Mocking the external functions
vi.mock('../../utils/data', () => ({
  getMockData: vi.fn(),
  getPage: vi.fn(),
  setNextPage: vi.fn(),
}));

describe('useFetchData Hook', () => {
  const mockUpdateTotalPrice = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('초기 상태가 올바르게 설정되는지 확인', () => {
    const { result } = renderHook(() => useFetchData(mockUpdateTotalPrice));

    expect(result.current.list).toEqual([]);
    expect(result.current.isLastPage).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('데이터가 성공적으로 페칭되고 list가 업데이트되는지 테스트', async () => {
    const mockData = [
      { productId: '1', productName: 'Product 1', price: 1000 },
    ];
    (getMockData as Mock).mockResolvedValueOnce({
      datas: mockData,
      isEnd: false,
    });
    (getPage as Mock).mockReturnValue(1);

    const { result } = renderHook(() => useFetchData(mockUpdateTotalPrice));

    act(() => {
      result.current.fetchData();
    });

    // 데이터가 로딩 상태일 때, 로딩이 true
    expect(result.current.isLoading).toBe(true);

    // waitFor을 사용해 상태 변경이 완료될 때까지 기다림
    await waitFor(() => {
      // 상태가 업데이트되었는지 확인
      expect(result.current.list).toEqual(mockData);
      expect(result.current.isLoading).toBe(false);
      expect(mockUpdateTotalPrice).toHaveBeenCalledWith(mockData);
    });
  });

  it('마지막 페이지에 도달했을 때 isLastPage가 true로 설정되는지 확인', async () => {
    const mockData = [
      { productId: '1', productName: 'Product 1', price: 1000 },
    ];
    (getMockData as Mock).mockResolvedValueOnce({
      datas: mockData,
      isEnd: true,
    });
    (getPage as Mock).mockReturnValue(1);

    const { result } = renderHook(() => useFetchData(mockUpdateTotalPrice));

    act(() => {
      result.current.fetchData();
    });

    // waitFor을 사용해 상태 변경이 완료될 때까지 기다림
    await waitFor(() => {
      expect(result.current.isLastPage).toBe(true);
    });
  });

  it('페칭 중 에러가 발생했을 때 에러 처리 확인', async () => {
    (getMockData as Mock).mockRejectedValueOnce(new Error('Fetch error'));
    (getPage as Mock).mockReturnValue(1);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useFetchData(mockUpdateTotalPrice));

    act(() => {
      result.current.fetchData();
    });

    // waitFor을 사용해 상태 변경이 완료될 때까지 기다림
    await waitFor(() => {
      // Error가 처리된 것 확인
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching data:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
