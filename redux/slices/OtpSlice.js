import { createSlice } from '@reduxjs/toolkit';
export const OtpSlice = createSlice({
  name: 'otp',
  initialState: {
    email_phone: '',
  },
  reducers: {
    setEmailPhone: (state, action) => {
      state.email_phone = action.payload;
    },
  },
});

export const { setEmailPhone } = OtpSlice.actions;
export default OtpSlice.reducer;
