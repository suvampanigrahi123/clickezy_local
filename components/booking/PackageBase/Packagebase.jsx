import { useRouter } from 'next/router';
import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SecondaryLayout from '../../layout/SecondaryLayout';
import AuthProvider from '../../common/AuthProvider';
import useSwr from 'swr';
import ArrowLeftIcon from '../../../components/common/icons/arrowlefticon';
import BookingPreLoader from '../../preloader/booking';
import { LoadingOutlined } from '@ant-design/icons';
import { getLocalStorage } from '../../../utils/localStore';
import { PackpageBaseLabel, bookingLabel } from '../../../constants/labelText';
import { PackageLocation } from './PackageLocation';
import PackageCategory from './PackageCategory';
import { PackageStudio } from './PackageBaseStudio';
import * as api from '../../../services/userService';
import { PackageBookingDate } from './PackageBaseDate';
import toast from 'react-hot-toast';
import { useUser } from '../../../context/UserContext';

export default function PackageBase() {
  const router = useRouter();
  const { userId: user } = useUser();

  const [loading, setLoading] = useState(false);
  const { cat_id, studio_id, location_id } = router.query;
  const { packageLocation, packageFor, packageDate, studio } = useSelector(
    (state) => state.package
  );
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
    packageLocation?.id && ['/package-base-categories', packageLocation?.id],
    () => api.GetPackageCategoryList(packageLocation?.id)
  );
  const { data: locationLists, locationLoading } = useSwr(
    'getPackageAllPlaces',
    () => api.getPackageAllPlaces()
  );
  const [total, setTotal] = useState(0);

  /**
   *
   * @returns Form validation
   */
  const handlePackageNext = async () => {
    if (
      !packageDate ||
      !packageFor.id ||
      !packageLocation.id ||
      !studio?.package_id
    ) {
      toast.error('please fill the value');
      return;
    }

    setLoading(true);

    try {
      const formdata = new FormData();
      formdata.append('booking_date', packageDate);
      formdata.append('package_id', studio?.package_id);
      formdata.append('user_id', user);
      const response = await api.savePackage(formdata);
      if (response?.data?.status === 'success') {
        toast.success('Package saved successfully:');
        router.push('/user/my_booking?type=package_base');
      } else {
        toast.error('Something went wrong');
      }
      setLoading(false);
    } catch (error) {
      toast.error('Error saving package:', error);
      setLoading(false);
    }
  };

  /**
   * *Calculate total price
   */
  // useMemo(() => {
  //   setTotal(0);
  //   if (
  //     currentState?.studio &&
  //     currentState?.studio?.details &&
  //     currentState.numberOfBookingTime !== '00:00'
  //   ) {
  //     if (currentState.bookingTime === 'day') {
  //       const getPrice =
  //         (currentState?.studio &&
  //           currentState?.studio?.details[0]?.price_details?.day_price) ||
  //         0;

  //       const price = parseFloat(getPrice).toFixed(2);

  //       const total = Number(price).toFixed(2);
  //       setTotal(total);
  //       return;
  //     }
  //     if (currentState.bookingTime === 'hourly') {
  //       if (currentState.numberOfBookingTime === '00:30') {
  //         const price =
  //           (currentState?.studio &&
  //             currentState?.studio?.details[0]?.price_details
  //               ?.half_hour_price) ||
  //           0;
  //         const total = Math.ceil(Number(price).toFixed(2));
  //         setTotal(total);
  //         return;
  //       }

  //       const hr_price =
  //         (currentState?.studio &&
  //           currentState?.studio?.details[0]?.price_details?.hour_price) ||
  //         0;
  //       let getTime = '';
  //       if (currentState?.numberOfBookingTime) {
  //         getTime = currentState?.numberOfBookingTime?.split(':');
  //       } else {
  //         getTime = '00:00'.split(':');
  //       }
  //       const getHour = getTime[0];
  //       const getMin = getTime[1];
  //       const getHourMin = getMin / 60;
  //       const convertedTime = Number(getHour) + Number(getHourMin);

  //       // Hourly Price
  //       const getPrice = (Number(hr_price) * parseFloat(convertedTime)).toFixed(
  //         2
  //       );

  //       // Total Price
  //       const total = Math.ceil(Number(getPrice).toFixed(2));
  //       setTotal(total);
  //     }
  //   }
  // }, [
  //   currentState?.studio,
  //   currentState.numberOfBookingTime,
  //   currentState.bookingTime,
  // ]);
  return (
    <SecondaryLayout>
      <AuthProvider>
        {/* Page Body */}
        {categoryLoading || locationLoading ? (
          <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 bg-[#19191C]">
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-10 px-6 md:px-96  pb-12 md:pb-28">
              <BookingPreLoader />
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 bg-[#19191C]">
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-10 px-6 md:px-96 pb-12 md:pb-28">
              <div className="hidden md:flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2">
                <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
                  <button>
                    <ArrowLeftIcon width={24} height={24} />
                  </button>
                </div>
                <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
                  <p className="flex-grow-0 flex-shrink-0 text-xl font-medium text-left text-white">
                    {PackpageBaseLabel.header}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
                <PackageLocation
                  title={PackpageBaseLabel.location}
                  locationlist={locationLists}
                  location_id={locationId}
                />
                <PackageCategory
                  title={PackpageBaseLabel.category}
                  photocategorylist={category}
                  cat_id={cat_id}
                />
                <PackageStudio
                  title={bookingLabel.studio}
                  studio_id={studio_id}
                />
                <PackageBookingDate title={bookingLabel.time} />
              </div>
              <div className="flex flex-col justify-start md:items-end items-start self-stretch flex-grow-0 flex-shrink-0">
                <button
                  onClick={handlePackageNext}
                  className="btn-primary self-stretch md:self-auto"
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
      </AuthProvider>
    </SecondaryLayout>
  );
}
