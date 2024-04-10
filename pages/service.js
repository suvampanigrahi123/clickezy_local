import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import Link from 'next/link';
import * as api from '../services/userService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Navigation } from 'swiper';
import SkeletonCard from '../components/common/SkeletonCard';
import { imageOnError } from '../utils/errorImage';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ArrowLeftIcon from '../components/common/icons/arrowlefticon';
import useSWR from 'swr';
import { getLocalStorage } from '../utils/localStore';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedIndex } from '../redux/slices/studioslice';

const Service = () => {
  const router = useRouter();
  // const selectedLocation = getLocalStorage('location');
  // const location = useCurrentLocation();
  // useEffect(() => {
  //   window.addEventListener('storage', () => {});
  // }, [location]);

  const { data } = useSWR(
    router?.query?.id && ['/studios/get/by/cat/id', router?.query?.id],
    () => api.getServiceGalleryPhotos(router?.query?.id)
  );

  return (
    <div className="pb-10">
      <div className="bg-black py-3">
        <div className="flex items-center py-2 mx-3 gap-3 flex-row justify-start">
          <Link href={'/'}>
            <ArrowLeftIcon />
          </Link>
          <span className="text-white font-medium text-xl font-sans">
            {router?.query?.name}
          </span>
        </div>
      </div>
      <div className=" bg-[#19191c] h-full">
        <div className="mx-5">
          {/* BANNER */}
          <img
            src={data?.banner_image}
            className="bg-black my-7 object-contain h-[180px] w-full "
            alt="footer_image"
          />
          <div>
            <span className="text-white text-[35px] font-sans">
              Capture Your {router?.query?.name} Memories with Us
            </span>
            <p className="py-2 text-[#ffffffa3] text-xs font-sans">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat.
            </p>
          </div>

          {/* related photography */}
          <div>
            <RelatedPhotography cat_id={router?.query?.id} />
          </div>

          {/* {"studios"} */}
          <div>
            <Studio cat_id={router?.query?.id} />
          </div>

          {/* GALLERY */}
          <div>
            <Gallery cat_id={router?.query?.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;

function MediaBox0({ details }) {
  const dispatch = useDispatch();
  return (
    <div className="flex   flex-col justify-start items-start flex-grow-0 flex-shrink-0   mt-3 relative space-y-[-px]">
      {/* <Link href={`/photography/category/${cat_id}`}> */}

      <div
        //   href={`/photography/category/${cat_id}`}
        className="w-72 h-40 relative  aspect-w-16  aspect-h-9 rounded overflow-hidden"
      >
        <LazyLoadImage
          src={details?.image ? details?.image : '/images/placeholder.png'}
          className="w-full  h-full object-contain bg-black lg:w-full lg:h-full"
          alt={'imageDesc'}
          width={288}
          height={164}
          style={{
            maxWidth: '288px',
            maxHeight: '164px',
          }}
          effect="blur"
          onError={imageOnError}
        />
        <Link
          href={`/photography/studios/${details?.studio_id}`}
          onClick={() => dispatch(setSelectedIndex(0))}
          className="absolute top-[60%]  m-4 left-0 w-full right-0"
        >
          <div className="flex gap-2 justify-start items-center">
            <LazyLoadImage
              src={
                details?.studio_image
                  ? details?.studio_image
                  : '/images/placeholder.png'
              }
              className="w-8  h-8 rounded-full object-contain bg-black "
              alt={'imageDesc'}
              effect="blur"
              onError={imageOnError}
            />
            <div className="flex-col justify-start">
              <p className="text-white font-medium text-[10px] text-left">
                {details?.studio_name}
              </p>
              <p className="text-[#ffffffa3] font-medium text-[8px] text-left">
                {details?.categoryName}
              </p>
            </div>
          </div>
        </Link>
      </div>
      {/* </Link> */}
      {/* <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative h-12 gap-1">
          cate gory name
        </div> */}
    </div>
  );
}
function MediaBox1({ details }) {
  return (
    <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0  mt-3 relative space-y-[-px]">
      <div className="w-72 h-40 max-md:w-40 aspect-w-16  aspect-h-9 rounded overflow-hidden">
        <LazyLoadImage
          src={details?.image ? details?.image : '/images/placeholder.png'}
          className="w-full  h-full object-contain bg-black lg:w-full lg:h-full"
          alt={'imageDesc'}
          width={'100%'}
          height={'100%'}
          effect="blur"
          onError={imageOnError}
        />
      </div>
    </div>
  );
}
const Studio = ({ cat_id }) => {
  const selectedLocation = getLocalStorage('location');
  const location =
    useSelector((state) => state.locationModal.location) || selectedLocation;
  useEffect(() => {
    window.addEventListener('storage', () => { });
  }, [location]);

  const { data } = useSWR(
    cat_id && ['/studios/get/by/cat/id', cat_id, location?.id],
    () => api.getRelatePhotos({ cat_id, locationId: location?.id })
  );
  return (
    <>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 py-3 gap-4">
        <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative  md:px-0">
          <p className="flex-grow-0 flex-shrink-0 text-xl font-medium text-white">
            Meet Our Photographer
          </p>
          {data?.length > 0 && (
            <Link
              href="/photography/studios"
              className="flex items-center self-stretch flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.48]"
            >
              View all
            </Link>
          )}
        </div>
        {/* Body */}
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0">
          {false ? (
            <SkeletonCard />
          ) : (
            <>
              <Swiper
                slidesPerView="auto"
                spaceBetween={16}
                //   modules={[Pagination]}
                className="mySwiper"
              >
                {data?.map((item, index) => {
                  return (
                    <SwiperSlide className="studioSlice" key={index}>
                      <MediaBox
                        studio_id={item?.studio_id}
                        image={item?.studio_image}
                        studio_name={item?.studio_name}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </>
          )}
        </div>
      </div>
    </>
  );
};

function MediaBox({ image, studio_name, studio_id }) {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-24 relative gap-2">
      {/* <Link href={`/photography/studios/${studio_id}`}> */}
      <Link
        href={`/photography/studios/${studio_id}`}
        onClick={() => dispatch(setSelectedIndex(0))}
        className="w-24 h-24 aspect-w-1 aspect-h-1 rounded-full overflow-hidden"
      >
        <LazyLoadImage
          src={image !== null && image ? image : '/164-164.png'}
          className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
          width={96}
          height={96}
          alt=""
          effect="blur"
          onError={imageOnError}
        />
      </Link>
      {/* </Link> */}
      <div>
        <span className="text-white text-xs ">
          {studio_name?.length > 10
            ? `${studio_name.slice(0, 10)}..`
            : studio_name}
        </span>
        <div className="text-[#808080] font-medium text-[12px]">Studio</div>
      </div>
    </div>
  );
}

const RelatedPhotography = ({ cat_id }) => {
  const selectedLocation = getLocalStorage('location');
  const location =
    useSelector((state) => state.locationModal.location) || selectedLocation;
  useEffect(() => {
    window.addEventListener('storage', () => { });
  }, [location]);
  const { data } = useSWR(
    cat_id && ['/studios/get/by/cat/id', cat_id, location?.id],
    () => api.getRelatePhotos({ cat_id, locationId: location?.id })
  );

  return (
    <div className="flex flex-col  justify-start items-start self-stretch flex-grow-0 flex-shrink-0 ">
      <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-2 md:px-0">
        <p className="flex-grow-0 flex-shrink-0 text-xl font-medium text-white">
          Relate Photography
        </p>
        {data?.length > 0 && (
          <Link
            href={`/photography/category/${cat_id}`}
            className="flex items-center self-stretch flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.48]"
          >
            View all
          </Link>
        )}
      </div>
      <div className="flex   flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0">
        {false ? (
          <SkeletonCard />
        ) : (
          <>
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
              {data?.map((item, index) => {
                return (
                  <SwiperSlide className="photoSlide" key={index}>
                    <MediaBox0 details={item} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        )}
      </div>
    </div>
  );
};

const Gallery = ({ cat_id }) => {
  const selectedLocation = getLocalStorage('location');
  const location =
    useSelector((state) => state.locationModal.location) || selectedLocation;
  useEffect(() => {
    window.addEventListener('storage', () => { });
  }, [location]);

  const { data } = useSWR(
    cat_id && ['/user/images/get/by/cat/id', cat_id],
    () => api.getServiceGalleryPhotos(cat_id)
  );

  return (
    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 ">
      <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-2 md:px-0">
        <p className="flex-grow-0 flex-shrink-0 text-xl font-medium text-white">
          Our Galley
        </p>
        {data?.category_image_list?.length > 0 && (
          <Link
            href={`/photography/category/${cat_id}`}
            className="flex items-center self-stretch flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.48]"
          >
            View all
          </Link>
        )}
      </div>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0">
        {false ? (
          <SkeletonCard />
        ) : (
          <>
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
              {data?.category_image_list?.map((item, index) => {
                return (
                  <SwiperSlide className="photoSlide" key={index}>
                    <MediaBox1 details={item} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        )}
      </div>
    </div>
  );
};
