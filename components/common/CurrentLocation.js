import { MapPinIcon } from '@heroicons/react/24/solid';
import { setIsModalOpen } from '../../redux/slices/locationModal';
import { useDispatch } from 'react-redux';
import { memo } from 'react';
import useChangeLocation from '../../hooks/useChangeLocation';

function CurrentLocation() {
  const dispatch = useDispatch();

  const currentLocation = useChangeLocation();
  const openModal = (e) => {
    e.preventDefault();
    dispatch(setIsModalOpen(true));
  };
  return (
    <>
      <div
        className="flex justify-start items-center flex-grow relative gap-2 rounded-md cursor-pointer"
        onClick={openModal}
      >
        <MapPinIcon className="w-4 h-4 text-white" />
        <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative">
          <p className="flex-grow-0 flex-shrink-0 text-base md:text-xs text-left text-white md:text-white/[0.64]">
            {currentLocation || 'Select a location'}
          </p>
          <p className="md:hidden flex-grow-0 flex-shrink-0 text-xs text-left text-white/[0.64]">
            Current location
          </p>
          <span id="error" className="text-red-500" />
        </div>
      </div>
    </>
  );
}

export default memo(CurrentLocation);
