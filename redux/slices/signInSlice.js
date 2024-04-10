import { createSlice } from '@reduxjs/toolkit';

export const signInSlice = createSlice({
  name: 'signup',
  initialState: {
    user: '',
    email_phone: '',
    isLoggedIn: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    setEmail_phone: (state, action) => {
      state.email_phone = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, setOtp, removeOtp, setEmail_phone, logout } =
  signInSlice.actions;
export default signInSlice.reducer;
