import { createSlice } from '@reduxjs/toolkit';
import { setLocalStorage } from '../../utils/localStore';
export const LocationModalSlice = createSlice({
  name: 'isModalOpen',
  initialState: {
    isModalOpen: false,
    location: '',
    locationList: [],
  },
  reducers: {
    setIsModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
      setLocalStorage('location', action.payload);
      window.dispatchEvent(new Event('storage'));
    },
    setLocationList: (state, action) => {
      //  setLocalStorage('locationList', action.payload);
      state.locationList = action.payload;
    },
  },
});

export const { setIsModalOpen, setLocation, setLocationList } =
  LocationModalSlice.actions;
export default LocationModalSlice.reducer;
