import { StarIcon } from '@heroicons/react/24/solid';
import React from 'react';
import RattingComments from './RattingComments';
import * as api from '../../services/storeService';
import useSWR from 'swr';

const UserReview = ({ review, productId }) => {
  const { data } = useSWR(
    productId && 'product/reviews?product_id' + productId,
    () => api.getProductReview(productId)
  );

  const getWidth = (rating) => {
    if (rating <= 0) {
      return '0%';
    }
    const avg = Math.floor((rating / review?.total_rating) * 100);
    return avg + '%';
  };

  return (
    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
      <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative">
        <p className="flex-grow-0 flex-shrink-0 text-xl font-semibold text-left text-white">
          Rating & Reviews
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between w-full">
        <div className="flex  md:flex-col justify-center items-center md:w-[40%] gap-2">
          <div className="flex justify-center items-center">
            <span className="text-3xl font-normal text-white">
              {Number(review?.rating).toFixed(1)}
            </span>
            <StarIcon width={30} height={30} className="text-blue-500" />
          </div>
          <div className="text-white/[0.6] text-sm flex flex-col">
            <span>{review?.total_rating} ratting &</span>
            <span>{review?.total_review} review</span>
          </div>
        </div>
        <div className="w-full">
          <div className="flex justify-center items-center gap-3">
            <div className="flex justify-center items-center gap-1 w-1/5">
              <span className="text-white text-lg">5</span>
              <StarIcon width={20} height={20} className="text-blue-500" />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{
                  width: getWidth(review?.fiveStar),
                }}
              ></div>
            </div>
            <div className="flex justify-center items-center">
              <span className="text-white text-lg">{review?.fiveStar}</span>
            </div>
          </div>
          <div className="flex justify-center items-center gap-3">
            <div className="flex justify-center items-center gap-1 w-1/5">
              <span className="text-white text-lg">4</span>
              <StarIcon width={20} height={20} className="text-blue-500" />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: getWidth(review?.fourStar) }}
              ></div>
            </div>
            <div className="flex justify-center items-center gap-1">
              <span className="text-white text-lg">{review?.fourStar}</span>
            </div>
          </div>
          <div className="flex justify-center items-center gap-3">
            <div className="flex justify-center items-center gap-1 w-1/5">
              <span className="text-white text-lg">3</span>
              <StarIcon width={20} height={20} className="text-blue-500" />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: getWidth(review?.threeStar) }}
              ></div>
            </div>
            <div className="flex justify-center items-center gap-1">
              <span className="text-white text-lg">{review?.threeStar}</span>
            </div>
          </div>
          <div className="flex justify-center items-center gap-3">
            <div className="flex justify-center items-center gap-1 w-1/5">
              <span className="text-white text-lg">2</span>
              <StarIcon width={20} height={20} className="text-blue-500" />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-yellow-300 h-2.5 rounded-full"
                style={{ width: getWidth(review?.twoStar) }}
              ></div>
            </div>
            <div className="flex justify-center items-center gap-1">
              <span className="text-white text-lg">{review?.twoStar}</span>
            </div>
          </div>
          <div className="flex justify-center items-center gap-3">
            <div className="flex justify-center items-center gap-1 w-1/5">
              <span className="text-white text-lg">1</span>
              <StarIcon width={20} height={20} className="text-blue-500" />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-red-600 h-2.5 rounded-full"
                style={{ width: getWidth(review?.oneStar) }}
              ></div>
            </div>
            <div className="flex justify-center items-center gap-1">
              <span className="text-white text-lg">{review?.oneStar}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="flex flex-col gap-2 ">
        {data?.review_list.map((item, i) => (
          <div
            key={i}
            className={`border-b  pb-2 ${
              data?.review_list?.length - 1 !== i
                ? 'border-white/20'
                : 'border-transparent'
            } `}
          >
            <RattingComments rating={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReview;
