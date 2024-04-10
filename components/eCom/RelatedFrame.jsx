import Image from 'next/image';
import React, { Fragment } from 'react';
import { COMMON } from '../../constants/const';
import { useRouter } from 'next/router';

function Cards({ image, variation, generatedImage }) {
  const router = useRouter();
  const changeDefaultImage = (v) => {
    if (router.query.temp) {
      // remove temp from query
      delete router.query.temp;
    }
    router.push({
      query: { ...router.query, vId: v.variation_id },
    });
  };

  const f = generatedImage.filter(
    (o) => o.variation_id == variation.variation_id
  );
  const imageSrc = f.length > 0 ? f[0].generated_image : image;
  return (
    <div className="flex flex-col justify-start items-start flex-grow relative gap-2.5">
      <button
        onClick={() => changeDefaultImage(variation)}
        className="w-[164px] h-[164px] aspect-w-16 aspect-h-16 overflow-hidden rounded"
      >
        <Image
          src={imageSrc || '/164-164.png'}
          className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
          width={164}
          height={164}
          alt=""
        />
      </button>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
        <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left uppercase text-white">
          <span className="text-sm">
            {COMMON.RUPEE_SYMBOL +
              ' ' +
              Math.round(variation?.discounted_amount)}
          </span>
          {variation.percentage > 0 && (
            <span className="ml-1 text-xs line-through text-gray-500">
              {COMMON.RUPEE_SYMBOL + Math.round(variation.price)}
            </span>
          )}
          {variation.percentage > 0 && (
            <span className="ml-1 text-xs text-blue-500">
              {variation.percentage}% off
            </span>
          )}
        </p>
        <ul className="flex w-full pr-5 flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
          {Object.entries(variation?.attribute_value)?.map(
            ([key, value], index) => (
              <li key={index} className="flex items-center self-stretch">
                &nbsp;
                <span className="flex  text-white rounded-md">{value}</span>
                {key.toLowerCase() === 'colors' && (
                  <div
                    className="w-6 h-4 ml-2"
                    style={{ backgroundColor: `${value.toLowerCase()}` }}
                  ></div>
                )}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
const RelatedFrame = ({ relatedFrame, generatedImage }) => {
  return (
    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-6 py-6">
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2 px-6">
        <p className="self-stretch flex-grow-0 flex-shrink-0  text-xl font-medium text-left text-white">
          Popular Sizes
        </p>
      </div>
      <div className="flex flex-col justify-start items-start self-stretch gap-2 px-6 overflow-x-auto">
        <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 gap-4">
          {relatedFrame?.map((item, i) => (
            <Fragment key={i}>
              {!item.isSelected && (
                <Cards
                  image={item?.variation_image}
                  variation={item}
                  generatedImage={generatedImage}
                />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedFrame;
