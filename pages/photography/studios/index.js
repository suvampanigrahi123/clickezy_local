import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroll-component';
import PrimaryLayout from '../../../components/layout/PrimaryLayout';
import Header from '../../../components/common/Header';
import CurrentLocation from '../../../components/common/CurrentLocation';
import Tabs from '../../../components/common/Tabs';
import ImageCard from '../../../components/photos/SwipeCards';
import SearchIcon from '../../../components/common/icons/search';
import { getLocalStorage } from '../../../utils/localStore';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import * as api from '../../../services/userService';
import useSwr from 'swr';
import { StudioPreLoader } from '../../../components/preloader/studio';
import useLocationModal from '../../../hooks/useLocationModal';
import { motion } from 'framer-motion';


const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
/**
 *
 * Studio page
 */
export default function Studios() {
  const [index, setIndex] = useState(0);
  const [studio, setStudio] = useState([]);

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
      setStudio([]);
    });
  }, [loc]);

  /**
   * @todo
   * 1. Add location to the query
   * 2. Add pagination
   */
  const { data, error, isLoading } = useSwr(
    `/photographs/global-search-photographer/${loc?.id}`,
    () => api.getStudioListsPagination(loc?.id),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const items = data?.data;
  useEffect(() => {
    if (items?.length > 0) {
      setStudio((prev) => [...prev, ...items]);
    }
  }, [items]);
  // const getMoreData = () => {
  //   if (items?.length > 0) {
  //     setIndex(index + 1);
  //   }
  // };
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

      {studio.length === 0 && isLoading ? (
        <div className="py-12 px-6 md:block md:px-44 md:pt-10">
          <StudioPreLoader />
        </div>
      ) : (
        <>
          <InfiniteScroll
            dataLength={studio.length} //This is important field to render the next data
            // next={getMoreData}
            hasMore={true}
            refreshFunction={() => { }}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
            pullDownToRefreshContent={
              <h3 style={{ textAlign: 'center' }}>Pull down to refresh</h3>
            }
            releaseToRefreshContent={
              <h3 style={{ textAlign: 'center' }}>Release to refresh</h3>
            }
            loader={
              isLoading && (
                <div className="py-12 px-6 md:px-44 md:pt-10">
                  <StudioPreLoader />
                </div>
              )
            }
          >
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-12 py-10 md:pt-12 md:pb-28 bg-[#19191C]">
              {studio?.map((item, index) => {
                return (
                  item?.details && (
                    <motion.div
                      variants={variants}
                      initial="hidden"
                      animate="visible"
                      transition={{
                        delay: index * 0.20,
                        ease: 'easeInOut',
                        duration: 0.5,
                      }}
                      key={index}
                      className='w-full'>
                      <ImageCard key={index} data={item} isStudio={true} />
                    </motion.div>
                  )
                );
              })}
            </div>
          </InfiniteScroll>
        </>
      )}
      {!items?.filter((item) => item?.details?.length > 0)?.length && (
        <span className="flex justify-center items-center w-full pb-10  text-white/60 text-xl">
          No more studio found
        </span>
      )}
    </PrimaryLayout>
  );
}
