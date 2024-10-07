import './App.css';
import useTotalPrice from './hooks/useTotalPrice';
import Header from './components/Header';
import InfinityScroll from './components/InfinityScroll';

function App() {
  const { totalPrice, updateTotalPrice } = useTotalPrice();

  return (
    <main className="wrapper">
      <Header totalPrice={totalPrice} />
      <InfinityScroll updateTotalPrice={updateTotalPrice} />
    </main>
  );
}

export default App;
