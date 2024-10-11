import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { describe, expect, it, Mock, vi } from 'vitest';
import useTotalPrice from './hooks/useTotalPrice';
import '@testing-library/jest-dom/vitest';

// useTotalPrice 훅을 모킹
vi.mock('./hooks/useTotalPrice');

global.IntersectionObserver = vi.fn().mockImplementation((callback) => {
  callback([
    {
      isIntersecting: true,
      target: document.createElement('div'),
    },
  ]);
  return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
});

describe('App 컴포넌트', () => {
  it('Header와 InfinityScroll 컴포넌트가 렌더링되는지 확인', async () => {
    // useTotalPrice 훅 모킹
    (useTotalPrice as Mock).mockReturnValue({
      totalPrice: 1000,
      updateTotalPrice: vi.fn(),
    });

    render(<App />);

    // Header가 렌더링되는지 확인 (총금액 : 1000 텍스트 확인)
    await waitFor(() => {
      expect(screen.getByText('총금액 : 1000')).toBeInTheDocument();
    });

    // InfinityScroll이 렌더링되는지 확인 (observer 역할을 가진 div 확인)
    await waitFor(() => {
      expect(screen.getByRole('observer')).toBeInTheDocument();
    });
  });
});
