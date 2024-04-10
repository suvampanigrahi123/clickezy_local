import { createSlice } from '@reduxjs/toolkit';
export const auth = createSlice({
  name: 'isAuth',
  initialState: {
    user: null,
    authToken: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
    reset: (state) => {
      state.user = null;
      state.authToken = null;
    },
  },
});

export const { setUser, setAuthToken, reset } = auth.actions;
export default auth.reducer;
