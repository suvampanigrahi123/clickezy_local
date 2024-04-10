import { createSlice } from '@reduxjs/toolkit';
export const filterTabSlice = createSlice({
  name: 'filter',
  initialState: {
    filter: '',
    category: 1,
    location: 1,
    price: 1,
  },
  reducers: {
    setFilterName: (state, action) => {
      state.filter = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setPrice: (state, action) => {
      state.price = action.payload;
    },
  },
});

export const { setFilterName, setCategory, setPrice, setLocation } =
  filterTabSlice.actions;
export default filterTabSlice.reducer;
