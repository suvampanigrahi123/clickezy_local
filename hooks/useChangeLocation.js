import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation } from '../redux/slices/locationModal';
import { getLocalStorage } from '../utils/localStore';

const useChangeLocation = () => {
  const dispatch = useDispatch();
  const { location } = useSelector((state) => state.locationModal);

  useEffect(() => {
    const selectedLocation = getLocalStorage('location');
    if (!location) {
      dispatch(setLocation(selectedLocation));
    }
  }, []);

  return location?.name;
};

export default useChangeLocation;
