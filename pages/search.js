import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  XCircleIcon,
} from '@heroicons/react/20/solid';
import SecondaryLayout from '../components/layout/SecondaryLayout';
import Header from '../components/common/Header';
import * as api from '../services/userService';
import StudioRating from '../components/StudioRating';
import { useDispatch, useSelector } from 'react-redux';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useRouter } from 'next/router';
import SearchFilterList from '../components/common/SearchFilterList';
import { imageOnError } from '../utils/errorImage';
import { getLocalStorage } from '../utils/localStore';
import {
  resetPrice,
  setCategory,
  setEquipment,
  setItems,
  setLocation,
  setMaxPrice,
  setMinPrice,
  setPreviousLocation,
} from '../redux/slices/searchSlice';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SearchFilterSidebar from '../components/common/SearchFilterSidebar';
import SearchPreloader from '../components/preloader/search';
import InfiniteScroll from 'react-infinite-scroll-component';

function StudioName({ title }) {
  return (
    <p className="flex-grow-0 flex-shrink-0 text-base md:text-xl font-medium text-left text-white capitalize">
      {title ? `${title}` : 'Studio Name'}
    </p>
  );
}

function MediaBox({ data, studio_id }) {
  return (
    <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[142px] relative">
      <div className="w-full aspect-w-16 aspect-h-14 h-[164px]">
        <Link
          href={`/photography/studios/studio-info?cat=${data.category_id}&stu=${studio_id}`}
          className="w-[142px] h-[164px] aspect-w-16 aspect-h-14"
        >
          <LazyLoadImage
            src={data.thumb || '/164-164.png'}
            className="object-center object-cover bg-black rounded-lg"
            alt="image"
            onError={imageOnError}
          />
        </Link>
      </div>
    </div>
  );
}

