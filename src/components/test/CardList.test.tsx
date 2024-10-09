import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CardList from '../CardList';
import { MockData } from '../../const/mock';
import '@testing-library/jest-dom/vitest';

// 테스트에 사용할 mock 데이터
const mockList: MockData[] = [
  {
    productId: '1',
    productName: 'Product 1',
    price: 10000,
    boughtDate: '2023-10-01',
  },
  {
    productId: '2',
    productName: 'Product 2',
    price: 20000,
    boughtDate: '2023-10-02',
  },
];

describe('CardList Component', () => {
  it('renders the product list correctly', () => {
    render(<CardList list={mockList} />);

    // Product 1 체크
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('가격 : 10,000원')).toBeInTheDocument();
    expect(screen.getByText('구매일 : 2023-10-01')).toBeInTheDocument();

    // Product 2 체크
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('가격 : 20,000원')).toBeInTheDocument();
    expect(screen.getByText('구매일 : 2023-10-02')).toBeInTheDocument();
  });

  it('renders correctly when the list is empty', () => {
    render(<CardList list={[]} />);

    // 리스트가 비어 있을 때는 아무 article도 렌더링되지 않아야 함
    const articles = screen.queryAllByRole('article');
    expect(articles.length).toBe(0);
  });
});
