import { useSelector } from 'react-redux';
import SecondaryLayout from '../components/layout/SecondaryLayout';
import Header from '../components/common/Header';
import ArrowLeftIcon from '../components/common/icons/arrowlefticon';
import ArrowRightIcon from '../components/common/icons/arrowrighticon';
import * as api from '../services/userService';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useEffect, useId, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { initializeRazorpay } from '../utils/rozorpay';
import Select from 'react-select';
import InputField from '../components/form-element/InputField';
import { LoadingOutlined } from '@ant-design/icons';
import { convertTimeFormat } from '../helper/convertTimeFormat';
import { Format12HourTime } from '../utils/FotmatTime';
import { useUser } from '../context/UserContext';
import { checkOutLabel } from '../constants/labelText';
import { printLog } from '../helper/printLog';
import { COMMON } from '../constants/const';

function Listbox(prop) {
  return (
    <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-2 px-4 bg-white/0 hover:bg-white/5">
      <p className="flex-grow-0 flex-shrink-0 text-[13px] text-right text-white/60">
        {prop.title}
      </p>
      <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
        {prop.value}
      </p>
    </div>
  );
}

export default function BookingDetails() {
  const router = useRouter();
  const { userId: user } = useUser();

  const checkoutData = useSelector((state) => state.checkout.checkoutData);
  const [price, setPrice] = useState(0);
  // const [gst, setGst] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingAddress, setBookingAddress] = useState('');
  const [landMark, setLandMark] = useState('');
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState({
    isApplied: false,
    couponCode: '',
    couponAmount: 0,
  });
  const [couponCode, setCouponCode] = useState('');
  const [disableAppliedButton, setDisableAppliedButton] = useState(false);
  useEffect(() => {
    if (!checkoutData || Object.keys(checkoutData)?.length === 0) {
      router.push('/booking');
    }
  }, [checkoutData]);

  /**
   * @param {*} data
   * @returns location data
   */
  const { data: psLocations } = useSWR(
    checkoutData &&
    checkoutData.bookingLocation &&
    '/photoshoot-location?location_id' + checkoutData?.bookingLocation.id,
    () => api.getNearByLocation(checkoutData?.bookingLocation.id)
  );

  const duration =
    checkoutData && checkoutData?.numberOfBookingTime?.split(':');
  let durationHour = 0;
  const hour = duration && duration[0];
  const min = duration && duration[1];
  if (hour === '00' && min === '30') {
    durationHour = min;
  } else {
    durationHour = +hour;
  }
  /**
   * @param {*} data
   * @returns no of photoshoot going to take
   */

  const { data: noOfPhoto } = useSWR(
    checkoutData.bookingFor &&
    durationHour &&
    '/no_of_photo?location_id' +
    checkoutData?.bookingFor.id +
    '&duration=' +
    durationHour,
    () => api.getPhotosWillTake(checkoutData?.bookingFor.id, durationHour)
  );

  /**
   *  Payment Method
   * @param {*} e
   */
  const paymentHandler = async () => {
    if (!bookingAddress || bookingAddress === '') {
      toast.error('Please select booking address');
      setLoading(false);
      return;
    }
    if (!landMark || landMark === '') {
      toast.error('Enter land mark');
      setLoading(false);
      return;
    }
    if (!landMark.length > 100) {
      toast.error('Landmark is too big');
      setLoading(false);
      return;
    }
    payment();
  };

  // eslint-disable-next-line no-unused-vars
  const payment = async () => {
    const res = await initializeRazorpay();
    if (!res) {
      alert('Razorpay SDK Failed to load');
      return;
    }
    // Make API call to the serverless API
    // * Prepare payload for create order and convert into Form Data
    const orderPayload = {
      total_amount: totalPrice,
      user_id: user,
      payable_amount: totalPrice,
    };

    if (appliedCoupon && appliedCoupon.couponCode && appliedCoupon.couponAmount) {
      orderPayload.total_amount = Number(Number(totalPrice) + Number(appliedCoupon.couponAmount)).toFixed(2)
      orderPayload.coupon = appliedCoupon.couponCode;
    }

    const formData = new FormData();
    for (const key in orderPayload) {
      formData.append(key, orderPayload[key]);
    }
    try {
      const data = await api.paymentCreate(formData);
      if (data?.data?.status === 'success') {
        const paymentInfo = JSON.parse(data.headers['x-order_id']);
        var options = {
          key: process.env.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
          name: 'ClickEzy',
          currency: paymentInfo.currency,
          amount: paymentInfo.amount,
          order_id: paymentInfo.id,
          handler: async function (response) {
            setLoading(true);
            /**
             * Payload for save booking information
             */
            const data = filterBookingDetails({
              ...checkoutData,
              bookingAddress,
              landMark,
              noOfPhoto: noOfPhoto?.data?.no_of_photos || 0,
            });
            const bookingResponse = await api.saveBooking(data);
            try {
              if (bookingResponse && bookingResponse?.status_code === 200) {
                /**
                 * call after booking api is successful
                 */
                const payload = preparePaymentInfo(paymentInfo, bookingResponse, checkoutData);
                console.log(payload);
                const savePaymentInfo = await api.savePaymentInfo(payload);
                if (savePaymentInfo.status === 'SUCCESS') {
                  toast.success('Booking successfully');
                  router.replace('/user/my_booking');
                } else {
                  toast.error('Something went wrong');
                  setLoading(false);
                }
              } else {
                toast.error('Something went wrong');
                setLoading(false);
              }
            } catch (error) {
              toast.error('Something went wrong');
              printLog(error);
              setLoading(false);
            }
          },
          prefill: {
            name: 'Akash Pradhan',
            email: 'akash@gmail.com',
            contact: '7504587810',
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (error) {
      toast.error('Something went wrong')
      console.log(error);
    }
  };
  const preparePaymentInfo = (paymentInfo, bookingResponse, bookingPageData) => {
    const original_price = Number(totalPrice);
    const effectivePrice = original_price * 0.02;
    const clickezy_price = (10 / 100) * original_price;
    const amount_to_be_paid =
      original_price - (effectivePrice + clickezy_price);

    //return payload
    const payload = {
      user_id: user,
      studio_id: bookingPageData?.studio?.studio_id,
      original_price: original_price, //amount paid by user
      price: effectivePrice, // platform fee
      clickezy_price: clickezy_price,  // clickezy commission 
      amount_to_be_paid: amount_to_be_paid, // vendor will get
      other_info: bookingPageData?.additionalInfo,
      gateway_transaction_id: paymentInfo.id,
      booking_id: bookingResponse?.data?.booking_id,
    };

    return payload;
  };

  /**
   *  Prepare payload for save boking
   * @param {*} data 
   * @returns 
   */
  const filterBookingDetails = (data) => {
    let bookingTime = '';
    if (data && data?.numberOfBookingTime) {
      bookingTime = data?.numberOfBookingTime?.split(':');
    }
    const bookingType =
      data && data?.numberOfBookingTime === '00:30'
        ? 'half_hour'
        : data.bookingTime;


    const payload = {
      category_id: data.bookingFor.id,
      studio_id: data.studio.studio_id,
      location_id: data.bookingLocation.id,
      equipment_ids: data.equipment.map((item) => item.equipment_id),
      booking_type: bookingType,
      booking_date: data.bookingDate,
      from_time: data.bookingTimeFrom,
      to_time: data.bookingTimeTo,
      note: data.additionalInfo,
      booking_address: data.bookingAddress,
      user_id: user,
      landmark: data.landMark,
      total_amount: totalPrice,
      hour: parseInt(bookingTime[0]),
      minute: parseInt(bookingTime[1]),
      no_of_photos: parseInt(data.noOfPhoto),
      sub_location_id: psLocations?.data?.find(
        (loca) => loca?.location === bookingAddress
      )?.id,
    };

    if (appliedCoupon && appliedCoupon.couponCode && appliedCoupon.couponAmount) {
      payload.coupon_code = appliedCoupon.couponCode;
      payload.coupon_amount = appliedCoupon.couponAmount;
      payload.total_amount = Number(Number(totalPrice) + Number(appliedCoupon.couponAmount)).toFixed(2)
    }


    return payload

  };

  /**
   * Check total Price
   */

  useMemo(() => {
    if (checkoutData.bookingTime === 'day') {
      // Day Price
      const getPrice =
        (checkoutData?.studio &&
          checkoutData?.studio?.details[0]?.price_details?.day_price) ||
        0;

      setPrice(parseFloat(getPrice).toFixed(2));
      // Gst Price
      // const gstPrice = Number((getPrice * 5) / 100).toFixed(2);
      // setGst(gstPrice);
      // Total Price
      // const total = (Number(getPrice) + Number(gstPrice)).toFixed(2);
      const total = Number(getPrice).toFixed(2);
      //* Check coupon code applied or not
      if (appliedCoupon) {
        const payableAmount = Math.ceil(
          total - Number(appliedCoupon.couponAmount)
        ).toFixed(2);
        setTotalPrice(payableAmount);
        return;
      }
      setTotalPrice(total);
      return getPrice;
    }
    if (checkoutData.bookingTime === 'hourly') {
      if (checkoutData.numberOfBookingTime === '00:30') {
        // 30 Min Price
        const getPrice =
          (checkoutData?.studio &&
            checkoutData?.studio?.details[0]?.price_details?.half_hour_price) ||
          0;
        setPrice(parseFloat(getPrice).toFixed(2));
        const total = Math.ceil(Number(getPrice)).toFixed(2);

        //* Check coupon code applied or not
        if (appliedCoupon) {
          const payableAmount = Math.ceil(
            total - Number(appliedCoupon.couponAmount)
          ).toFixed(2);
          setTotalPrice(payableAmount);
          return;
        }
        setTotalPrice(total);
        return getPrice;
      }

      const hr_rice =
        (checkoutData?.studio &&
          checkoutData?.studio?.details[0]?.price_details?.hour_price) ||
        0;
      // Convert Time 00:00 format to 00.00
      let getTime = '';
      if (checkoutData?.numberOfBookingTime) {
        getTime = checkoutData?.numberOfBookingTime?.split(':');
      } else {
        getTime = '00:00'.split(':');
      }
      const getHour = getTime[0];
      const getMin = getTime[1];
      const getHourMin = getMin / 60;
      const convertedTime = Number(getHour) + Number(getHourMin);

      // Hourly Price
      const getPrice = (Number(hr_rice) * parseFloat(convertedTime)).toFixed(2);
      setPrice(getPrice);
      // Gst Price
      // const gstPrice = Number((getPrice * 5) / 100).toFixed(2);
      // setGst(gstPrice);

      // Total Price
      const total = Math.ceil(Number(getPrice)).toFixed(2);
      //* Check coupon code applied or not
      if (appliedCoupon) {
        const payableAmount = Math.ceil(
          total - Number(appliedCoupon.couponAmount)
        ).toFixed(2);
        setTotalPrice(payableAmount);
        return;
      }
      setTotalPrice(total);
      return total;
    }
  }, [appliedCoupon]);


  const handleCouponCode = (e) => {
    setCouponCode(e.target.value);
    if (disableAppliedButton) {
      setAppliedCoupon(null);
      setDisableAppliedButton(false);
    }
  };

  /**
   * Check Coupon Code
   */
  const checkCouponCode = async () => {
    try {
      if (couponCode && couponCode !== '') {
        setDisableAppliedButton(true);
        const res = await api.checkCouponCode({ couponCode, user });
        if (res && res.data && res.data.type) {

          if (res.data.type.toUpperCase() === 'PERCENTAGE') {
            const percentage = res.data.percentage;
            const maxDiscountPrice = res.data.maximum_amount;

            // Calculate the discount amount based on the total price and percentage
            const discountPrice =
              Number(totalPrice) * (Number(percentage) / 100);

            // If the calculated discount exceeds the maximum allowed discount
            if (discountPrice > maxDiscountPrice) {
              // Set the total price to the original price minus the maximum discount
              setAppliedCoupon({
                isApplied: true,
                couponCode: couponCode,
                couponAmount: maxDiscountPrice,
              });
            } else {
              // Otherwise, set the total price to the original price minus the calculated discount
              setAppliedCoupon({
                isApplied: true,
                couponCode: couponCode,
                couponAmount: discountPrice,
              });
            }
          } else if (res.data.type.toUpperCase() === 'FLAT') {
            const discount = res.data.discount_amount;
            setAppliedCoupon({
              isApplied: true,
              couponCode: couponCode,
              couponAmount: discount,
            });
          } else {
            setCouponCode('');
          }
          toast.success('Coupon code applied');
          // setCouponData(res);
        } else {
          toast.error('Invalid coupon code');
          setCouponCode('');
          setDisableAppliedButton(false);
        }
      } else {
        toast.error('Please enter coupon code');
        setCouponCode('');
      }
    } catch (error) {
      setCouponCode('');
      setDisableAppliedButton(false);
    }
  };

  const goBack = () => {
    //TODO: Encode Url to Base64
    // example : encodeURI('cat_id=1&studio_id=1&location_id=1')
    const key = `cat_id=${checkoutData.bookingFor.id}&studio_id=${checkoutData.studio.studio_id}&location_id=${checkoutData.bookingLocation.id}&checkout=true`;
    router.replace({
      pathname: '/booking',
      query: key,
    });
  };

  return (
    <SecondaryLayout>
      <Header>
        <div className="flex flex-col justify-start items-start bg-[#010201]">
          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 py-4">
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
              <button onClick={goBack}>
                <ArrowLeftIcon width={24} height={24} />
              </button>
            </div>
            <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
              <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                {checkOutLabel.header}
              </p>
            </div>
          </div>
        </div>
      </Header>

      {/* Page Body */}
      <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 bg-[#19191C]">
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-10 md:px-96 md:pt-6 pb-12 md:pb-28">
          <div className="hidden md:flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 pt-8 gap-2">
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
              <button onClick={goBack}>
                <ArrowLeftIcon width={24} height={24} />
              </button>
            </div>
            <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
              <p className="flex-grow-0 flex-shrink-0 text-xl font-medium text-left text-white">
                Back
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start self-stretch flex-grow md:bg-black/20 md:rounded-2xl flex-shrink-0">
            <div className="flex flex-col justify-start items-start self-stretch flex-grow gap-8 px-6 pt-6 pb-20">
              <div className="flex flex-col self-stretch gap-4">
                <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 flex-grow-0 flex-shrink-0 text-sm font-medium text-left capitalize text-white/[0.64]">
                    {checkOutLabel.address}
                  </span>
                  <div className="w-full">
                    <Select
                      options={psLocations?.data}
                      onChange={(loc) => setBookingAddress(loc.location)}
                      getOptionLabel={(option) => option.location}
                      getOptionValue={(option) => option.id}
                      styles={customStyles}
                      instanceId={useId()}
                      isSearchable={false}
                    />
                  </div>
                </label>

                <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 flex-grow-0 flex-shrink-0 text-sm font-medium text-left capitalize text-white/[0.64]">
                    {checkOutLabel.landmark.title}
                  </span>
                  <div className="w-full">
                    <InputField
                      className="formInput w-full"
                      placeholder={checkOutLabel.landmark.placeHolder}
                      value={landMark}
                      onChange={(e) => setLandMark(e.target.value)}
                    />
                  </div>
                </label>
              </div>

              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-5">
                <p className="flex-grow-0 flex-shrink-0 text-2xl font-medium text-center text-white">
                  {checkOutLabel.details.title}
                </p>
                <div className="flex flex-col justify-start items-start self-stretch flex-grow relative py-2 rounded-lg bg-white/5">
                  <Listbox
                    title={checkOutLabel.details.event}
                    value={checkoutData?.bookingFor?.name}
                  />
                  <Listbox
                    title={checkOutLabel.details.date}
                    value={checkoutData?.bookingDate}
                  />
                  <Listbox
                    title={checkOutLabel.details.time}
                    value={`${Format12HourTime(
                      checkoutData.bookingTimeFrom
                    )} to ${Format12HourTime(checkoutData.bookingTimeTo)}`}
                  />
                  <Listbox
                    title={checkOutLabel.details.duration}
                    value={`${convertTimeFormat(
                      checkoutData.numberOfBookingTime
                    )}`}
                  />

                  <Listbox
                    title={checkOutLabel.details.amount}
                    value={`₹  ${price}`}
                  />
                  {/* <Listbox title="GST" value={`₹ ${gst}`} /> */}
                  <Listbox
                    title={checkOutLabel.details.total}
                    value={`₹ ${totalPrice}`}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-5">
                {checkoutData?.equipment?.length > 0 && (
                  <p className="flex-grow-0 flex-shrink-0 text-2xl font-medium text-center text-white">
                    {checkOutLabel.equipment}
                  </p>
                )}
                <div className="flex flex-col justify-start items-start self-stretch flex-grow relative">
                  {checkoutData?.equipment?.length > 0 && (
                    <div className="w-full flex flex-wrap gap-2">
                      {checkoutData.equipment.map((item, index) => (
                        <div
                          key={index}
                          className="flex-grow-0 truncate w-full flex-shrink-0 text-sm text-white bg-white/10 py-1.5 px-3 rounded-full"
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <label className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                  <div className="flex gap-2 flex-col">
                    <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left capitalize text-white/[0.64]">
                      {checkOutLabel.coupon}
                    </span>
                    <div className='flex flex-1'>
                      <div className="w-full">
                        <InputField
                          className="formInput w-full h-10 py-2.5"
                          placeholder={checkOutLabel.couponPlaceholder}
                          value={couponCode}
                          onChange={handleCouponCode}
                        />
                      </div>
                      <button
                        onClick={checkCouponCode}
                        className="text-white bg-blue-700 h-10 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-.5  mb-2 focus:outline-none  disabled:bg-slate-400"
                        disabled={disableAppliedButton}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </label>

                {appliedCoupon && appliedCoupon.couponCode && appliedCoupon.couponAmount && (
                  <p className="text-sm text-green-400">
                    Coupon code has been applied. Congratulation you saved {' '}
                    {COMMON.RUPEE_SYMBOL + appliedCoupon.couponAmount}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={paymentHandler}
              className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 md:relative gap-[5px] px-[18px] py-[15px] bg-blue-700 hover:bg-blue-800 fixed bottom-0 w-full"
              disabled={loading}
            >
              <div className="flex flex-col justify-start items-start flex-grow relative gap-0.5">
                <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-white">
                  {loading ? 'Please wait...' : checkOutLabel.pay}
                </p>
                <p className="flex-grow-0 flex-shrink-0 text-[27px] font-bold text-left text-white">
                  ₹ {totalPrice}
                </p>
              </div>
              {loading ? <LoadingOutlined /> : <ArrowRightIcon />}
            </button>
          </div>
        </div>
      </div >
    </SecondaryLayout >
  );
}

const customStyles = {
  option: (provided) => ({
    ...provided,
    color: 'black',
  }),
  control: (provided) => ({
    ...provided,
    color: 'black',
    backgroundColor: '#27292d',
    borderWidth: '2px',
    borderColor: '#27292d',
    width: '100%',
    height: '2.8rem !important',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#fff',
    heigh: '2.8rem',
  }),

  // control: (provided) => ({
  //   borderColor: error === 'bookingTime' ? '#f87171' : '#27292d',
  // }),
};
