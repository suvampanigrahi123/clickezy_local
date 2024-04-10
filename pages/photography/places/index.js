/* eslint-disable react/no-array-index-key */
import Link from 'next/link';
import PrimaryLayout from '../../../components/layout/PrimaryLayout';
import Header from '../../../components/common/Header';
import CurrentLocation from '../../../components/common/CurrentLocation';
import Tabs from '../../../components/common/Tabs';
import SkeletonCard from '../../../components/common/SkeletonCard';
import SwipeCards from '../../../components/photos/SwipeCards';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchIcon from '../../../components/common/icons/search';
import { getLocalStorage } from '../../../utils/localStore';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as api from '../../../services/userService';
import useSwr from 'swr';
import PlacesPreLoader from '../../../components/preloader/places';
import useLocationModal from '../../../hooks/useLocationModal';
import { useState } from 'react';

export default function Places() {
 const [index, setIndex] = useState(0);
 const [places, setPlaces] = useState([]);
  useLocationModal({ willPopupVisible: true });
  /**
   * @todo
   * 1. Add location to the query
   *
   */
  const selectedLocation = getLocalStorage('location');
  const loc =
    useSelector((state) => state.locationModal.location) || selectedLocation;
  useEffect(() => {
    window.addEventListener('storage', () => {});
  }, [loc]);

  /**
   * @todo
   * 1. Add location to the query
   * 2. Add pagination
   */
  const { data, error, isLoading } = useSwr(
    '/api/places/'+index,
    () => api.getPlaceListsPagination(index),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );


  const items = data?.data;
  useEffect(() => {
    if (items?.length) {
      setPlaces([...places, ...items])
    }
  }, [items])
  const getMoreData = () => {
    if (items?.length > 0) {
      setIndex(index + 1);
     }
  };
  return (
    <PrimaryLayout>
      <Header>
        <div className="flex flex-col justify-start items-start self-stretch relative bg-black">
          <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 px-6 md:px-44 pt-6 pb-4">
            <CurrentLocation />
            <Link
              href="/search"
              className="flex justify-start items-center relative gap-2.5"
            >
              <SearchIcon />
            </Link>
          </div>

          {/* FIXME: tab build in a single components and pass the data to tab panel */}
          <Tabs />
        </div>
      </Header>

      {/* Page Body */}
      <div className="hidden md:block px-44 pt-10">
        <div className="flex flex-col justify-start items-start self-stretch relative rounded-lg gap-4">
          <Tabs />
        </div>
      </div>
      {error && <div className="text-white">failed to load</div>}

      {isLoading ? (
        <div className="py-12 px-6 md:block md:px-44 md:pt-10">
          <PlacesPreLoader />
        </div>
      ) : (
        <>
          <InfiniteScroll
            dataLength={places.length} //This is important field to render the next data
            next={getMoreData}
            hasMore={true}
            loader={
              isLoading && (
                <div className="py-12 px-6 md:px-44 md:pt-10">
                  <SkeletonCard />
                </div>
              )
            }
            refreshFunction={() => {}}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
            pullDownToRefreshContent={
              <h3 style={{ textAlign: 'center' }}>Pull down to refresh</h3>
            }
            releaseToRefreshContent={
              <h3 style={{ textAlign: 'center' }}>Release to refresh</h3>
            }
          >
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-12 py-12 md:pb-28 bg-[#19191C]">
              {places?.map((item, index) => {
                return (
                  item?.details?.length > 0 && (
                    <SwipeCards
                      key={index}
                      isPlaces={true}
                      title={item.location_name}
                      id={item?.location_id}
                      locationName={item?.location_name}
                      {...item.details}
                    />
                  )
                );
              })}
            </div>
          </InfiniteScroll>
        </>
      )}
    </PrimaryLayout>
  );
}
