import Image from 'next/image';
import React, { Fragment } from 'react';
import { COMMON } from '../../constants/const';
import { useRouter } from 'next/router';

function Cards({ image, variation, price, tempId }) {
  const router = useRouter();
  const changeDefaultImage = (vid) => {
    router.push({
      query: { ...router.query, vId: vid, temp: tempId },
    });
  };

  return (
    <div className="flex flex-col justify-start items-start flex-grow relative gap-2.5">
      <button
        onClick={() => changeDefaultImage(variation)}
        className="w-[164px] h-[164px] aspect-w-16 aspect-h-16 overflow-hidden rounded"
      >
        <Image
          src={image || '/164-164.png'}
          className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
          width={164}
          height={164}
          alt=""
        />
      </button>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
        <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left uppercase text-white">
          {COMMON.RUPEE_SYMBOL + Math.round(price)}
        </p>
        {/* <ul className="flex w-full pr-5 flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
          {(variation?.attribute_value)?.map(
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
        </ul> */}
      </div>
    </div>
  );
}
const AIGeneratedFrame = ({ AIFrameImages, price }) => {
  return (
    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-6 py-6">
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2 px-6">
        <p className="self-stretch flex-grow-0 flex-shrink-0  text-xl font-medium text-left text-white">
          AI Generated Frames
        </p>
      </div>
      <div className="flex flex-col justify-start items-start self-stretch gap-2 px-6 overflow-x-auto">
        <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 gap-4">
          {AIFrameImages?.generated_images?.map((item, i) => (
            <Fragment key={item.template_id}>
              <Cards
                image={item?.generated_image}
                variation={item?.variation_id}
                price={price}
                tempId={item?.template_id}
              />
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIGeneratedFrame;
