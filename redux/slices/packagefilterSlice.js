import { createSlice } from '@reduxjs/toolkit';
 const PackagefilterTabSlice = createSlice({
  name: 'packagefilter',
  initialState: {
    packagefilters: '',
    packagecategory: 1,
    packagelocation: 1,
    packageprice: 1,
  },
  reducers: {
    setPackageFilterName: (state, action) => {
      state.packagefilters = action.payload;
    },
    setPackageCategory: (state, action) => {
      state.packagecategory = action.payload;
    },
    setPackageLocation: (state, action) => {
      state.packagelocation = action.payload;
    },
    setPackagePrice: (state, action) => {
      state.packageprice = action.payload;
    },
  },
});

export const { setPackageCategory, setPackageFilterName, setPackageLocation, setPackagePrice } =
PackagefilterTabSlice.actions;
export default PackagefilterTabSlice.reducer;
