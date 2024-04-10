import Link from 'next/link';
import useSWR from 'swr';
import Header from '../../../components/common/Header';
import * as api from '../../../services/userService';
import { useEffect, useState } from 'react';
import ArrowLeftIcon from '../../../components/common/icons/arrowlefticon';
import ViewDetailsIcon from '../../../components/common/icons/viewdetailsIcon';
import CalenderIcon from '../../../components/common/icons/calendericon';
import LocationSymbol from '../../../components/common/icons/location';
// import ArrowUpIcon from '../../../components/common/icons/arrowup';
import ActiveStatusIcon from '../../../components/common/icons/activestatus';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { imageOnError } from '../../../utils/errorImage';
import AuthProvider from '../../../components/common/AuthProvider';
import MyBookingPreLoader from '../../../components/preloader/mybookings';
import moment from 'moment/moment';
import { getDifference } from '../../../utils/CountdownTimer';
import { Tab } from '@headlessui/react';

import {
  AdjustmentsHorizontalIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ShoppingCartIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import CancelIcon from '../../../components/common/icons/cancel';
// import InfiniteScroll from 'react-infinite-scroll-component';
import { useUser } from '../../../context/UserContext';
import { orderBy } from 'lodash';
import ProfileLayout from '../../../components/layout/ProfileLayout';
import { setSelectedTab } from '../../../redux/slices/PackageSlice';
import { useDispatch, useSelector } from 'react-redux';
import PackageBaseCard from '../../../components/packageBaseDetails/packageBaseList';
import { useRouter } from 'next/router';
// import { useRouter } from 'next/router';

function classNames(...classes) {
  
  return classes.filter(Boolean).join(' ');
}

export default function DashboardMyBooking() {
  // const router = useRouter();
  const { userId: id } = useUser();
  const [isOpen, setisOpen] = useState(false);
  const {selectedTab}=useSelector((state)=>state.package)
  const dispatch=useDispatch()
  // const [myBookings, setMyBookings] = useState([]);
  const [index] = useState(0);
  const [apiKey, setApiKey] = useState({
    status: {
      id: '',
    },
    time: {
      id: '',
    },
  });
  const [selectedFilterData, setselectedFilterData] = useState({
    status: {
      id: '',
    },
    time: {
      id: '',
    },
  });

  const size = 50;
  const { data, isLoading } = useSWR(
    id && [
      '/api/user_booking_details',
      apiKey?.status?.id,
      apiKey?.time?.id,
      index,
    ],
    () =>
      api.getUserBookingDetails(
        id,
        apiKey?.status?.id,
        apiKey?.time?.id,
        index,
        size
      )
  );
  const router=useRouter();
  const books = data?.data;
  const items = books
  console.log('items',items);
  // const totalItems = items && items.length > 0 ? items.length : 0;
  // useEffect(() => {
  //   if (items?.length > 0) {
  //     setMyBookings(items);
  //   }
  //   // if (items?.length > 0 && isFilter === false) {
  //   //   setMyBookings((prev) => [...prev, ...items]);
  //   // }
  // }, [items]);

  // FIXME: need to fix the infinite scroll
  // const getMoreData = () => {
  //   if (items?.length > 0) {
  //     setIndex(index + 1);
  //   }
  // };

  const applyFilter = () => {
    setisOpen(false);
    setApiKey(selectedFilterData);
  };

  const booking_statuses = [
    { id: 'completed', value: 'completed' },
    { id: 'started', value: 'upcoming' },
    { id: 'progress', value: 'on progress' },
    { id: 'cancelled', value: 'cancelled' },
    { id: 'upload', value: 'upload' },
    { id: 'customize', value: 'retouch request' },
  ];

  const booking_time = [
    { id: 30, value: 'Last 30 days' },
    { id: 60, value: '2 month ago' },
    { id: 90, value: '3 month ago' },
    { id: 180, value: '6 month ago' },
  ];

  const handleSelectBookingStatus = (item) => {
    if (selectedFilterData.status.id === item.id) {
      setselectedFilterData({
        ...selectedFilterData,
        status: {
          id: '',
        },
      });
    } else {
      setselectedFilterData({
        ...selectedFilterData,
        status: item,
      });
    }
  };

  const handleSelectBookingTime = (item) => {
    if (selectedFilterData.time.id === item.id) {
      setselectedFilterData({
        ...selectedFilterData,
        time: {
          id: '',
        },
      });
    } else {
      setselectedFilterData({
        ...selectedFilterData,
        time: item,
      });
    }
  };
  const { type } = router.query;


  useEffect(()=>{
    if(type==='package_base'){
      dispatch(setSelectedTab(1))
    }else{
      dispatch(setSelectedTab(0))
    }
  },[type])

  console.log('selectedTab',selectedTab);

  const closeModal = () => {
    setisOpen(false);
    setselectedFilterData(apiKey);
  };

  const clearFilter = () => {
    if (apiKey.status.id || apiKey.time.id) {
      setisOpen(false);
    }
    setselectedFilterData({
      status: {
        id: '',
      },
      time: {
        id: '',
      },
    });
    setApiKey({
      status: {
        id: '',
      },
      time: {
        id: '',
      },
    });
  };
console.log('type',type);
  const { data:packageData, isLoading:packageBaseLoading } = useSWR(
    id && [
      '/get-package-booking',
      apiKey?.status?.id,
      index,
    ],
    () =>
      api.getUserPackageList(
        id,
      )
  );

  console.log('data',data);
const packageBaseDetails=packageData?.data?.package_bookings

  return (
    <>
      <ProfileLayout>
        <AuthProvider>
          <header className="flex flex-col justify-start items-start bg-[#010201] md:bg-transparent md:border-b md:border-white/10 min-h-[64px] md:min-h-0">
            <div className="flex flex-col justify-start items-start self-stretch">
              <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 pl-5 md:px-0 py-4 md:pt-0">
             
                <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
                <Tab.Group
                selectedIndex={selectedTab}
                onChange={(e)=>dispatch(setSelectedTab(e))}
              >
                <Tab.List className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2 px-6 py-2 md:p-0 bg-[#141417] md:bg-transparent md:border-b md:border-white/10">
             
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        'flex justify-center items-center flex-grow md:flex-grow-0 flex-shrink-0 self-stretch rounded-full md:rounded-none md:text-base md:border-b-2 py-2.5 md:px-5 text-sm font-medium leading-5 outline-none',
                        selected
                          ? 'bg-blue-700/40 md:bg-transparent md:border-white text-white'
                          :'bg-zinc-800 md:bg-transparent md:border-white/0 text-blue-100 md:text-white/40 hover:bg-blue-700/20 md:hover:bg-transparent hover:text-white'
                      )
                    }
                  >
                    Booking
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        'flex justify-center items-center flex-grow md:flex-grow-0 flex-shrink-0 self-stretch rounded-full md:rounded-none md:text-base md:border-b-2 py-2.5 md:px-5 text-sm font-medium leading-5 outline-none',
                        selected
                          ? 'bg-blue-700/40 md:bg-transparent md:border-white text-white'
                          : 'bg-zinc-800 md:bg-transparent md:border-white/0 text-blue-100 md:text-white/40 hover:bg-blue-700/20 md:hover:bg-transparent hover:text-white'
                      )
                    }
                  >
                    Package Base
                  </Tab>
            </Tab.List>
              {/* Page Body */}
          <Tab.Panels style={{width:'100%'}}>
          <Tab.Panel>
                <div className="flex flex-col justify-start items-start self-stretch gap-4 pb-4 w-full">
                <div className='flex w-full justify-between'>
                <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
                <Link href={'/user'} className="flex md:hidden">
                  <ArrowLeftIcon height={24} width={24} />
                </Link>
                <CalendarDaysIcon className="hidden md:flex w-6 h-6 text-white" />
              </div>
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-4 relative">
              {!isLoading && data !== null && (
                <div
                  className="flex flex-row justify-center items-center gap-1 cursor-pointer"
                  onClick={() => setisOpen(true)}
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5 text-white" />
                  <p className="text-white">Filter</p>
                </div>
              )}
              {/* <Link
              href="booking"
              className="btn-primary self-stretch text-xs rounded-xl font-medium px-4 py-2"
            >
              Hire Us
            </Link> */}
            </div>
                </div>
         {isLoading || data === null ? (
           <MyBookingPreLoader />
         ) : items?.length > 0 ? (
           <div className="flex flex-col justify-around w-full gap-3">
             {items?.map((item, index) => (
               <div
                 className="flex flex-col justify-start items-start self-stretch gap-3 px-6 md:px-0"
                 key={index}
               >
                 <BookingCard item={item} />
               </div>
             ))}
           </div>
         ) : (
           <div className="flex self-stretch justify-center py-20 text-[#9b9191]">
             No bookings found
           </div>
         )}
       </div>
          </Tab.Panel>
          <Tab.Panel>
                <div className="flex flex-col justify-start items-start self-stretch gap-4 mt-4 pb-4 w-full">
         {packageBaseLoading || packageBaseDetails === null ? (
           <MyBookingPreLoader />
         ) : packageBaseDetails?.length > 0 ? (
           <div className="flex flex-col justify-around w-full gap-3 ">
             {packageBaseDetails?.map((item, index) => (
               <div
                 className="flex flex-col justify-start items-start self-stretch gap-3 px-6 md:px-4"
                 key={index}
               >
                 <PackageBaseCard   item={item} />
               </div>
             ))}
           </div>
         ) : (
           <div className="flex self-stretch justify-center py-20 text-[#9b9191]">
             No packages found
           </div>
         )}
       </div>
          </Tab.Panel>
       </Tab.Panels>
            </Tab.Group>
                </div>
               
              </div>
            </div>
          </header>

        
       

          <>
            {/* <div className="flex justify-between w-full px-4">
            {totalItems && (apiKey?.status?.id || apiKey?.time?.id) && (
              <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-white/80">
                {totalItems} results found
              </p>
            )}
            {!isLoading && data !== null && (
              <div
                className="cursor-pointer flex justify-end w-full items-center "
                onClick={() => setisOpen(true)}
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-white/40" />
                <p className="text-white">Filter</p>
              </div>
            )}
          </div> */}
            {/* {item.length > 0 && (
            <>
              <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2 py-6">
                <ArrowUpIcon />
                <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-[#767676]">
                  Drag up to load more
                </p>
              </div>
            </>
          )} */}
          </>
        </AuthProvider>
      </ProfileLayout>

      {/* Filters Modal */}
      <Transition
        show={isOpen}
        // as={Fragment}
        className="fixed inset-y-0 w-screen min-h-screen mx-auto z-50"
      >
        <Transition.Child
          className="fixed inset-y-0 inset-x-0 m-auto max-w-screen bg-[#00000084] backdrop-blur-sm z-50"
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        />
        <Transition.Child
          className="fixed bottom-0 md:top-0 inset-x-0 m-auto max-w-screen md:max-w-md min-h-screen md:min-h-[90vh] max-h-screen md:max-h-[90vh] shadow-lg overflow-auto md:rounded-2xl text-base sm:text-sm z-50"
          enter="transition ease-in-out duration-300 transform"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
        >
          <div className="flex flex-col justify-start items-start self-stretch flex-grow relative bg-[#202124] min-h-[inherit]">
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 bg-[#202124] md:bg-black/40 sticky top-0 z-50 p-4">
              <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative overflow-hidden">
                <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-white/80 capitalize">
                  Filter by
                </p>
                <div className="flex justify-between items-center gap-4">
                  {
                    <button
                      className={`flex text-xs font-medium text-center ${
                        selectedFilterData.status.id ||
                        selectedFilterData.time.id
                          ? 'text-blue-500'
                          : 'text-white/40'
                      } capitalize`}
                      onClick={clearFilter}
                      disabled={
                        selectedFilterData.status.id ||
                        selectedFilterData.time.id
                          ? ''
                          : 'disable'
                      }
                    >
                      clear Fliter
                    </button>
                  }
                  <button onClick={closeModal} className="flex">
                    <XMarkIcon className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-grow p-4 gap-8">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative overflow-hidden">
                  <p className="flex-grow-0 flex-shrink-0 text-lg font-medium text-center text-white capitalize">
                    Booking Status
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {booking_statuses?.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectBookingStatus(item)}
                      className={`flex justify-start items-center flex-grow-0 flex-shrink-0 relative select-none py-2 px-4 capitalize rounded-full border border-[#ffffff10] 
                       ${
                         selectedFilterData?.status?.id === item.id
                           ? 'bg-[#3f83f8] text-white hover:bg-[#3f83f8] hover:text-white'
                           : 'bg-white/5 text-white/50 hover:bg-[#19191b] hover:text-white'
                       }
                        `}
                      disabled={selectedFilterData.status.id === item.id}
                    >
                      <span>{item.value}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative overflow-hidden">
                  <p className="flex-grow-0 flex-shrink-0 text-lg font-medium text-center text-white capitalize">
                    Booking Time
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {booking_time?.map((item, index) => (
                    <button
                      onClick={() => handleSelectBookingTime(item)}
                      key={index}
                      className={`flex justify-start items-center flex-grow-0 flex-shrink-0 relative select-none py-2 px-4 capitalize rounded-full border border-[#ffffff10] 
                       ${
                         selectedFilterData.time?.id === item.id
                           ? 'bg-[#3f83f8] text-white hover:bg-[#3f83f8] hover:text-white'
                           : 'bg-white/5 text-white/50 hover:bg-[#19191b] hover:text-white'
                       }
                        `}
                      disabled={selectedFilterData.time?.id === item.id}
                    >
                      <span>{item.value}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 bg-[#202124] sticky bottom-0 z-50 p-4 md:border-t md:border-white/10">
              <button
                onClick={applyFilter}
                className="btn-primary self-stretch"
                disabled={
                  selectedFilterData?.status?.id || selectedFilterData?.time?.id
                    ? ''
                    : 'disable'
                }
                style={
                  selectedFilterData?.status?.id || selectedFilterData?.time?.id
                    ? {}
                    : { backgroundColor: 'gray' }
                }
              >
                Apply
              </button>
            </div>
          </div>
        </Transition.Child>
      </Transition>
    </>
  );
}

const BookingCard = ({ item }) => {
  const [timeleft, settimeLeft] = useState('');

  useEffect(() => {
    let timeInterval;
    if (
      item &&
      item.status === 'started' &&
      getDifference(item?.date, item?.from_time).day < 1 &&
      getDifference(item?.date, item?.from_time).milliseconds > 0
    ) {
      timeInterval = setInterval(() => {
        const { timeLeft } = getDifference(item?.date, item?.from_time);
        settimeLeft(`${timeLeft} sec left`);
      }, 1000);
    }
    return () => {
      clearInterval(timeInterval);
    };
  }, [item]);

  const formatDates = (date) => {
    const d = date?.split('/')[0];
    const m = date?.split('/')[1];
    const y = date?.split('/')[2];
    const newDate = `${m}-${d}-${y}`;
    return moment(newDate, 'MM-DD-YYYY').format('MMMM DD, YYYY');
  };
  return (
    <Link
      href={`my_booking/${item?.booking_id}`}
      className="flex flex-col justify-start items-center self-stretch bg-white hover:bg-slate-50 rounded-md group transition-all"
    >
      <div className="flex flex-col md:flex-row justify-start md:justify-between items-start self-stretch flex-grow-0 flex-shrink-0">
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 p-4 gap-3">
          <div className="flex md:hidden justify-between md:justify-start md:gap-2 items-center self-stretch flex-grow-0 flex-shrink-0 relative">
            <p className="flex-grow-0 flex-shrink-0 text-xs font-normal md:font-medium text-left text-[#202124]">
              {'Order placed on ' + item?.order_placed_date}
            </p>
            <div className="flex gap-1 items-center">
              {/* <p className="hidden md:flex text-sm">Details</p> */}
              {/* <ViewDetailsIcon /> */}
              <ChevronRightIcon className="w-3 h-3 text-black/75" />
            </div>
          </div>
          <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
            <div className="w-24 h-28 aspect-w-16 aspect-h-4 flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative">
              <LazyLoadImage
                src={item?.category_image}
                width={100}
                height={100}
                className="w-full h-full object-center object-cover bg-black rounded-md"
                alt=""
                onError={imageOnError}
              />
            </div>
            <div className="flex flex-col justify-between items-start self-stretch flex-grow">
              <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-0.5">
                <p className="flex-grow-0 flex-shrink-0 text-sm md:text-xs font-medium text-left capitalize text-[#202124]">
                  {item?.category_name}
                </p>
                <p className="flex-grow-0 flex-shrink-0 text-base md:text-sm font-semibold text-left text-[#202124]">
                  {item?.studio_name}
                </p>
                <p className="flex-grow-0 flex-shrink-0 font-medium text-left">
                  <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#202124]">
                    ₹ {item?.hour_price}{' '}
                  </span>
                  <span className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-[#202124]/[0.64]">
                    / hour
                  </span>
                </p>
              </div>
              <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 gap-2">
                {item?.status?.toLowerCase() === 'completed' ? (
                  <>
                    <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1 pl-2 pr-2.5 py-1.5 rounded-full bg-[#b8ffb8] h-6">
                      <div className="flex w-[6px] h-[6px] bg-[#008000] rounded-full"></div>
                      <p className="text-[10px] leading-[10px] font-semibold text-left capitalize text-[#008000]">
                        {item?.status}
                      </p>
                    </div>
                  </>
                ) : item?.status?.toLowerCase() === 'upcoming' ? (
                  <>
                    <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1 pl-2 pr-2.5 py-1.5 rounded-full bg-[#dadcff] h-6">
                      <div className="flex w-[6px] h-[6px] bg-[#0000ff] rounded-full"></div>
                      <p className="text-[10px] leading-[10px] font-semibold text-left capitalize text-[#0000ff]">
                        {item?.status}
                      </p>
                    </div>
                  </>
                ) : item?.status?.toLowerCase() === 'progress' ? (
                  <>
                    <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1 pl-2 pr-2.5 py-1.5 rounded-full bg-[#dadcff] h-6">
                      {/* <ActiveStatusIcon /> */}
                      <div className="flex w-[6px] h-[6px] bg-[#0000ff] rounded-full"></div>
                      <p className="text-[10px] leading-[10px] font-semibold text-left capitalize text-[#0000ff]">
                        {item?.status}
                      </p>
                    </div>
                  </>
                ) : item?.status?.toLowerCase() === 'cancelled' ? (
                  <>
                    <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1 pl-2 pr-2.5 py-1.5 rounded-full bg-[#f1d0d0] h-6">
                      <div className="flex w-[6px] h-[6px] bg-[#da1212] rounded-full"></div>
                      <p className="text-[10px] leading-[10px] font-semibold text-left capitalize text-[#da1212]">
                        {item?.status}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1 pl-2 pr-2.5 py-1.5 rounded-full bg-[#dadcff] h-6">
                      <div className="flex w-[6px] h-[6px] bg-[#0000ff] rounded-full"></div>
                      <p className="text-[10px] leading-[10px] font-semibold text-left capitalize text-[#0000ff]">
                        {item?.status === 'started' ? (
                          <span>
                            {getDifference(item?.date, item?.from_time)
                              .milliseconds > 0
                              ? getDifference(item?.date, item?.from_time)
                                  ?.day < 1
                                ? timeleft
                                : `${
                                    getDifference(item?.date, item?.from_time)
                                      ?.day
                                  } day left`
                              : 'started'}
                          </span>
                        ) : (
                          item?.status
                        )}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-start md:justify-center items-start self-stretch flex-grow-0 flex-shrink-0 p-4 gap-2 border-t border-black/10 md:border-0 md:w-3/5 relative">
          <div className="flex flex-col justify-start items-start gap-2">
            <div className="hidden md:flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
              <ShoppingCartIcon className="w-4 h-4 text-black/90" />
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1">
                <div className="flex justify-start items-center">
                  <p className="flex-grow-0 flex-shrink-0 text-xs font-normal md:font-medium text-left text-[#202124]">
                    {'Order placed on ' + item?.order_placed_date}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
              <CalendarDaysIcon className="w-4 h-4 text-black/90" />
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1">
                <div className="flex justify-start items-center">
                  <p className="flex-grow-0 flex-shrink-0 text-xs font-normal md:font-medium text-left text-[#202124]">
                    {formatDates(item?.date)}
                  </p>
                </div>
                <div className="flex justify-start items-center">
                  <p className="flex-grow-0 flex-shrink-0 text-xs font-normal text-left text-[#202124]">
                    &nbsp; • &nbsp;
                  </p>
                </div>
                <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1">
                  <p className="flex-grow-0 flex-shrink-0 text-xs font-normal md:font-medium text-left text-[#202124]">
                    {moment(item?.from_time, 'HH:mm:ss').format('hh:mm A')}
                  </p>
                  <p className="flex-grow-0 flex-shrink-0 text-xs font-normal md:font-medium text-left text-[#202124]">
                    to
                  </p>
                  {item?.to_time && (
                    <p className="flex-grow-0 flex-shrink-0 text-xs font-normal md:font-medium text-left text-[#202124]">
                      {/*FIXME:- Currently We are not getting to_date that's why i'm using from_date in to_time */}
                      {moment(item?.to_time, 'HH:mm:ss').format('hh:mm A')}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
              <MapPinIcon className="w-4 h-4 text-black/90" />
              <p className="max-w-[250px] flex-grow-0 flex-shrink-0 text-xs font-normal md:font-medium text-left text-[#202124] truncate">
                {item?.location}, {item?.booking_address}
              </p>
            </div>
          </div>
          <div className="hidden md:flex justify-end items-center w-full absolute bottom-4 right-4">
            <div className="flex items-center gap-1 bg-black/5 rounded-md pl-3 pr-2 py-1.5">
              <p className="text-xs text-black font-medium">Details</p>
              <ChevronRightIcon className="w-3 h-3 text-black/60" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
