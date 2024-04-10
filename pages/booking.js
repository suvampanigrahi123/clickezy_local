import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SecondaryLayout from '../components/layout/SecondaryLayout';
import Header from '../components/common/Header';
import { setAdditionalInfo, setError } from '../redux/slices/bookingSlice';

import ArrowLeftIcon from '../components/common/icons/arrowlefticon';
import { useRouter } from 'next/router';

import BookingCategory from '../components/booking/userBooking/BookingCategory';
import { BookingLocation } from '../components/booking/userBooking/BookingLocation';
import { BookingStudio } from '../components/booking/userBooking/BookingStudio';
import { BookingDateTime } from '../components/booking/userBooking/BookingDateTime';
import { BookingEquipment } from '../components/booking/userBooking/BookingEquipment';

import { getLocalStorage } from '../utils/localStore';
import { setCheckoutData } from '../redux/slices/checkoutSlice';
import BookingPreLoader from '../components/preloader/booking';
import { printLog } from '../helper/printLog';
import { LoadingOutlined } from '@ant-design/icons';
import useSwr from 'swr';
import * as api from '../services/userService';
import AuthProvider from '../components/common/AuthProvider';
import { bookingLabel } from '../constants/labelText';
import PackageBase from '../components/booking/PackageBase/Packagebase';

