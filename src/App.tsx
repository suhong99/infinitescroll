import { useEffect, useRef, useState, useCallback } from 'react';
import './App.css';
import { MockData } from './const/mock';
import { getMockData, getPage, setNextPage } from './utils/data';
import useTotalPrice from './hook/useTotalPrice';
import Card from './components/Card';
import Spinner from './components/Spinner';
import Header from './components/Header';

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
    <main className="wrapper">
      <Header totalPrice={totalPrice} />
      <Card list={list} />
      {isLoading && <Spinner />}
      {!isLastPage ? (
        <div ref={observerRef} className="observer" />
      ) : (
        <div className="end">마지막 페이지 입니다</div>
      )}
    </main>
  );
}

export default App;
