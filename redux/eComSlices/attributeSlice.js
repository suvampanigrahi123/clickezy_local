import { createSlice } from '@reduxjs/toolkit';
export const AttributeSlice = createSlice({
  name: 'attributes',
  initialState: {
    attribute: null,
    price: 0,
    availableProduct: null,
    defaultAttribute: null,
  },
  reducers: {
    setAttribute: (state, action) => {
      state.attribute = action.payload;
    },
    setPrice: (state, action) => {
      state.price = action.payload;
    },
    setAvailableProduct(state, action) {
      state.availableProduct = action.payload;
    },
    setDefaultAttributes(state, action) {
      state.defaultAttribute = action.payload;
    },
  },
});

export const {
  setAttribute,
  setPrice,
  setAvailableProduct,
  setDefaultAttributes,
} = AttributeSlice.actions;
export default AttributeSlice.reducer;
