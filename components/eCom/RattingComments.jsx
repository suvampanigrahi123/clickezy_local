import { CheckBadgeIcon, StarIcon } from '@heroicons/react/24/solid';
import moment from 'moment/moment';
import Image from 'next/image';
import React from 'react';

export const ImageContainer = ({ count, totalPhoto, image }) => {
  return (
    <div className="flex gap-1">
      {image && count <= 3 && (
        <>
          <Image
            src={image || '/164-164.png'}
            width={80}
            height={80}
            alt=""
            className="w-20 h-20"
          />
        </>
      )}
      {count === 4 && (
        <div className="w-20 h-20 relative">
          <Image src="/164-164.png" width={80} height={80} alt="" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-70">
            <h3 className="text-sm text-white">{totalPhoto}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

const RattingComments = ({ rating }) => {
  const message = rating?.message?.split(';$');
  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex text-white gap-2">
        <div className="flex justify-center items-center bg-blue-600 text-white p-[1px] w-8 rounded-sm">
          <span>{rating?.rating}</span>
          <StarIcon width={10} height={10} />
        </div>
        <div className="font-bold">{message && message[0]}</div>
      </div>
      {/* message */}
      <p className="text-sm mt-2">{message && message[1]}</p>

      {/* Images */}
      <div className="flex flex-wrap gap-2 mt-2">
        {new Array(3).fill(0).map((_, i) => (
          <ImageContainer
            key={i}
            count={i}
            totalPhoto={5}
            image={rating['image' + (i + 1)]}
          />
        ))}
      </div>
      {/* customer name */}
      <div>
        <div className="text-sm text-white/60 flex truncate gap-3 mt-2">
          <span>{rating?.name}</span>
          <CheckBadgeIcon width={20} height={20} />
          <span>
            Certified Buyer, {moment(rating?.date, 'DD-MM-YYYY').fromNow()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RattingComments;
