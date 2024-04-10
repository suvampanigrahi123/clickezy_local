import { createSlice } from '@reduxjs/toolkit';
export const checkoutSlice = createSlice({
  name: 'checkoutData',
  initialState: {
    checkoutData: {},
    checkoutPrice: 0,
  },
  reducers: {
    setCheckoutData: (state, action) => {
      state.checkoutData = action.payload;
    },
    setCheckoutPrice: (state, action) => {
      state.checkoutPrice = action.payload;
    },
  },
});

export const { setCheckoutData, checkoutPrice } = checkoutSlice.actions;
export default checkoutSlice.reducer;
