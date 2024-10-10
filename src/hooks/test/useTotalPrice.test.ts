import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useTotalPrice from '../useTotalPrice';
import { MockData } from '../../const/mock';

const mockData: MockData[] = [
  {
    productId: '1',
    productName: 'Product 1',
    price: 1000,
    boughtDate: 'Sat Jun 01 1985 20:00:06 GMT+0900 (한국 표준시)',
  },
  {
    productId: '2',
    productName: 'Product 2',
    price: 2000,
    boughtDate: 'Sat Jun 01 1985 20:00:06 GMT+0900 (한국 표준시)',
  },
];

describe('useTotalPrice Hook', () => {
  it('초기 상태가 올바르게 설정되는지 확인', () => {
    const { result } = renderHook(() => useTotalPrice());

    expect(result.current.totalPrice).toBe(0);
  });

  it('updateTotalPrice가 호출되면 totalPrice가 올바르게 업데이트되는지 확인', () => {
    const { result } = renderHook(() => useTotalPrice());

    act(() => {
      result.current.updateTotalPrice(mockData); // mock 데이터를 사용해 totalPrice 업데이트
    });

    expect(result.current.totalPrice).toBe(3000); // 1000 + 2000 = 3000
  });

  it('updateTotalPrice가 여러 번 호출될 때 totalPrice가 누적되는지 확인', () => {
    const { result } = renderHook(() => useTotalPrice());
    const mockData2: MockData[] = [
      {
        productId: '3',
        productName: 'Product 3',
        price: 4000,
        boughtDate: 'Sat Jun 01 1985 20:00:06 GMT+0900 (한국 표준시)',
      },
    ];

    act(() => {
      result.current.updateTotalPrice(mockData);
      result.current.updateTotalPrice(mockData2); // 두 번째 데이터로 업데이트
    });

    expect(result.current.totalPrice).toBe(7000); // 1000 + 2000 + 4000
  });
});
