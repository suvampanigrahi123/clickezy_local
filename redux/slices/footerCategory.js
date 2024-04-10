import { createSlice } from '@reduxjs/toolkit';

export const FooterCategory = createSlice({
  name: 'footerCategory',
  initialState: {
    categoryList: [],
    isCategoryExist: false,
  },
  reducers: {
    setCategoryList: (state, action) => {
      state.categoryList = action.payload;
      if (state.categoryList.length > 0) {
        state.isCategoryExist = true;
      } else {
        state.isCategoryExist = false;
      }
    },
  },
});

export const { setCategoryList } = FooterCategory.actions;

export default FooterCategory.reducer;
