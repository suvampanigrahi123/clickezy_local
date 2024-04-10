import Link from 'next/link';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import PrimaryLayout from '../../../components/layout/PrimaryLayout';
import Header from '../../../components/common/Header';
import TitleBox from '../../../components/common/TitleBox';
import * as api from '../../../services/userService';
import ImageCard from '../../../components/photos/ImageCard';
import Studio from '../../../components/photos/Studio';
import FilterCategory from '../../../components/common/FilterCategory';
import SearchIcon from '../../../components/common/icons/search';
import { setFilterName } from '../../../redux/slices/filterTabSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment, useEffect, useState } from 'react';
import { uniqBy } from 'lodash';
import Arrowlefticon from '../../../components/common/icons/arrowlefticon';
import CurrentLocation from '../../../components/common/CurrentLocation';
// import { Gallery } from 'react-photoswipe-gallery';
import { getLocalStorage } from '../../../utils/localStore';
import InfiniteScroll from 'react-infinite-scroll-component';
import CategoryDetailsSkeleton, {
  CategoryBoxSkeleton,
} from '../../../components/preloader/categorydetails';
import { useUser } from '../../../context/UserContext';
import useLocationModal from '../../../hooks/useLocationModal';

export default function PhotosDetails() {
  const [index] = useState(0);
  const [category, setCategory] = useState([]);
  const { userId } = useUser();

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

  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  const { data: filterList } = useSWR(
    loc?.id && ['/api/user/photographs/category-list', loc?.id],
    () => api.getCategoryList(loc?.id)
  );

  const { data, isLoading, mutate } = useSWR(
    id && ['/api/photography/category', id, loc?.id, index],
    () => api.getPhotoList_byId(id, loc?.id, index, userId)
  );
  const items = data?.data;
  useEffect(() => {
    if (items?.length > 0) {
      setCategory((prev) => [prev, ...items]);
    }
  }, [items]);
  const getMoreData = () => {
    // if (items?.length > 0) {
    //   setIndex(index + 1);
    // }
  };

  /**
   * 1. Reset the category when filter changes
   */
  const { filter } = useSelector((state) => state.filterTab);
  useEffect(() => {
    window.addEventListener('filterChange', () => {
      setCategory([]);
    });
  }, [filter]);

  /**
   * @returns
   * Set the filter name
   */
  useEffect(() => {
    if (items) {
      items[0]?.category_name &&
        dispatch(setFilterName(items[0]?.category_name));
    }
  }, [items]);
  const studioList = items && uniqBy(items[0]?.details, 'studio_id');
  return (
    <PrimaryLayout>
      <Header>
        <div className="flex flex-col justify-start items-start self-stretch relative bg-black">
          <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 px-6 pt-6 pb-4">
            <CurrentLocation />
            <Link
              href="/search"
              className="flex justify-start items-center relative gap-2.5"
            >
              <SearchIcon />
            </Link>
          </div>
          <FilterCategory category={filterList} url="/photography/category" />
        </div>
      </Header>

      {/* Page Body */}
      <div className="hidden md:flex flex-col flex-grow self-stretch">
        <FilterCategory category={filterList} url="/photography/category" />
      </div>
      {category.length === 0 ? (
        <CategoryDetailsSkeleton />
      ) : (
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-8 py-8 md:px-44 bg-[#19191C]">
          {items && (
            <>
              <div className="hidden md:flex flex-col self-stretch flex-grow py-4 bg-[#19191C] border-b border-white/5 sticky top-[72px] z-10">
                <TitleBox>
                  <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1 gap-3">
                    <button
                      onClick={() => router.back()}
                      className="hidden md:flex"
                    >
                      <Arrowlefticon className="w-4 h-4" />
                    </button>
                    <p className="flex-grow-0 flex-shrink-0 text-2xl font-medium text-white capitalize">
                      {items[0]?.category_name}
                    </p>
                  </div>
                  <Link
                    href={`/booking?cat_id=${id}`}
                    className="btn-primary text-xs rounded-xl font-medium px-4 py-2 md:bg-blue-700/30 md:border md:border-blue-700"
                  >
                    Book Now
                  </Link>
                </TitleBox>
              </div>

              {/* Studio */}
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 overflow-x-auto scrollbar-thin scrollbar-track-current scrollbar-thumb-slate-600 scrollbar-corner-black">
                <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-4">
                  {studioList?.map((item, index) => (
                    <Studio key={index} {...item} cp_id={id} />
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                <div className="flex flex-col self-stretch flex-grow">
                  <InfiniteScroll
                    dataLength={category?.length}
                    next={getMoreData}
                    hasMore={true}
                    loader={
                      isLoading && (
                        <div className="py-12 px-6 md:px-16">
                          <CategoryBoxSkeleton />
                        </div>
                      )
                    }
                    refreshFunction={() => {}}
                    pullDownToRefresh
                    pullDownToRefreshThreshold={50}
                    pullDownToRefreshContent={
                      <h3 style={{ textAlign: 'center' }}>
                        Pull down to refresh
                      </h3>
                    }
                    releaseToRefreshContent={
                      <h3 style={{ textAlign: 'center' }}>
                        Release to refresh
                      </h3>
                    }
                  >
                    <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0">
                      {/* <Gallery options={{ zoom: false, loop: false }}> */}
                      {category?.map((cat, index) => (
                        <Fragment key={index * 2}>
                          {cat?.details?.map((item, index) => (
                            <ImageCard
                              key={index}
                              {...item}
                              mutate={mutate}
                              id={id}
                            />
                          ))}
                        </Fragment>
                      ))}
                      {/* </Gallery> */}
                    </div>
                  </InfiniteScroll>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </PrimaryLayout>
  );
}

// export async function getServerSideProps() {
//   const res = await api.getCategoryList(1);
//   const data = await res.data;
//   return { props: { data } };
// }
