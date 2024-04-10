import Link from 'next/link';

import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'photoswipe/dist/photoswipe.css';
import Image from 'next/image';
import StudioRating from '../StudioRating';
import { imageOnError } from '../../utils/errorImage';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Navigation } from 'swiper';
import { setSelectedIndex } from '../../redux/slices/studioslice';
import { useDispatch } from 'react-redux';
import CustomImage from '../CustomImage';
import { useRouter } from 'next/router';
// import useWindowSize from '../../hooks/useWindowSize';
// import { useState } from 'react';
// import { COMMON } from '../../constants/const';
const SwipeCard = ({
  title = '',
  id = '',
  isCategory = false,
  isPlaces = false,
  isStudio = false,
  locationName = '',
  catId = '',
  ...others
}) => {
  // const windowSize = useWindowSize();
  // const [isDesktop] = useState(windowSize.innerWidth >= COMMON.MOBILE_WINDOW);
  return (
    <>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0">
        {isCategory && (
          <>
            <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative px-6 md:px-44">
              <p className="flex-grow-0 flex-shrink-0 text-2xl font-medium text-white capitalize truncate w-[calc(100%-60px)]">
                {title || 'Photos'}
              </p>
              <Link
                href={`/photography/category/${id}`}
                className="flex items-center self-stretch flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.48]"
              >
                View all
              </Link>
            </div>

            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 md:px-44">
              <Swiper
                slidesPerView="auto"
                grid={{
                  rows: 2,
                }}
                spaceBetween={16}
                modules={[Grid, Navigation]}
                className="mySwiper"
                // navigation={isDesktop}
              >
                {Object.values(others)
                  .slice(0, 10)
                  .map((item, index) => (
                    <SwiperSlide key={index} className="imageSlice">
                      <SwiperBox
                        {...item}
                        catId={catId}
                        locationName={locationName}
                      />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </>
        )}

        {isPlaces && (
          <>
            <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative px-6 md:px-44">
              <p className="flex-grow-0 flex-shrink-0 text-2xl font-medium text-white capitalize">
                {title || 'Photos'}
              </p>
              <Link
                href={`/photography/places/${id}`}
                className="flex items-center self-stretch flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.48]"
              >
                View all
              </Link>
            </div>
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 md:px-44">
              <Swiper
                slidesPerView="auto"
                grid={{
                  rows: 2,
                }}
                spaceBetween={16}
                modules={[Grid, Navigation]}
                className="mySwiper"
                // navigation={isDesktop}
              >
                {Object.values(others)
                  .slice(0, 10)
                  .map((item, index) => (
                    <SwiperSlide key={index} className="imageSlice">
                      <SwiperBox
                        {...item}
                        locationName={locationName}
                        locationId={id}
                      />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </>
        )}

        {isStudio && (
          <>
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
              <StudioHeader
                studio_img={others.data.studio_img}
                studio_name={others.data.studio_name}
                studio_rating={others.data.studio_rating}
                studio_id={others.data.studio_id}
              />

              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 md:px-44">
                <Swiper
                  slidesPerView="auto"
                  grid={{
                    rows: 2,
                  }}
                  spaceBetween={16}
                  modules={[Grid, Navigation]}
                  className="mySwiper"
                >
                  {Object.values(others.data.details)
                    .slice(0, 10)
                    .map((item, index) => (
                      <SwiperSlide key={index} className="imageSlice">
                        <StudioMediaBox data={item} others={others.data} />
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

function SwiperBox(props) {
  const dispatch = useDispatch();
  return (
    <>
      <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-72 relative space-y-[-55px]">
        <div className="w-[288px] h-[164px] aspect-w-16 aspect-h-9 overflow-hidden rounded md:cursor-zoom-in relative">
          <Link
            href={`/photography/studios/studio-info?location_name=${
              props.locationName
            }&cat=${props.catId || props.category_id}&stu=${props.studio_id}${
              props.locationId ? '&location_id=' + props.locationId : ''
            }`}
          >
            <CustomImage
              fill
              alt="Swipe Images"
              src={props.thumb || '/288-164.png'}
              className="w-full h-full  bg-black object-cover object-left-50 object-top-1/3"
              sizes="(min-width: 780px) 453px, calc(97.61vw - 30px)"
              loading="lazy"
            />
          </Link>
        </div>
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative rounded-b bg-gradient-to-t from-black/60 to-black/0 h-[55px] gap-1 p-3">
          <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
            <Link
              href={`/photography/studios/${props.studio_id}`}
              onClick={() => dispatch(setSelectedIndex(0))}
            >
              <div className="w-7 h-7 overflow-hidden rounded-full relative">
                <CustomImage
                  src={props.studio_image}
                  className="w-full h-full bg-black"
                  fill
                  alt=""
                  sizes="calc(41.67vw - 80px)"
                  loading="lazy"
                />
              </div>
            </Link>
            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative">
              <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white">
                {props.studio_name || 'Studio Name'}
              </p>
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-0.5">
                <p className="flex-grow-0 flex-shrink-0 text-[10px] text-left capitalize text-white/[0.64]">
                  {props.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

//@ Path:  components/photography/studio
// Studios Image Media Box
function StudioMediaBox({ data, others }) {
  const router = useRouter();
  let refercode = '';
  if (router.query?.refer_code) {
    refercode = router.query.refer_code;
  }
  return (
    <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-72 relative space-y-[-55px]">
      <div className="w-[288px] h-[164px] aspect-w-16 aspect-h-9  overflow-hidden rounded md:cursor-zoom-in">
        <Link
          href={`/photography/studios/studio-info?cat=${
            data?.category_id
          }&stu=${others?.studio_id}&isStudio=true${
            refercode ? `&refer_code=${refercode}` : ''
          } `}
        >
          <Image
            fill
            alt=""
            src={data.thumb || '/288-164.png'}
            className="w-full h-full object-contain bg-black lg:w-full lg:h-full"
            unoptimized="true"
          />
        </Link>
      </div>
      <div className="flex flex-col justify-end items-start self-stretch flex-grow-0 flex-shrink-0 relative rounded-b bg-gradient-to-t from-black/60 to-black/0 h-[55px] px-4 py-3">
        <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-0.5">
          <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white">
            {data.category || 'Category'}
          </p>
        </div>
      </div>
    </div>
  );
}

// Studio Header
function StudioHeader({ studio_img, studio_name, studio_rating, studio_id }) {
  return (
    <>
      <div className="flex justify-between md:justify-start items-center md:items-start self-stretch flex-grow-0 flex-shrink-0 relative px-6 md:px-44">
        <Link href={`/photography/studios/${studio_id}`}>
          <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-3">
            <div className="w-12 h-12 overflow-hidden rounded-full">
              <LazyLoadImage
                src={studio_img || '/164-164.png'}
                className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
                width={48}
                height={48}
                alt={studio_name}
                effect="blur"
                onError={imageOnError}
              />
            </div>

            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-1 relative">
              <p className="flex-grow-0 flex-shrink-0 text-xl font-medium text-left capitalize text-white">
                {studio_name || 'Studio Name'}
              </p>
              <StudioRating studio_rating={studio_rating} />
            </div>
          </div>
        </Link>
        <Link href={`/photography/studios/${studio_id}`} className="md:p-2">
          <ChevronRightIcon className="w-4 h-4 text-white/40 md:text-white" />
        </Link>
      </div>
    </>
  );
}

export default SwipeCard;