export default function Booking() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('bookNow');    
  const { cat_id, studio_id, location_id } = router.query;
  const {bookingLocation}=useSelector((state)=>state.booking)
  /**
   * Check if there is any location iD coming from query string then use it else use the location from localstorage
   */
  let locationId = null;
  if (location_id) {
    locationId = location_id;
  } else {
    locationId = getLocalStorage('location')?.id;
  }
  const { data: category, isLoading: categoryLoading } = useSwr(
    bookingLocation?.id && ['/api/user/photographs/category-list', bookingLocation?.id],
    () => api.getCategoryList(bookingLocation?.id)
  );
  const { data: locationLists, locationLoading } = useSwr(
    'getLocationsList',
    () => api.getAllPlaces()
  );

  const [total, setTotal] = useState(0);

  const currentState = useSelector((state) => state.booking);
  /**
   *
   * @returns Form validation and redirect to checkout page
   */
  const handleNext = async () => {
    for (const key in currentState) {
      if (currentState.hasOwnProperty(key)) {
        if (typeof currentState[key] === 'object') {
          if (
            currentState[key]?.name?.toLowerCase() === 'select' ||
            currentState[key]?.studio_name?.toLowerCase() === 'select'
          ) {
            dispatch(setError(key));
            return;
          }
        }
        if (key === 'additionalInfo') {
          continue;
        }
        if (
          currentState[key] === '' ||
          currentState[key] === '0' ||
          currentState[key] === 0 ||
          currentState[key] === '00:00'
        ) {
          dispatch(setError(key));
          return;
        }
      }
    }

    //check if everything is valid add equipment into existing array
    try {
      if (currentState.error === null) {
        setLoading(true);
        const equipment = currentState.defaultEquipments
          ? currentState.defaultEquipments
          : [];
        const item = {
          ...currentState,
          equipment,
        };

        dispatch(setCheckoutData(item));
        router.push('/checkout');
      }
    } catch (error) {
      setLoading(false);
      printLog(error);
    }
  };
  const handleAdditionalInfo = (e) => {
    if (e.target.value === '') {
      dispatch(setAdditionalInfo(''));
    } else {
      dispatch(setAdditionalInfo(e.target.value));
    }
  };

  const goBack = () => {
    const path = router.query;
    if (path?.checkout) {
      router.push('/');
    } else {
      router.back();
    }
  };

  /**
   * *Calculate total price
   */
  useMemo(() => {
    setTotal(0);
    if (
      currentState?.studio &&
      currentState?.studio?.details &&
      currentState.numberOfBookingTime !== '00:00'
    ) {
      if (currentState.bookingTime === 'day') {
        const getPrice =
          (currentState?.studio &&
            currentState?.studio?.details[0]?.price_details?.day_price) ||
          0;

        const price = parseFloat(getPrice).toFixed(2);

        const total = Number(price).toFixed(2);
        setTotal(total);
        return;
      }
      if (currentState.bookingTime === 'hourly') {
        if (currentState.numberOfBookingTime === '00:30') {
          const price =
            (currentState?.studio &&
              currentState?.studio?.details[0]?.price_details
                ?.half_hour_price) ||
            0;
          const total = Math.ceil(Number(price).toFixed(2));
          setTotal(total);
          return;
        }

        const hr_price =
          (currentState?.studio &&
            currentState?.studio?.details[0]?.price_details?.hour_price) ||
          0;
        let getTime = '';
        if (currentState?.numberOfBookingTime) {
          getTime = currentState?.numberOfBookingTime?.split(':');
        } else {
          getTime = '00:00'.split(':');
        }
        const getHour = getTime[0];
        const getMin = getTime[1];
        const getHourMin = getMin / 60;
        const convertedTime = Number(getHour) + Number(getHourMin);

        // Hourly Price
        const getPrice = (Number(hr_price) * parseFloat(convertedTime)).toFixed(
          2
        );

        // Total Price
        const total = Math.ceil(Number(getPrice).toFixed(2));
        setTotal(total);
      }
    }
  }, [
    currentState?.studio,
    currentState.numberOfBookingTime,
    currentState.bookingTime,
  ]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <SecondaryLayout>

      <AuthProvider>
        <Header>
          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 xl:px-44 py-4">
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
              <button onClick={goBack}>
                <ArrowLeftIcon width={24} height={24} />
              </button>
            </div>
            <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
              <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                {bookingLabel.header}
              </p>

            </div>
            
          </div>
          
        </Header>
        <div className='flex justify-center items-center gap-5 mt-6'>
        <TabButton
          label="Book Now"
          active={activeTab === 'bookNow'}
          onClick={() => handleTabChange('bookNow')}
        />
      
        {/* Add a gap here */}
        <div style={{ marginLeft: '10px' }}></div>
      
        <TabButton
          label="Package Base"
          active={activeTab === 'packageBase'}
          onClick={() => handleTabChange('packageBase')}
        />
      </div>
   
      {activeTab === 'bookNow' && (
        <>
        {categoryLoading || locationLoading ? (
          <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 bg-[#19191C]">
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-10 px-6 xl:px-96 pt-6 pb-12 xl:pb-28">
              <BookingPreLoader />
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 bg-[#19191C]">
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-10 px-6 xl:px-96 pt-6 pb-12 xl:pb-28">
              <div className="hidden xl:flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 pt-8 gap-2">
                <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
                  <button onClick={goBack}>
                    <ArrowLeftIcon width={24} height={24} />
                  </button>
                </div>
                <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
                  <p className="flex-grow-0 flex-shrink-0 text-xl font-medium text-left text-white">
                    {bookingLabel.header}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
                <BookingLocation
                  title={bookingLabel.location}
                  locationlist={locationLists}
                  location_id={locationId}
                />
                <BookingCategory
                  title={bookingLabel.category}
                  photocategorylist={category}
                  cat_id={cat_id}
                />
                <BookingStudio
                  title={bookingLabel.studio}
                  studio_id={studio_id}
                />
                <BookingDateTime title={bookingLabel.time} />
                <BookingEquipment title="DefaultEquipments" />
                <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                  <span className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white/[0.64]">
                    {bookingLabel.info}
                  </span>
                  <textarea
                    onChange={handleAdditionalInfo}
                      className="formInput h-[120px] w-[100%] resize-none  text-gray-200"
                      placeholder='Type here....'
                  />
                </label>
              </div>
              <div className="flex flex-col justify-start xl:items-end items-start self-stretch flex-grow-0 flex-shrink-0">
                <button
                  onClick={handleNext}
                  className="btn-primary self-stretch xl:self-auto"
                  disabled={loading}
                >
                  {loading ? (
                    <LoadingOutlined />
                  ) : (
                    `${bookingLabel.button} ${
                      total > 0 ? '(₹' + total + ')' : ''
                    }`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        </>
      )}
     
      {activeTab==='packageBase' && (
        <PackageBase />
      )}
   
      </AuthProvider>
    </SecondaryLayout>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-white ${active ? 'border-b-2 border-white' : ''}`}
    >
      {label}
    </button>
  );
}