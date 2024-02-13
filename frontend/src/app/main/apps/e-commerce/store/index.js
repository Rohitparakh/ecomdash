import { combineReducers } from '@reduxjs/toolkit';
import order from './orderSlice';
import orders from './ordersSlice';
import product from './productSlice';
import products from './productsSlice';
import customer from './customerSlice';
import customers from './customersSlice';

const reducer = combineReducers({
  products,
  product,
  customers,
  customer,
  orders,
  order,
});

export default reducer;
