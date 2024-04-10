import { createSlice } from '@reduxjs/toolkit';

export const signUpSlice = createSlice({
  name: 'signup',
  initialState: {
    mobile: '',
    name: '',
    email: '',
    dob: '',
    gender: '',
    user_id: '',
    isPhoneVerified: false,
    isEmailVerified: false,
    showVerificationModal: false,
  },
  reducers: {
    setMobile: (state, action) => {
      state.mobile = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setDob: (state, action) => {
      state.dob = action.payload;
    },
    setGender: (state, action) => {
      state.gender = action.payload;
    },
    setUserId: (state, action) => {
      state.user_id = action.payload;
    },
    resetSignup: (state) => {
      state.mobile = '';
      state.name = '';
      state.email = '';
      state.dob = '';
      state.gender = '';
      state.user_id = '';
      state.isPhoneVerified = false;
      state.isEmailVerified = false;
    },
    setIsPhoneVerified: (state, { payload }) => {
      state.isPhoneVerified = payload;
    },
    setIsEmailVerified: (state, { payload }) => {
      state.isEmailVerified = payload;
    },
    setShowVerificationModal: (state, { payload }) => {
      state.showVerificationModal = payload;
    },
  },
});

export const {
  setMobile,
  setName,
  setEmail,
  setDob,
  resetSignup,
  setGender,
  setUserId,
  setIsPhoneVerified,
  setIsEmailVerified,
  setShowVerificationModal,
} = signUpSlice.actions;
export default signUpSlice.reducer;
