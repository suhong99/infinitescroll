import { useEffect, useState } from 'react';
import './App.css';
import { MockData } from './const/mock';
import { getMockData } from './utils/data';

function App() {
  const [page, setPage] = useState(0);
  const [list, setList] = useState<MockData[]>([]);
  console.log(list);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { datas } = await getMockData(page); // 구조 분해 할당으로 'datas'만 가져옴
        setList((prevList) => [...prevList, ...datas]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [page]);

  return (
    <main>
      <h1>상품 리스트</h1>
      {list.map(({ productId, productName, price, boughtDate }) => (
        <div key={productId}>{productName}</div>
      ))}
    </main>
  );
}

export default App;
