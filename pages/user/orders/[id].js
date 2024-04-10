import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import Header from '../../../components/common/Header';
import { COMMON } from '../../../constants/const';
import * as api from '../../../services/storeService';
import TrackOrder from '../../../components/eCom/TrackOrder';
import Review from '../../../components/eCom/Review';
import ProfileLayout from '../../../components/layout/ProfileLayout';
import { useUser } from '../../../context/UserContext';

export default function OrderDetails() {
  const { userId } = useUser();
  const router = useRouter();
  const orderId = router.query.id;

  const { data } = useSWR(
    userId && orderId && ['/api/get/orders/list' + orderId],
    () => api.getOrdersDetails(orderId)
  );
  const orderInfo = data?.order_item;
  // const trackingInfo = data?.tracks;
  let userInfo;
  let productInfo;
  if (orderInfo) {
    try {
      userInfo = orderInfo?.user_data && JSON.parse(orderInfo?.user_data);
      productInfo =
        orderInfo?.variation_name && orderInfo.variation_name?.split(',');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ProfileLayout>
      <Header>
        <div className="flex flex-col justify-start items-center self-stretch bg-[#010201]">
          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 py-5">
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative">
              <Link href="/user/orders">
                <ArrowLeftIcon className="h-6 w-6 text-white" />
              </Link>
            </div>
            <div className="flex flex-col justify-center items-start flex-grow flex-shrink-0 relative self-stretch gap-1">
              <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                Order Details
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
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 pb-12 gap-2 mt-4 md:mt-0 md:max-w-2xl md:pb-28 m-0">
        {/* <div className="hidden md:flex flex-col justify-start items-start self-stretch">
          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 pt-12 pb-8">
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
              <Link href="/user/orders">
                <ArrowLeftIcon className="h-6 w-6 text-white" />
              </Link>
            </div>
            <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
              <p className="flex-grow-0 flex-shrink-0 text-xl font-medium text-left text-white">
                Order Details
              </p>
            </div>
          </div>
        </div> */}
        <div className="flex flex-col md:flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-5 md:gap-6 px-6 md:px-0">
          <div className="flex flex-col gap-6 md:bg-[#1E1F22] w-full md:rounded-md md:px-4 md:py-1">
            <div className="w-full text-[#C5C5C5] text-sm">
              Order ID - {orderInfo?.track_order_id}
            </div>
            <div className="w-full flex justify-start md:justify-between items-start self-stretch md:self-auto flex-grow-0 flex-shrink-0 gap-1">
              <Link
                href={{
                  pathname: '/store/product-details/' + orderInfo?.product_id,
                  query: {
                    name: orderInfo?.product_name,
                    pid: orderInfo?.product_id,
                  },
                }}
              >
                <div className="w-[120px] md:w-32 h-[150px] md:h-32  overflow-hidden rounded">
                  <Image
                    src={orderInfo?.product_image || '/164-164.png'}
                    className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full min-w-20"
                    width={120}
                    height={150}
                    alt={orderInfo?.product_name || 'product name'}
                  />
                </div>
              </Link>
              <div className="flex flex-col justify-start items-start flex-grow gap-4">
                <div className="flex flex-col md:flex-row md:justify-between justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2 ml-2">
                  <div>
                    <p className="self-stretch flex-grow-0 flex-shrink-0 w-[198px] md:w-full text-xl font-medium text-left text-white">
                      {orderInfo?.product_name}
                    </p>
                    <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left uppercase text-white/[0.64]">
                      Acur
                    </p>
                    <p className="flex-grow-0 flex-shrink-0 text-sm font-normal text-left text-white/[0.64]">
                      Seller: {orderInfo?.vendor_name}
                    </p>
                  </div>
                  <div>
                    <p className="flex-grow-0 flex-shrink-0 text-lg font-medium text-left uppercase text-white">
                      {COMMON.RUPEE_SYMBOL + ' ' + orderInfo?.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/*  */}

            {/* Order Details */}
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 md:flex-grow flex-shrink-0 gap-6">
              {/* <div className="flex justify-between w-full text-white">
              <div className="text-lg font-semibold">Order Details</div>
              <div
                className="text-xs flex items-center cursor-pointer"
                onClick={handleShowMore}
              >
                {showMore ? (
                  <>
                    Show less <HiChevronUp />
                  </>
                ) : (
                  <>
                    Show more <HiChevronDown />
                  </>
                )}
              </div>
            </div> */}
              {
                <>
                  <div className="w-full">
                    <span className="text-white text-base font-normal">
                      Product Details
                    </span>
                    <ul className="text-white/70 text-sm py-2">
                      {productInfo?.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </>
              }
            </div>
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 md:flex-grow flex-shrink-0 gap-6">
              {/* Stepper */}
              <TrackOrder />
            </div>
          </div>
          <div className="md:bg-[#1E1F22] w-full md:rounded-md md:px-4 md:py-1">
            <div className="w-full py-2 px-3 rounded-md">
              <span className="text-white text-base font-normal">
                Order Address
              </span>
              <p className="text-white/70 text-sm pt-2">{userInfo?.name}</p>
              <p className="text-white/70 text-sm ">
                {userInfo?.address +
                  ', ' +
                  userInfo?.landmark +
                  ', ' +
                  userInfo?.city +
                  ', ' +
                  userInfo?.state +
                  ', ' +
                  userInfo?.zip}
              </p>
              <p className="text-white/70 text-sm">+91 {userInfo?.phone}</p>
            </div>
          </div>

          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 md:flex-grow flex-shrink-0 gap-6">
            <Review
              userId={userId}
              orderId={orderId}
              productId={orderInfo?.product_id}
              orderInfo={orderInfo}
            />
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
}
