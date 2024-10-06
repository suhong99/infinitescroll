import React from 'react';

const Header: React.FC<{ totalPrice: number }> = ({ totalPrice }) => {
  return (
    <header className="header">
      <h1 className="title">상품 리스트</h1>
      <div className="total_price">총금액 : {totalPrice}</div>
    </header>
  );
};

export default Header;
