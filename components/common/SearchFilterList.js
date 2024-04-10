import { Transition } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSWR from 'swr';
import * as api from '../../services/userService';
import {
  setCategory,
  setLocation,
  setMaxPrice,
  setMinPrice,
} from '../../redux/slices/searchSlice';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/20/solid';
import { getLocalStorage } from '../../utils/localStore';
import CancelIcon from './icons/cancel';
import { Slider } from 'antd';

function FilterList() {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const selectedLocation = getLocalStorage('location');
  const { location, category, minPrice, maxPrice } = useSelector(
    (state) => state.search
  );
  const [filter, setFilter] = useState({
    location: location,
    category: category,
    minPrice: null,
    maxPrice: null,
  });

  useEffect(() => {
    if (minPrice == null && maxPrice == null) {
      setFilter({
        ...filter,
        maxPrice: null,
        minPrice: null,
      });
    }
    if (category == null) {
      setFilter({
        ...filter,
        category: null,
      });
    }
    if (location == null) {
      setFilter({
        ...filter,
        location: null,
      });
    }
  }, [minPrice, maxPrice, location, category]);

  const defaultPrice = [minPrice ? minPrice : 0, maxPrice ? maxPrice : 2000];
  /**
   * get all location list
   */
  const { data: placesList } = useSWR('/photographs/locations', () =>
    api.getAllPlaces()
  );
  /**
   * get all category list
   */
  const { data: categoryList } = useSWR(
    selectedLocation && [
      '/api/user/photographs/category-list',
      selectedLocation?.id,
    ],
    () => api.getCategoryList(selectedLocation?.id)
  );

  useEffect(() => {
    dispatch(setLocation(selectedLocation));
  }, []);

  const applyFilter = () => {
    setIsOpen(false);
    dispatch(setLocation(filter.location));
    dispatch(setCategory(filter.category));
    dispatch(setMaxPrice(filter.maxPrice));
    dispatch(setMinPrice(filter.minPrice));
  };

  const handleCategoryFilter = (item) => {
    setFilter({
      ...filter,
      category: item,
    });
  };
  const handleLocationFilter = (item) => {
    setFilter({
      ...filter,
      location: item,
    });
  };
  const marks = {
    0: {
      style: {
        color: '#f50',
      },
      label: <strong>0</strong>,
    },
    2000: {
      style: {
        color: '#f50',
      },
      label: <strong>2000</strong>,
    },
  };

  const handlePriceFilter = (value) => {
    setFilter({
      ...filter,
      minPrice: value[0],
      maxPrice: value[1],
    });
  };

  const handleClosePopup = () => {
    setFilter({
      location: location,
      category: category,
      minPrice: null,
      maxPrice: null,
    });
    setIsOpen(false);
  };
  return (
    <>
      <div className="relative w-full">
        <button onClick={() => setIsOpen(true)}>
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-white/40" />
        </button>
        <Transition
          show={isOpen}
          // as={Fragment}
          className="fixed inset-y-0 max-w-sm min-h-screen mx-auto z-50"
        >
          <Transition.Child
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-y-0 inset-x-0 m-auto max-w-screen bg-[#00000084] backdrop-blur-sm z-40"
          />
          <Transition.Child
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
            className="fixed bottom-0 inset-x-0 m-auto max-w-screen min-h-screen max-h-screen  text-base shadow-lg overflow-auto ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50"
          >
            <div className="flex flex-col justify-start items-start self-stretch flex-grow relative bg-[#202124] min-h-[inherit]">
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 bg-[#202124] sticky top-0 z-50 p-4">
                <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative overflow-hidden">
                  <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-white/80 capitalize">
                    Filter by
                  </p>
                  <button onClick={handleClosePopup}>
                    <CancelIcon className="h-5 w-5 text-white/40" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col flex-grow gap-8">
                <div className="flex flex-col px-4 gap-2">
                  <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative overflow-hidden">
                    <p className="flex-grow-0 flex-shrink-0 text-lg font-medium text-center text-white capitalize">
                      Locations
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {placesList?.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleLocationFilter(item)}
                        className={`relative cursor-default select-none py-2 px-4 flex justify-start items-center  rounded-full flex-grow-0 flex-shrink-0 border "
                       ${
                         filter?.location?.id === item.id
                           ? 'bg-[#3f83f8] text-[#fff] hover:bg-[#3f83f8] hover:text-white'
                           : 'border-[#ffffff10] bg-white/5 text-white/50 hover:bg-[#19191b] hover:text-white'
                       }
                        `}
                        disabled={location?.id === item.id}
                      >
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col px-4 gap-2">
                  <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative overflow-hidden">
                    <p className="flex-grow-0 flex-shrink-0 text-lg font-medium text-center text-white capitalize">
                      category
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {categoryList?.data?.map((item, index) => (
                      <button
                        onClick={() => handleCategoryFilter(item)}
                        key={index}
                        className={`relative cursor-default select-none py-2 px-4 flex justify-start items-center  rounded-full flex-grow-0 flex-shrink-0 border "
                       ${
                         filter?.category?.id === item.id
                           ? 'bg-[#3f83f8] text-[#fff] hover:bg-[#3f83f8] hover:text-white'
                           : 'border-[#ffffff10] bg-white/5 text-white/50 hover:bg-[#19191b] hover:text-white'
                       }
                        `}
                        disabled={category?.id === item.id}
                      >
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col px-4 gap-2">
                  <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative overflow-hidden">
                    <p className="flex-grow-0 flex-shrink-0 text-lg font-medium text-center text-white capitalize">
                      Price
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 p-2">
                    <Slider
                      range
                      min={0}
                      max={2000}
                      defaultValue={defaultPrice}
                      marks={marks}
                      className="w-full"
                      onChange={handlePriceFilter}
                    />
                  </div>
                  {/* <div className="flex flex-wrap gap-2">
                    {equipmentList?.data?.data?.map((item, index) => (
                      <button
                        onClick={() => {
                          dispatch(setEquipment(item));
                        }}
                        key={index}
                        className="relative cursor-default select-none py-2 px-4 flex justify-start items-center flex-grow-0 flex-shrink-0 border border-[#ffffff10] rounded-full bg-white/5 text-white/50 hover:bg-[#19191b] hover:text-white"
                      >
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </div> */}
                </div>
              </div>
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 bg-[#202124] sticky bottom-0 z-50 p-4">
                <button
                  onClick={applyFilter}
                  className="btn-primary self-stretch"
                >
                  Apply
                </button>
              </div>
            </div>
          </Transition.Child>
        </Transition>
      </div>
    </>
  );
}

export default FilterList;
