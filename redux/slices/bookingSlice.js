import { createSlice } from '@reduxjs/toolkit';
export const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookingFor: '',
    bookingLocation: '',
    studio: '',
    bookingTime: '',
    numberOfBookingTime: 0,
    bookingDate: '',
    bookingTimeFrom: '',
    bookingTimeTo: '',
    additionalInfo: '',
    defaultEquipments: null,
    error: null,
    // bookingPrice: 0,
  },
  reducers: {
    setBookingFor: (state, action) => {
      state.bookingFor = action.payload;
    },
    setBookingLocation: (state, action) => {
      state.bookingLocation = action.payload;
    },
    setStudio: (state, action) => {
      state.studio = action.payload;
    },
    setBookingTime: (state, action) => {
      state.bookingTime = action.payload;
    },
    setNumberOfBookingTime: (state, action) => {
      state.numberOfBookingTime = action.payload;
    },
    setBookingDate: (state, action) => {
      state.bookingDate = action.payload;
    },
    setBookingTimeFrom: (state, action) => {
      state.bookingTimeFrom = action.payload;
    },
    setBookingTimeTo: (state, action) => {
      state.bookingTimeTo = action.payload;
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
    resetBookingTime: (state) => {
      state.bookingTimeFrom = '';
      state.bookingTimeTo = '';
    },
  },
});

export const {
  setBooking,
  resetBooking,
  setBookingFor,
  setBookingLocation,
  setStudio,
  setBookingTime,
  setNumberOfBookingTime,
  setBookingDate,
  setBookingTimeFrom,
  setBookingTimeTo,
  setAdditionalInfo,
  setError,
  resetBookingTime,
  setDefaultEquipments,
} = bookingSlice.actions;
export default bookingSlice.reducer;
