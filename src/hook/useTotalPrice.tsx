import { useCallback, useState } from 'react';
import { MockData } from '../const/mock';

function useTotalPrice() {
  const [totalPrice, setTotalPrice] = useState(0);
  const updateTotalPrice = useCallback((datas: MockData[]) => {
    const sum = datas.reduce((acc, curr) => acc + curr['price'], 0);
    setTotalPrice((prevPrice) => prevPrice + sum);
  }, []);

  return { totalPrice, updateTotalPrice };
}

export default useTotalPrice;
