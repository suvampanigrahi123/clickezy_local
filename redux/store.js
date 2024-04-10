import { configureStore } from '@reduxjs/toolkit';
import signUpSlice from './slices/signupSlice';
import bookingReducer from './slices/bookingSlice';
import filterTabSlice from './slices/filterTabSlice';
import OtpSlice from './slices/OtpSlice';
import signInSlice from './slices/signInSlice';
import locationModalSlice from './slices/locationModal';
import checkoutSlice from './slices/checkoutSlice';
import searchSlice from './slices/searchSlice';
import notificationSlice from './slices/notificationSlice';
import authSlice from './slices/auth/authSlice';
import cartSlice from './eComSlices/cartSlice';
import attributeSlice from './eComSlices/attributeSlice';
import homeSlice from './slices/homeSlice';
import studioslice from './slices/studioslice';
import footerCategory from './slices/footerCategory';
import PackageSlice  from './slices/PackageSlice';
import PackagefilterTabSlice  from './slices/packagefilterSlice';
export default configureStore({
  reducer: {
    booking: bookingReducer,
    package:PackageSlice, 
    signup: signUpSlice,
    signIn: signInSlice,
    filterTab: filterTabSlice,
    Otp: OtpSlice,
    locationModal: locationModalSlice,
    checkout: checkoutSlice,
    search: searchSlice,
    notifications: notificationSlice,
    auth: authSlice,
    home: homeSlice,
    studio: studioslice,
    packagefilter:PackagefilterTabSlice,
    footerCategory: footerCategory,

    // e-commerce slices
    cart: cartSlice,
    attributes: attributeSlice,
  },
});
