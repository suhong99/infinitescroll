import { useEffect, useRef, useState } from 'react';
import './App.css';
import { MockData } from './const/mock';
import { getMockData, getPage, setNextPage } from './utils/data';

function App() {
  const [list, setList] = useState<MockData[]>([]);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchData = async (page: number) => {
    try {
      setIsLoading(true);
      const { datas, isEnd } = await getMockData(page);
      setList((prevList) => [...prevList, ...datas]);

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
  };

  useEffect(() => {
    if (isLoading || isLastPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const page = getPage();
          fetchData(page);
          setNextPage();
        }
      },
      { threshold: 1.0 } // 100% 화면에 들어왔을 때 트리거
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isLoading, isLastPage]);

  useEffect(() => {
    fetchData(0);
  }, []);

  return (
    <main>
      <h1>상품 리스트</h1>
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