function ItemRow({ data, searchMode }) {
  return (
    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4 md:border-b md:border-white/10 md:last:border-0 md:py-10">
      {searchMode === 'local' && (
        <>
          <Link
            href={`/photography/studios/${data?.studio_id}`}
            className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative px-6 md:px-0 md:gap-6"
          >
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2 md:gap-4">
              <div className="w-10 h-10">
                <LazyLoadImage
                  src={data.studio_img || '/164-164.png'}
                  className="w-full h-full object-cover bg-black rounded-full"
                  width={40}
                  height={40}
                  alt=""
                  onError={imageOnError}
                />
              </div>
              <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative">
                <StudioName title={data?.studio_name} />
                {data?.studio_rating > 0 && (
                  <StudioRating studio_rating={data?.studio_rating} />
                )}
              </div>
            </div>
            <div className="flex justify-center items-center gap-1">
              <p className="hidden md:flex text-xs text-white">Details</p>
              <ChevronRightIcon className="w-4 h-4 text-white/40 md:text-white" />
            </div>
          </Link>
          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 md:p-0 overflow-x-auto">
            <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 gap-2 md:gap-4">
              {data?.details?.slice(0, 5)?.map((item, index) => (
                <MediaBox data={item} key={index} studio_id={data?.studio_id} />
              ))}
            </div>
          </div>
        </>
      )}
      {searchMode === 'global' && (
        <>
          <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
            <LazyLoadImage
              src={data.image || '/164-164.png'}
              className="object-cover bg-black rounded-sm"
              width={140}
              height={140}
              alt=""
              onError={imageOnError}
            />
            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative">
              <StudioName title={data?.name} />
              <p className="text-white">{data.type}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [index, setIndex] = useState(0)
  const [totalElement, settotalElement] = useState(1);
  const {items, category, location, minPrice, maxPrice, equipment,previousLocation } = useSelector(
    (state) => state.search
  );
  const [isLoading, setisLoading] = useState(false);
  // check location from redux and local storage if not then set the default location
  useEffect(() => {
    if (location) {
    async function fetchData() {
      setisLoading(true);
      const isFilter = {
        equipment: equipment ? equipment?.equipment_id : null,
        minPrice: minPrice,
        maxPrice: maxPrice,
        category: category ? category?.id : null,
        location: location && location?.id,
        page: 0,
        search:searchQuery
      };
      const response = await api.getSearchResult(isFilter);
      if (response && response.data) {
        dispatch(setItems(response.data))
        settotalElement(response?.total_elements);
        setisLoading(false);
        setIndex(0);
        dispatch(setPreviousLocation(location))
      } else {
        setisLoading(false);
      }
      }
      if (location?.id !== previousLocation?.id) { 
        fetchData();
      }
  }
    // fetch data when keyword change
  }, [location, category, minPrice, maxPrice]);
  useEffect(() => {
    if (location&&index>0) {
    async function fetchData() {
      setisLoading(true);
      const isFilter = {
        equipment: equipment ? equipment?.equipment_id : null,
        minPrice: minPrice,
        maxPrice: maxPrice,
        category: category ? category?.id : null,
        location: location && location?.id,
        page: index,
        search:searchQuery
      };
      const response = await api.getSearchResult(isFilter);
      if (response && response.data) {
        dispatch(setItems([...items,...response.data]))
        settotalElement(response?.total_pages);
        setisLoading(false);
      } else {
        setisLoading(false);
      }
    }
    fetchData();
  }
    // fetch data when Pagination
  }, [index]);

  // const filteredData = items?.filter((item) => {
  //   if (searchQuery) {
  //     return item?.studio_name
  //       ?.toLowerCase()
  //       .includes(searchQuery.toLowerCase());
  //   }
  //   return item;
  // });

  // useEffect(() => {
  //   async function fetchDataByKeyWord() {
  //     const key = '.*' + searchQuery.split(' ').join('.*') + '.*';
  //     const data = await api.getSearchResultByKeyword(
  //       location && location?.id,
  //       key
  //     );
  //   }

  //   if (searchQuery.length >= 3) {
  //     fetchDataByKeyWord();
  //   }
  // }, []);

  const clearSearchQuery = (e) => {
    e.preventDefault();
    setSearchQuery('');
  };
  const handleSearch = async(e) => {
    e.preventDefault();
    const { value } = e.target;
    setSearchQuery(value);
  };


  const handleMore = () => {
    if (items?.length < totalElement&&!isLoading) {
      setIndex(Number(index) + 1);
    }
  }


  return (
    <SecondaryLayout>
      <Header>
        <div className="flex flex-col justify-start items-start self-stretch relative gap-4 py-4 bg-[#010201]">
          <div className="flex justify-between items-center self-stretch px-4">
            {/* Search Input */}

            <SearchInputBox
              onChange={handleSearch}
              value={searchQuery}
              clearSearchQuery={clearSearchQuery}
            />
          </div>

          <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 px-4 overflow-x-auto">
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-1">
              <SearchFilterList />
              {location?.name && (
                <div className="flex justify-start items-center h-7 relative gap-2 pl-3 pr-1.5 rounded-[6px] bg-[#19191c] text-white">
                  <span className="w-max text-[13px]">{location?.name}</span>
                  <XCircleIcon
                    className="h-4 w-4 text-white/40 cursor-pointer"
                    onClick={() => {
                      dispatch(setLocation(null))
                    }}
                  />
                </div>
              )}
              {category?.name && (
                <div className="flex justify-start items-center h-7 relative gap-2 pl-3 pr-1.5 rounded-[6px] bg-[#19191c] text-white">
                  <span className="w-max text-[13px]">{category?.name}</span>
                  <XCircleIcon
                    className="h-4 w-4 text-white/40 cursor-pointer"
                    onClick={() => dispatch(setCategory(null))}
                  />
                </div>
              )}
              {equipment?.name && (
                <div className="flex justify-start items-center h-7 relative gap-2 pl-3 pr-1.5 rounded-[6px] bg-[#19191c] text-white">
                  <span className="w-max text-[13px]">{equipment?.name}</span>
                  <XCircleIcon
                    className="h-4 w-4 text-white/40 cursor-pointer"
                    onClick={() => dispatch(setEquipment(null))}
                  />
                </div>
              )}
              {minPrice || maxPrice ? (
                <div className="flex justify-start items-center h-7 relative gap-2 pl-3 pr-1.5 rounded-[6px] bg-[#19191c] text-white">
                  <span className="w-max text-[13px]">
                    {maxPrice && `Max-Price ${maxPrice}`}
                  </span>

                  <XCircleIcon
                    className="h-4 w-4 text-white/40 cursor-pointer"
                    onClick={() => {
                      dispatch(resetPrice(null));
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Header>

      {/* Page Body */}

      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 pb-6 bg-[#19191C] min-h-[inherit] md:pr-16 md:pb-0">
        <div className="flex w-full">
          <div className="hidden md:block">
            <SearchFilterSidebar   />
          </div>
          <div className="w-full p-4 md:ml-[2rem]">
            <div className="hidden md:block">
              <div className="flex items-center w-full relative">
                <SearchInputBox
                  onChange={handleSearch}
                  value={searchQuery}
                  clearSearchQuery={clearSearchQuery}
                />
              </div>
            </div>
            {(isLoading&&!items?.length) ? (
              <div className="pb-6 bg-[#19191C] min-h-[inherit] md:pr-16 md:pb-0 w-full overflow-hidden">
                <SearchPreloader />
              </div>
            ) : (
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-8 md:gap-0">
                <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left px-6 md:p-0 md:mt-8">
                  <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white/[0.64]">
                    Showing :{' '}
                  </span>
                  <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">
                    {/* {searchQuery.length < 3 &&
                    filteredData?.filter((item) => item?.details?.length > 0)
                      .length !== 0
                      ? filteredData?.filter(
                          (item) => item?.details?.length > 0
                        )?.length
                      : searchResult?.filter(
                          (item) => item?.details?.length > 0
                        )?.length}{' '} */}
                      {totalElement}
                    results
                  </span>
                </p>
                {/* {searchQuery.length < 3 && filteredData.length !== 0
                  ? filteredData?.map(
                      (item, index) =>
                        item?.details?.length > 0 && (
                          <ItemRow data={item} key={index} searchMode="local" />
                        )
                    )
                  : searchResult?.map(
                      (item, index) =>
                        item?.details?.length > 0 && (
                          <ItemRow data={item} key={index} searchMode="local" />
                        )
                    )} */}
                    <InfiniteScroll
                dataLength={items?.length} //This is important field to render the next data
                next={handleMore}
                hasMore={true}
                refreshFunction={() => {}}
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
                    <div className="py-12 px-6 md:px-16">loading...</div>
                  )
                }
                  >   
                  {
                    items?.map(
                      (item, index) =>
                        item?.details?.length > 0 && (
                          <ItemRow data={item} key={index} searchMode={'local'}  />
                        )
                    )
                  }
              </InfiniteScroll>
              </div>
            )}
          </div>
        </div>
      </div>
    </SecondaryLayout>
  );
}

function SearchInputBox({ onChange, value, clearSearchQuery }) {
  return (
    <div className="flex items-center w-full relative">
      <span className="absolute left-2">
        <MagnifyingGlassIcon className="h-5 w-5 text-white" />
      </span>
      <input
        className="placeholder:text-slate-400 placeholder:text-sm block bg-white/0 text-white w-full border border-white/20 rounded-md h-10 pr-3 py-4 pl-9 shadow-sm focus:outline-none focus:border-transparent"
        placeholder="Type to search..."
        type="search"
        autoComplete="none"
        aria-autocomplete="none"
        value={value}
        onChange={onChange}
        autoFocus={false}
      />

      {value?.length > 0 && (
        <button className="absolute right-2" onClick={clearSearchQuery}>
          <XCircleIcon className="h-5 w-5 text-white/40" />
        </button>
      )}
    </div>
  );
}
