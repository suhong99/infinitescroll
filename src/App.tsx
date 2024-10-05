import { useEffect, useRef, useState, useCallback } from 'react';
import './App.css';
import { MockData } from './const/mock';
import { getMockData, getPage, setNextPage } from './utils/data';
import useTotalPrice from './hook/useTotalPrice';

function App() {
  const [list, setList] = useState<MockData[]>([]);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { totalPrice, updateTotalPrice } = useTotalPrice();

  const fetchData = useCallback(
    async (page: number) => {
      try {
        setIsLoading(true);

        const { datas, isEnd } = await getMockData(page);
        setList((prevList) => [...prevList, ...datas]);

        updateTotalPrice(datas);

        if (isEnd) {
          setIsLastPage(true);
        } else {
          setNextPage();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [updateTotalPrice]
  );

  useEffect(() => {
    if (isLoading || isLastPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const page = getPage();
          fetchData(page);
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
  }, [isLoading, isLastPage, fetchData]);

  return (
    <main>
      <h1>상품 리스트</h1>
      <div>{totalPrice}</div>
      {list.map(({ productId, productName, price, boughtDate }) => (
        <div key={productId}>
          <p>상품명 : {productName}</p>
          <p>가격 : {price}</p>
          <p>구매일 : {boughtDate}</p>
        </div>
      ))}
      {isLoading && <div>로딩중...</div>}
      {!isLastPage ? (
        <div ref={observerRef} style={{ height: '20px' }} />
      ) : (
        <div>마지막 페이지 입니다</div>
      )}
    </main>
  );
}

export default App;
