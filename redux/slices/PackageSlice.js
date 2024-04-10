import { createSlice } from '@reduxjs/toolkit';
export const PackageSlice = createSlice({
  name: 'package',
  initialState: {
    packageFor: '',
    packageLocation: '',
    studio: '',
    packageDate: '',

    additionalInfo: '',
    defaultEquipments: null,
    error: null,
    selectedTab: 0,
  },
  reducers: {
    setPackageFor: (state, action) => {
      state.packageFor = action.payload;
    },
    setPackageLocation: (state, action) => {
      state.packageLocation = action.payload;
    },
    setStudio: (state, action) => {
      state.studio = action.payload;
    },
   
    setPackageDate: (state, action) => {
      state.packageDate = action.payload;
    },

    setAdditionalInfo: (state, action) => {
      state.additionalInfo = action.payload;
    },
    setEquipments: (state, action) => {
      state.additionalInfo = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setDefaultEquipments: (state, action) => {
      state.defaultEquipments = action.payload;
    },
    setSelectedTab: (state, { payload }) => {
      state.selectedTab=payload
  },
  },
});

export const {setAdditionalInfo,setSelectedTab,setDefaultEquipments,setEquipments,setError,setPackageDate,setPackageFor,setPackageLocations,setPackageLocation,setStudio} = PackageSlice.actions;
export default PackageSlice.reducer;
