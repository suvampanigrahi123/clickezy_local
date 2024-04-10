'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocationList } from '../redux/slices/locationModal';

function useCurrentLocation() {
  const dispatch = useDispatch();
  const [currentLocation, setCurrentLocation] = useState(null);
  // get current location
  const location = useSelector((state) => state.locationModal.location);
  if (!location) {
    const selectedLocation = getLocalStorage('location');
    dispatch(setLocationList(selectedLocation));
  }
  return { currentLocation };
}

export default useCurrentLocation;
