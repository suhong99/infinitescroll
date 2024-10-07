import { useState, useCallback } from 'react';
import { MockData } from '../const/mock';
import { getMockData, getPage, setNextPage } from '../utils/data';

function useFetchData(updateTotalPrice: (data: MockData[]) => void) {
  const [list, setList] = useState<MockData[]>([]);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const page = getPage();
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
  }, [updateTotalPrice]);

  return { list, isLastPage, isLoading, fetchData };
}

export default useFetchData;
