import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { imageOnError } from '../../utils/errorImage';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as FullStar } from '@heroicons/react/24/solid';

const OrderList = ({ item }) => {
  return (
    <Link
      href={`/user/orders/${item?.order_item_id}`}
      className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 bg-[#1E1F22] text-white rounded-md"
    >
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0">
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 p-4 gap-3">
          <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
            <div className="w-24 h-28 aspect-w-16 aspect-h-4 md:aspect-none flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative">
              <Image
                src={item?.product_image}
                width={100}
                height={100}
                className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full rounded-md"
                alt=""
                onError={imageOnError}
              />
            </div>
            <div className="w-full flex flex-col  justify-between items-start self-stretch flex-grow md:item-center md:justify-center">
              <div className="w-full flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-3">
                <div className="flex flex-col w-full md:flex-row md:justify-between md:items-center gap-2">
                  <div className="flex flex-col gap-2 md:gap-3">
                    <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left capitalize">
                      {item?.product_name}
                    </p>
                    <p className="flex-grow-0 flex-shrink-0 text-sm font-normal text-left">
                      Set of {item?.total_quantity} photo Frames
                    </p>
                  </div>
                    {
                    item?.rating ?
                      <div className="flex">
                        {
                          Array.from(Array(Number(item?.rating)))?.map((val) => (
                            <FullStar width={20} className="text-blue-400" key={val} />
                          ))
                        }
                        {
                          Array.from(Array(5 - Number(item?.rating)))?.map((val) => (
                            <StarIcon width={20} key={val} />
                          ))
                        }
                  </div>
                      :<div className="flex">
                        {
                          Array.from(Array(5).keys())?.map((val) => (
                    <StarIcon width={20} key={val} />
                          ))
                        }
                  </div>
                    }
                  <div className="flex flex-col gap-1 md:gap-3">
                    <span className="text-xs font-semibold flex gap-2">
                      <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                      Delivery on Oct 25
                    </span>
                    <span className="block text-xs">
                      Your Item has been delivered
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OrderList;
