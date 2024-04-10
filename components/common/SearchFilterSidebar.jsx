import { XCircleIcon } from '@heroicons/react/20/solid';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLocalStorage } from '../../utils/localStore';
import useSWR from 'swr';
import * as api from '../../services/userService';
import {
  clearFilter,
  setCategory,
  setLocation,
} from '../../redux/slices/searchSlice';
import { useRouter } from 'next/router';

const SearchFilterSidebar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { searchCategory, searchLocation } = router.query;
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
    if (location) {
      setFilter({
        ...filter,
        location: location,
      });
    }
    if (category) {
      setFilter({
        ...filter,
        category: category,
      });
    }
  }, [minPrice, maxPrice, location, category]);
  // const defaultPrice = [minPrice ? minPrice : 0, maxPrice ? maxPrice : 2000];
  /**
   * get all location list
   */
  const { data: placesList } = useSWR(
    '/photographs/locations',
    () => api.getAllPlaces(),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  /**
   * get all category list
   */
  const { data: categoryList } = useSWR(
    location?.id && ['/api/user/photographs/categories', location?.id],
    () => api.getCategoryList(location?.id)
  );
  const selectedLocation = getLocalStorage('location');

  useEffect(() => {
    if (placesList) {
      if ((searchLocation || searchCategory) && !location?.id) {
        if (searchLocation) {
          dispatch(
            setLocation(
              placesList?.find((place) => place?.id === searchLocation)
            )
          );
        }
        if (searchCategory && categoryList?.data) {
          dispatch(
            setCategory(
              categoryList?.data?.find((cat) => cat?.id === searchCategory)
            )
          );
        }
      } else {
        dispatch(setLocation(location ? location : selectedLocation));
        dispatch(setCategory(category));
      }
    }
  }, [searchLocation, searchCategory, placesList, categoryList]);

  const handleCategoryFilter = (item) => {
    setFilter({
      ...filter,
      category: item,
    });
    dispatch(setCategory(item));
    if (item) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          searchCategory: item?.id,
        },
      });
    }
  };

  const handleLocationFilter = (item) => {
    setFilter({
      ...filter,
      location: item,
    });
    dispatch(setLocation(item));
    if (item) {
      const location_id = item.id;
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          searchLocation: location_id,
        },
      });
    }
  };

  const handleClearFilter = () => {
    setFilter({
      location: '',
      category: '',
      minPrice: null,
      maxPrice: null,
    });
    dispatch(clearFilter());
    router.push({
      pathname: router.pathname,
      query: {},
    });
  };

  return (
    <>
      <aside
        id="default-sidebar"
        className="sticky top-14 z-40 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-6 overflow-y-auto bg-black w-[20rem]">
          <div className="flex flex-col w-full gap-5 pb-10">
            <div className="w-full flex justify-between items-center text-white px-3">
              <span className="text-lg">Filter by</span>
              <span
                className="text-xs cursor-pointer hover:bg-[#19191c] p-1 px-2 rounded-full"
                onClick={handleClearFilter}
              >
                Clear All
              </span>
            </div>
            <div className="w-full flex flex-1 mt-5 gap-2 flex-wrap">
              {location?.name && (
                <div className="flex justify-start items-center h-10 relative gap-2 pl-3 pr-1.5 rounded-full bg-[#19191c] text-white">
                  <span className="w-max text-[13px]">{location?.name}</span>
                  <XCircleIcon
                    className="h-4 w-4 text-white/40 cursor-pointer"
                    onClick={() => {
                      dispatch(setLocation(selectedLocation));
                      if (searchCategory) {
                        router.push({
                          pathname: router.pathname,
                          query: {
                            searchCategory,
                          },
                        });
                      } else {
                        router.push({
                          pathname: router.pathname,
                          query: {},
                        });
                      }
                    }}
                  />
                </div>
              )}
              {category?.name && (
                <div className="flex justify-start items-center h-10 relative gap-2 pl-3 pr-1.5 rounded-full bg-[#19191c] text-white">
                  <span className="w-max text-[13px]">{category?.name}</span>
                  <XCircleIcon
                    className="h-4 w-4 text-white/40 cursor-pointer"
                    onClick={() => {
                      dispatch(setCategory(null));
                      if (searchLocation) {
                        router.push({
                          pathname: router.pathname,
                          query: {
                            searchLocation,
                          },
                        });
                      } else {
                        router.push({
                          pathname: router.pathname,
                          query: {},
                        });
                      }
                    }}
                  />
                </div>
              )}
            </div>

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
                    className={`relative cursor-pointer select-none py-2 px-4 flex justify-start items-center  rounded-full flex-grow-0 flex-shrink-0"
                       ${
                         filter?.location?.id === item.id
                           ? 'bg-[#1d2533] text-[#fff] '
                           : 'bg-white/5 text-white/50 hover:bg-[#19191b] hover:text-white'
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
                    className={`relative cursor-pointer select-none py-2 px-4 flex justify-start items-center  rounded-full flex-grow-0 flex-shrink-0"
                       ${
                         filter?.category?.id === item.id
                           ? 'bg-[#1d2533] text-[#fff] '
                           : 'bg-white/5 text-white/50 hover:bg-[#19191b] hover:text-white'
                       }
                        `}
                    disabled={category?.id === item.id}
                  >
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* <div className="flex flex-col px-4 gap-2">
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
              
            </div> */}
          </div>
        </div>
      </aside>
    </>
  );
};

export default SearchFilterSidebar;
