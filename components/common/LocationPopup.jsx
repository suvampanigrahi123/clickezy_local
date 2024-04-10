import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch, useSelector } from 'react-redux';
import { setIsModalOpen, setLocation } from '../../redux/slices/locationModal';
import { imageOnError } from '../../utils/errorImage';
import { getLocalStorage, setLocalStorage } from '../../utils/localStore';
import { CheckIcon } from '@heroicons/react/20/solid';
import Drawer from './Drawer';

// import useSWR from 'swr';
function LocationPupup() {
  const dispatch = useDispatch();
  const { isModalOpen, locationList } = useSelector(
    (state) => state.locationModal
  );
  const [active, setActive] = useState(null);
  const closeModal = () => {
    dispatch(setIsModalOpen(false));
  };

  const activeLocation = getLocalStorage('location');

  useEffect(() => {
    setActive(activeLocation?.id);
  }, []);

  const locationChange = (location) => {
    if (activeLocation?.id === location.id) {
      return false;
    }

    const selectedLocation = {
      id: location.id,
      name: location.name,
    };
    setActive(location.id);
    dispatch(setLocation(selectedLocation));
    dispatch(setIsModalOpen(false));
    setLocalStorage('popState', true);
  };
  return (
    <>
      <Drawer
        title="Select your city"
        closeModal={closeModal}
        isOpen={isModalOpen}
      >
        <ul className="w-full my-4 ">
          {locationList?.map((location) => (
            <li
              key={location.id}
              className="py-3 px-6 cursor-pointer hover:bg-black/20 border-t transition-all border-gray-700 flex align-middle items-center rounded-md"
              onClick={() => locationChange(location)}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <LazyLoadImage
                    className="w-12 h-12 rounded-full"
                    src={location?.image}
                    alt="Neil image"
                    width={30}
                    height={30}
                    onError={imageOnError}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg md:text-base  truncate text-white">
                    {location.name}
                  </p>
                </div>
                <div>
                  {active === location.id ? (
                    <CheckIcon className="h-6 w-6 text-green-500" />
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Drawer>
    </>
  );
}

export default LocationPupup;
