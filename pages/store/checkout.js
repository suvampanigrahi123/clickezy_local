import Image from 'next/image';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import SecondaryLayout from '../../components/layout/SecondaryLayout';
import Header from '../../components/common/Header';
import { useRouter } from 'next/router';
import AuthProvider from '../../components/common/AuthProvider';
import { useUser } from '../../context/UserContext';
import useSWR from 'swr';
import * as api from '../../services/storeService';
import { toast } from 'react-hot-toast';
import { runFireworks } from '../../utils/FireWorks';
import CartProduct from '../../components/eCom/CartProduct';
import ProductPriceDetails from '../../components/eCom/ProductPriceDetails';
import AddressModel from '../../components/eCom/AddressModel';
import { COMMON } from '../../constants/const';
import { filter } from 'lodash';
import { getLocalStorage } from '../../utils/localStore';
import { useEffect, useState } from 'react';
import { calculateShippingPrice } from '../../utils/ShippingPrice';
import OrderSuccess from '../../components/eCom/OrderSuccess';
import Loader from '../../components/Loader';
import { initializeRazorpay } from '../../utils/rozorpay';
import EmptyCart from '../../components/eCom/EmptyCart';

export default function Checkout() {
  const router = useRouter();
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [loading, setLoading] = useState(false);
  const { userId } = useUser();
  const [promoCode, setPromoCode] = useState('');
  const [couponPrice, setCouponPrice] = useState(0);
  const [totalPaymentPrice, setTotalPaymentPrice] = useState(0);
  const { data: address, mutate } = useSWR(
    userId && ['/store/getAddress' + userId],
    () => api.getAddress(userId)
  );
  const defaultAddress = filter(address, (o) => o.is_default);

  const {
    data: cart,
    mutate: mutation,
    isLoading,
  } = useSWR(
    userId && ['/store/getCart', userId, defaultAddress],
    () => api.getCart(userId),
    []
  );

  // Calculate Shipping Price
  useEffect(() => {
    let totalShippingPrice = 0;
    cart?.carts.forEach((ca) => {
      const shippingPrice = calculateShippingPrice(
        ca?.weight_price,
        ca?.product_weight,
        ca?.total_quantity
      );

      totalShippingPrice += shippingPrice;
    });
    setDeliveryPrice(totalShippingPrice);
  }, [cart]);
  // disable button when any of object contain is shipping flag is false
  const disablePayment =
    cart && cart?.carts.some((o) => o.isShippingAvailable === 0);

  const handleGoBack = () => {
    router.replace('/store/cart');
  };

  /**
   *
   * @param {*} e
   */
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await initializeRazorpay();
    if (!res) {
      alert('Razorpay SDK Failed to load');
      return;
    }
    const payload = preparePayload();
    const data = await api.createOrder(payload, totalPaymentPrice);
    if (data?.data.status === 'success') {
      const payment_model = data.headers['x-order_id'];
      if (!payment_model) {
        return;
      }
      const paymentInfo = JSON.parse(payment_model);
      var options = {
        key: process.env.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        name: 'ClickEzy',
        currency: paymentInfo.currency,
        amount: paymentInfo.amount,
        order_id: paymentInfo.id,
        handler: async function (response) {
          if (response) {
            setLoading(true);
            /**
             * Payload for save booking information
             */
            try {
              const orderResponse = await api.placeOrder(payload);
              if (orderResponse && orderResponse?.status === 'success') {
                setOrderSuccess(true);
                runFireworks();
                setLoading(false);
              } else {
                toast.error('Something went wrong');
                setLoading(false);
              }
            } catch (error) {
              toast.error('Something went wrong');
              setLoading(false);
            }
          }
        },
        //TODO: use logged in user details
        prefill: {
          name: 'Akash Pradhan',
          email: 'akash@gmail.com',
          contact: '7504587810',
        },
        theme: {
          color: '#2300a3',
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setLoading(false);
    }

    // const data = await api.placeOrder(payload);
    // if (data && data.status === 'success') {
    //   setTimeout(() => {
    //     setLoading(false);
    //     runFireworks();
    //     setOrderSuccess(true);
    //   }, 1000);
    // } else {
    //   toast.error('something went wrong');
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft > 0 && orderSuccess) {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);

    if (timeLeft <= 0) {
      router.replace('/user/orders');
    }

    return () => {
      clearInterval(interval);
    };
  }, [timeLeft, orderSuccess]);
  /**
   *
   * @returns
   */
  const preparePayload = () => {
    let address = '';
    if (defaultAddress && defaultAddress[0]) {
      address = JSON.stringify(defaultAddress[0]);
    }
    const location = getLocalStorage('location').id;
    const total_quantity = cart && cart.carts?.length;
    const couponAmount = couponPrice ? couponPrice : 0;
    const couponCode = couponAmount ? promoCode : '';
    const userPaid =
      couponCode && couponAmount
        ? cart?.total_discounted_amount - couponAmount
        : cart?.total_discounted_amount;
    const payload = {
      user_id: userId,
      price: cart?.total_discounted_amount,
      total_quantity: total_quantity,
      user_paid_amount: userPaid,
      payment_mode: 'online',
      user_data: address,
      pin: defaultAddress[0].zip,
      location_id: location ? location : null,
      delivery_price: deliveryPrice,
    };

    if (couponCode) {
      payload.coupon_code = couponCode;
      payload.coupon_amount = couponAmount;
    }
    return payload;
  };

  const promoCodeChange = (e) => {
    const value = e.target.value;
    setPromoCode(value);
  };

  const applyPromoCode = async (e) => {
    e.preventDefault();
    try {
      const data = await api.applyPromoCode({ promoCode, userId });
      if (data && data?.discount_amount) {
        toast.success('Promo Code applied successfully');
        setCouponPrice(data.discount_amount);
      } else {
        toast.error('Invalid promo Code');
        setCouponPrice(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTotalPaymentPrice(
      Number(cart?.total_discounted_amount) +
        Number(deliveryPrice) -
        Number(couponPrice)
    );
  }, [deliveryPrice, couponPrice]);
  return (
    <>
      {!orderSuccess ? (
        <SecondaryLayout>
          <AuthProvider>
            <Header>
              <div className="flex flex-col justify-start items-center self-stretch bg-[#010201]">
                <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 py-5">
                  <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative">
                    <button onClick={handleGoBack}>
                      <ArrowLeftIcon className="h-6 w-6 text-white" />
                    </button>
                  </div>
                  <div className="flex flex-col justify-center items-start flex-grow flex-shrink-0 relative self-stretch gap-1">
                    <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                      Checkout
                    </p>
                  </div>
                  {/* <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-4">
              <Link href="checkout">
                <ShoppingCartIcon className="h-6 w-6 text-white" />
              </Link>
            </div> */}
                </div>
              </div>
            </Header>

            {/* Page Body */}
            {(loading || isLoading) && <Loader />}
            {cart && cart.carts.length > 0 && !isLoading ? (
              <div
                className={`flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 md:px-44 md:pb-28 lg:px-33  ${
                  loading && 'opacity-30'
                }`}
              >
                <div className="hidden md:flex flex-col justify-start items-start self-stretch">
                  <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 pt-12 pb-8">
                    <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
                      <button onClick={handleGoBack}>
                        <ArrowLeftIcon className="h-6 w-6 text-white" />
                      </button>
                    </div>
                    <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
                      <p className="flex-grow-0 flex-shrink-0 text-xl font-medium text-left text-white">
                        Checkout
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stepper  */}
                <div className="flex justify-start items-center h-20 self-stretch flex-grow-0 flex-shrink-0 gap-4 px-4 py-3 md:py-4 bg-[#27292d] md:rounded-xl">
                  <div className="flex justify-start flex-col  flex-grow relative gap-2">
                    <div className="flex justify-evenly items-center">
                      <div className="flex items-center flex-col  relative">
                        <Image
                          src="/icons/tick-circle.svg"
                          alt="Picture of the author"
                          width={30}
                          height={30}
                          quality={100}
                        />
                        <span className="text-[#FFFFFF99] text-[12px] absolute top-8">
                          Cart
                        </span>
                      </div>
                      <div className="w-[25%] h-[1px] bg-[#186CED]"></div>
                      <div className="flex items-center flex-col  relative">
                        <div className="w-8 h-8 bg-[#186CED] rounded-full text-white flex items-center justify-center">
                          2
                        </div>
                        <span className="text-white text-[12px] absolute top-8 whitespace-nowrap">
                          Order Summery
                        </span>
                      </div>
                      <div className="w-[25%] h-[1px] bg-[#FFFFFF99]"></div>
                      <div className="flex items-center flex-col  relative">
                        <div className="w-8 h-8 bg-transparent border border-[#FFFFFF99] rounded-full text-[#FFFFFF99]  flex items-center justify-center">
                          3
                        </div>
                        <span className="text-[#FFFFFF99] text-[12px] absolute top-8">
                          Payment
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <AddressModel
                  address={address}
                  userId={userId}
                  mutate={mutate}
                  isDisplayFullAddress={true}
                />

                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 ">
                  <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 w-full">
                    {/* cart details */}
                    <div className="flex w-full flex-col md:flex-row justify-between">
                      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-8 px-4 py-6">
                        <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-3">
                          {cart &&
                            cart.carts.length > 0 &&
                            cart.carts.map((pro, i) => (
                              <div key={i}>
                                <CartProduct
                                  product={pro}
                                  mutate={mutation}
                                  page="checkout"
                                />
                                <hr className="w-full border-white/5" />
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="flex flex-col w-full">
                        <ProductPriceDetails
                          item={cart?.carts}
                          discountPrice={cart?.total_discounted_amount}
                          totalPrice={cart?.total_original_amount}
                          shippingPrice={deliveryPrice}
                          page="checkout"
                          coupon={couponPrice}
                        />
                        <div className='className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-6 pb-6'>
                          <div className="flex text-gray-300 flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 overflow-x-auto">
                            <div className="flex items-center justify-between w-full gap-3 ">
                              <input
                                type="text"
                                className="placeholder:text-slate-400 placeholder:text-sm block border-white/25 bg-[#19191c] text-white w-full border rounded-sm h-10  py-4 shadow-sm focus:outline-none focus:ring-blue-500 focus:ring-1"
                                placeholder="Have a promo code"
                                onChange={promoCodeChange}
                                value={promoCode}
                              />
                              <button
                                className="p-2 rounded-sm  bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:bg-gray-500"
                                disabled={!(promoCode.length > 1)}
                                onClick={applyPromoCode}
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 pb-4 md:hidden">
                          <div className="w-full flex items-center justify-center gap-2">
                            <Image
                              src="/icons/safeIcon.svg"
                              width={50}
                              height={50}
                              alt="safeIcon"
                            />
                            <div className="text-[#fff9]">
                              <span className="block">
                                Safe and secure payments.
                              </span>
                              <span className="block">
                                {' '}
                                100% authentic products.
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Mobile Payment button */}
                        <div className="flex justify-center bg-[#1D1D21] md:bg-transparent p-2 md:p-0">
                          <div className="flex justify-between w-full items-center px-3 lg:justify-end">
                            <div className="text-white text-xl font-bold lg:hidden">
                              {COMMON.RUPEE_SYMBOL + ' ' + totalPaymentPrice}
                            </div>
                            <button
                              className="flex w-1/2 justify-center items-center p-1 rounded-md gap-[5px]  bg-blue-700 hover:bg-blue-800 disabled:opacity-50"
                              onClick={handlePayment}
                              disabled={disablePayment}
                            >
                              <p className="flex-grow-0 flex-shrink-0 text-lg  text-left text-white">
                                Payment
                              </p>
                              {/* <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2">
                        <ArrowRightIcon className="h-6 w-6 text-white" />
                      </div> */}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>{!isLoading && <EmptyCart />}</>
            )}
          </AuthProvider>
        </SecondaryLayout>
      ) : (
        <OrderSuccess countdown={timeLeft} />
      )}
    </>
  );
}
