import './App.css';
import useInfiniteScroll from './hooks/useIntersection';
import useTotalPrice from './hooks/useTotalPrice';
import useFetchData from './hooks/useFetchData';
import Card from './components/Card';
import Spinner from './components/Spinner';
import Header from './components/Header';

function App() {
  const { totalPrice, updateTotalPrice } = useTotalPrice();
  const { list, isLastPage, isLoading, fetchData } =
    useFetchData(updateTotalPrice);
  const observerRef = useInfiniteScroll(fetchData, isLoading, isLastPage);

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
