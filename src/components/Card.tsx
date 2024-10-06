import { MockData } from '../const/mock';

const Card: React.FC<{ list: MockData[] }> = ({ list }) => {
  return (
    <section className="product_list">
      {list.map(({ productId, productName, price, boughtDate }) => (
        <article className="product_card" key={productId}>
          <h2 className="product_name">{productName}</h2>
          <p className="product_price">가격 : {price.toLocaleString()}원</p>
          <time className="product_date" dateTime={boughtDate}>
            구매일 : {boughtDate}
          </time>
        </article>
      ))}
    </section>
  );
};

export default Card;
