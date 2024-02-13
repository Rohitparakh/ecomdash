import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getCustomer = createAsyncThunk('eCommerceApp/customer/getCustomer', async (params) => {
  const response = await axios.get('/api/e-commerce-app/customer', { params });
  const data = await response.data;
  console.log(data === undefined ? null : data)
  return data === undefined ? null : data;
});

export const saveCustomer = createAsyncThunk('eCommerceApp/customer/saveCustomer', async (customer) => {
  const response = await axios.post('/api/e-commerce-app/customer/save', customer);
  const data = await response.data;

  return data;
});

const customerSlice = createSlice({
  name: 'eCommerceApp/customer',
  initialState: null,
  reducers: {
    resetCustomer: () => null,
  },
  extraReducers: {
    [getCustomer.fulfilled]: (state, action) => action.payload,
    [saveCustomer.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetCustomer } = customerSlice.actions;

export default customerSlice.reducer;
