import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import useSWR from 'swr';
import * as api from '../../services/userService';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-hot-toast';
import { Fragment, useState } from 'react';
import { orderBy } from 'lodash';
import Link from 'next/link';
const Coupon = () => {
  const { userId } = useUser();

  const { data, error } = useSWR(
    userId && ['/refered-coupons/', userId],
    () => api.getCouponCode(userId),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
  const coupons =
    orderBy(data?.referred_coupons, (coupon) => coupon.is_used, 'asc') || [];

  const totalCoupon = coupons?.length || 0;
  const collectedCoupon =
    coupons?.filter((coupon) => coupon.is_used).length || 0;

  if (error) {
    return toast.error('Failed to load coupons');
  }

  return (
    <div className="px-5">
      <h1 className="text-2xl text-white">Your Coupon</h1>

      <div className="w-full mt-4 p-4 md:px-10 bg-white border border-gray-200 rounded-[10px] shadow hover:bg-gray-100 ">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center flex-col">
            <div>Total Coupon</div>
            <div className="text-lg font-bold">{totalCoupon}</div>
          </div>
          <div className="flex items-center flex-col">
            <div>Coupon Collected</div>
            <div className="text-lg font-bold">{collectedCoupon}</div>
          </div>
        </div>
      </div>

      {coupons.map((coupon) => (
        <Fragment key={coupon.id}>
          {coupon?.is_used ? (
            <>
              <InactiveCouponCards coupon={coupon} />
            </>
          ) : (
            <>
              <ActiveCouponCards coupon={coupon} />
            </>
          )}
        </Fragment>
      ))}
    </div>
  );
};

const ActiveCouponCards = ({ coupon }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (coupon) => {
    navigator.clipboard.writeText(coupon);
    setCopied(true);
    toast.success('Message copied to clipboard');
  };
  return (
    <div className="w-full flex flex-col gap-4 mt-4 p-4 md:px-10 bg-[#4B3196] border border-[#4B3196] rounded-[10px] shadow text-white ">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center flex-col">
          <div>Coupon #3H6</div>
        </div>
        <div className="flex items-center flex-col">
          <div>Valid till {coupon.time_frame}</div>
        </div>
      </div>
      <div>
        <div className="relative w-full">
          <input
            type="text"
            id="voice-search"
            className="border text-sm rounded-[10px] formInput  block w-full p-2.5  bg-[#19191C] border-gray-600 placeholder-gray-400 text-white focus:ring-transparent focus:border-none"
            value={coupon.coupon_code}
            readOnly
          />
          <button
            type="button"
            className="absolute inset-y-0 end-0 flex items-center pe-3"
            onClick={() => copyToClipboard(coupon.coupon_code)}
            disabled={copied}
          >
            {copied ? (
              <span className="ml-2 text-sm text-green-500">Copied</span>
            ) : (
              <DocumentDuplicateIcon height={24} width={24} />
            )}
          </button>
        </div>
      </div>
      <div className="w-full flex items-center justify-between gap-3">
        {/* <div className="flex items-center flex-col w-full">
          <button className="text-white w-full bg-black/20 hover:bg-black/25 focus:ring-4 focus:ring-blue-300 font-medium text-sm rounded-[10px] px-3 py-3">
            Send Gift
          </button>
        </div> */}
        <div className="flex items-center flex-col w-full">
          <Link
            href={{
              pathname: '/photography/studios',
              query: { refer_code: coupon.coupon_code },
            }}
            className="text-white text-center w-full bg-black/20 hover:bg-black/25 focus:ring-4 focus:ring-blue-300 font-medium text-sm rounded-[10px] px-3 py-3"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

const InactiveCouponCards = ({ coupon }) => {
  return (
    <div className="w-full flex flex-col gap-4 mt-4 p-4 md:px-10 bg-gray-500 border border-gray-500  rounded-[10px] shadow text-white ">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center flex-col">
          <div>Coupon #3H6</div>
        </div>
        {/* <div className="flex items-center flex-col">
          <div>Valid till {coupon.time_frame}</div>
        </div> */}
      </div>
      <div>
        <div className="relative w-full mb-3">
          <input
            type="text"
            id="voice-search"
            className="border text-sm rounded-[10px] formInput  block w-full p-2.5  bg-[#19191C] border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            value={coupon.coupon_code}
            readOnly
          />
          <button
            type="button"
            className="absolute inset-y-0 end-0 flex items-center pe-3"
          >
            <span className="ml-2 text-sm text-red-500">Used</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Coupon;
