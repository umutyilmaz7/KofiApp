import React, { createContext, useState, useContext } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const addOrder = (order) => {
    // 3 basamaklı rastgele sıra no üret
    const randomSiraNo = Math.floor(100 + Math.random() * 900);
    setOrders((prev) => [{ ...order, siraNo: randomSiraNo, status: 'preparing' }, ...prev]);
  };

  // Siparişin status'unu güncelle
  const setOrderStatus = (siraNo, status) => {
    setOrders(prev => prev.map(order =>
      order.siraNo === siraNo ? { ...order, status } : order
    ));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, setOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext); 