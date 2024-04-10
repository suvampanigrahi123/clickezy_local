import Link from 'next/link';
import {
    AdjustmentsHorizontalIcon,
    MapPinIcon,
    CalendarDaysIcon,
    ShoppingCartIcon,
    ChevronRightIcon,
    XMarkIcon,
  } from '@heroicons/react/24/outline';
  import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useEffect, useState } from 'react';
import { imageOnError } from '../../utils/errorImage';
import { getDifference } from '../../utils/CountdownTimer';
import moment from 'moment';
import * as api from '../../services/userService';
import useSWR from 'swr';
import { useUser } from '../../context/UserContext';

const PackageBaseCard = ({ item }) => {
    const { userId: id } = useUser();
    const [timeleft, settimeLeft] = useState('');
  
    const [index] = useState(0);
  const [apiKey, setApiKey] = useState({
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
      '/get-package-booking',
      apiKey?.status?.id,
      index,
    ],
    () =>
      api.getUserPackageList(
        id,
        apiKey?.status?.id,
        index,
        size
      )
  );

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
        href={`packagebasebooking/${item?.package_booking_id}`}
        className="flex flex-col justify-start items-center self-stretch bg-white hover:bg-slate-50 rounded-md group transition-all"
      >
        <div className="flex flex-col md:flex-row justify-start md:justify-between items-start self-stretch flex-grow-0 flex-shrink-0">
          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 p-4 gap-3">
            <div className="flex md:hidden justify-between md:justify-start md:gap-2 items-center self-stretch flex-grow-0 flex-shrink-0 relative">
              <p className="flex-grow-0 flex-shrink-0 text-xs font-normal md:font-medium text-left text-[#202124]">
              
             {'Order placed on ' + formatDates(item?.created_at)}
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
                  
                </div>
                <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 gap-2">
                  {item?.booking_status?.toLowerCase() === 'completed' ? (
                    <>
                      <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1 pl-2 pr-2.5 py-1.5 rounded-full bg-[#b8ffb8] h-6">
                        <div className="flex w-[6px] h-[6px] bg-[#008000] rounded-full"></div>
                        <p className="text-[10px] leading-[10px] font-semibold text-left capitalize text-[#008000]">
                          {item?.booking_status}
                        </p>
                      </div>
                    </>
                  ) : item?.booking_status?.toLowerCase() === 'confirmed' ? (
                    <>
                      <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1 pl-2 pr-2.5 py-1.5 rounded-full bg-[#dadcff] h-6">
                        <div className="flex w-[6px] h-[6px] bg-[#0000ff] rounded-full"></div>
                        <p className="text-[10px] leading-[10px] font-semibold text-left capitalize text-[#0000ff]">
                          {item?.booking_status}
                        </p>
                      </div>
                    </>
                  ) : item?.booking_status?.toLowerCase() === 'booked' ? (
                    <>
                      <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1 pl-2 pr-2.5 py-1.5 rounded-full bg-[#dadcff] h-6">
                        {/* <ActiveStatusIcon /> */}
                        <div className="flex w-[6px] h-[6px] bg-[#0000ff] rounded-full"></div>
                        <p className="text-[10px] leading-[10px] font-semibold text-left capitalize text-[#0000ff]">
                          {item?.booking_status}
                        </p>
                      </div>
                    </>
                  ) : item?.booking_status?.toLowerCase() === 'cancelled' ? (
                    <>
                      <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1 pl-2 pr-2.5 py-1.5 rounded-full bg-[#f1d0d0] h-6">
                        <div className="flex w-[6px] h-[6px] bg-[#da1212] rounded-full"></div>
                        <p className="text-[10px] leading-[10px] font-semibold text-left capitalize text-[#da1212]">
                          {item?.booking_status}
                        </p>
                      </div>
                    </>
                  ) : null}
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
                     {'Order placed on ' + formatDates(item?.created_at)}

                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
                <CalendarDaysIcon className="w-4 h-4 text-black/90" />
                <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1">
                  <div className="flex justify-start items-center">
                    <p className="flex-grow-0 flex-shrink-0 text-xs font-normal md:font-medium text-left text-[#202124]">
                    {item?.booking_date}
                    </p>
                  </div>
                  
             
                </div>
              </div>
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
                <MapPinIcon className="w-4 h-4 text-black/90" />
                <p className="max-w-[250px] flex-grow-0 flex-shrink-0 text-xs font-normal md:font-medium text-left text-[#202124] truncate">
                  {item?.location_name}
                </p>
              </div>
            </div>
           
          </div>
        </div>
      </Link>
    );
  };
  export default PackageBaseCard