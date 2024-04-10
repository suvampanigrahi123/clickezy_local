import Link from 'next/link';
import PrimaryLayout from '../../../components/layout/PrimaryLayout';
import Header from '../../../components/common/Header';
import CurrentLocation from '../../../components/common/CurrentLocation';
import Tabs from '../../../components/common/Tabs';
import SwipeCards from '../../../components/photos/SwipeCards';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchIcon from '../../../components/common/icons/search';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getLocalStorage } from '../../../utils/localStore';
import * as api from '../../../services/userService';
import useSwr from 'swr';
import PhotographsPreLoader from '../../../components/preloader/photographs';
import useLocationModal from '../../../hooks/useLocationModal';

/**
 *
 * Category page
 */
export default function Category() {
  const [index, setIndex] = useState(0);
  const [category, setCategory] = useState([]);
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
    window.addEventListener('storage', () => {
      setCategory([]);
    });
  }, [loc]);

  /**
   * @todo
   * 1. Add location to the query
   * 2. Add pagination
   */
  const { data, error, isLoading } = useSwr(
    `/api/category/${index}/${loc?.id}`,
    () => api.getCategoryListsPagination(loc?.id, index),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const items = data?.data;
  useEffect(() => {
    if (items?.length > 0) {
      setCategory((prev) => [...prev, ...items]);
    }
  }, [items]);
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
      {category.length === 0 ? (
        <div className="py-12 px-6 md:block md:px-44 md:pt-10">
          <PhotographsPreLoader />
        </div>
      ) : (
        <>
          <InfiniteScroll
            dataLength={category?.length}
            next={getMoreData}
            hasMore={true}
            loader={
              isLoading && (
                <div className="py-12 px-6 md:block md:px-44 md:pt-10">
                  <PhotographsPreLoader />
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
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-12 py-12 bg-[#19191C]">
              {category?.map((item, index) => {
                return (
                  item?.details?.length > 0 && (
                    <SwipeCards
                      key={index}
                      isCategory={true}
                      title={item?.category_name}
                      id={item?.cat_id}
                      catId={item?.cat_id}
                      {...item.details}
                      locationName={loc?.name}
                    />
                  )
                );
              })}
            </div>
          </InfiniteScroll>
        </>
      )}
      {!category?.filter((item) => item?.details?.length > 0)?.length && (
        <span className="flex justify-center items-center w-full h-[30vh] text-white/60 text-xl">
          No category found in selected location
        </span>
      )}
    </PrimaryLayout>
  );
}
