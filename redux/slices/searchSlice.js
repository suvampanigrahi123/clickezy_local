import { createSlice } from '@reduxjs/toolkit';
export const filterTabSlice = createSlice({
  name: 'search',
  initialState: {
    filter: null,
    category: null,
    location: null,
    previousLocation: null,
    minPrice: null,
    maxPrice: null,
    equipment: null,
    items:[]
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
    setPreviousLocation: (state, action) => {
      state.previousLocation = action.payload;
    },
    setMinPrice: (state, action) => {
      state.minPrice = action.payload;
    },
    setMaxPrice: (state, action) => {
      state.maxPrice = action.payload;
    },
    setEquipment: (state, action) => {
      state.equipment = action.payload;
    },
    resetPrice: (state) => {
      state.maxPrice = null;
      state.minPrice = null;
    },
    clearFilter: (state) => {
      state.location = null;
      state.category = null;
      state.maxPrice = null;
      state.minPrice = null;
    },
    setItems: (state, { payload }) => {
      state.items = payload;
    }
  },
});

export const {
  setFilterName,
  setCategory,
  setPrice,
  setLocation,
  setEquipment,
  setMinPrice,
  setMaxPrice,
  resetPrice,
  clearFilter,
  setItems,
  setPreviousLocation
} = filterTabSlice.actions;
export default filterTabSlice.reducer;
