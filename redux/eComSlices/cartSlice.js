import { createSlice } from '@reduxjs/toolkit';
export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    quantity: 0,
    shippingPrice: 0,
  },
  reducers: {
    setCartQuantity: (state, action) => {
      state.quantity = action.payload;
    },
    setShippingPrice: (state, action) => {
      if (action.payload.type === 'add') {
        state.shippingPrice += action.payload.price;
      }
      if (action.payload.type === 'sub') {
        state.shippingPrice -= action.payload.price;
      }
    },
  },
});

export const { setCartQuantity, setShippingPrice } = cartSlice.actions;
export default cartSlice.reducer;
