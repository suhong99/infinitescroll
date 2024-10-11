import { MockData } from '../const/mock';
import useFetchData from '../hooks/useFetchData';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import CardList from './CardList';
import Spinner from './Spinner';

const InfinityScroll: React.FC<{
  updateTotalPrice: (datas: MockData[]) => void;
}> = ({ updateTotalPrice }) => {
  const { list, isLastPage, isLoading, fetchData } =
    useFetchData(updateTotalPrice);
  const observerRef = useInfiniteScroll(fetchData, isLoading, isLastPage);

  return (
    <>
      <CardList list={list} />
      {isLoading && <Spinner />}
      {!isLastPage ? (
        <div ref={observerRef} className="observer" role="observer" />
      ) : (
        <div className="end">마지막 페이지 입니다</div>
      )}
    </>
  );
};

export default InfinityScroll;
