import Link from 'next/link';
import TitleBox from '../common/TitleBox';
import useSWR from 'swr';
import * as api from '../../services/userService';
import SkeletonCard from '../common/SkeletonCard';
// import Image from 'next/image';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { imageOnError } from '../../utils/errorImage';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getLocalStorage } from '../../utils/localStore';

function LocationName({ title }) {
  return (
    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
      <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-center text-white">
        {title ? title : 'Location'}
      </p>
    </div>
  );
}

function MediaBox({ location_id, image, location }) {
  return (
    <div className="flex flex-col justify-center items-start flex-grow-0 flex-shrink-0 w-36 relative gap-3">
      {/* <Link href={`/photography/places/${location_id}`}> */}
      <Link
        href={`/photography/places/${location_id}`}
        className="w-36 h-36 aspect-w-1 aspect-h-1  rounded overflow-hidden"
      >
        <LazyLoadImage
          src={image !== null && image ? image : '/images/placeholder.png'}
          className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
          alt={image}
          width={144}
          height={144}
          style={{
            maxWidth: '144px',
            maxHeight: '144px',
          }}
          effect="blur"
          onError={imageOnError}
        />
      </Link>
      {/* </Link> */}
      <LocationName title={location} />
    </div>
  );
}

const Places = () => {
  const query = { id: 1, name: 'Bhubaneswar' };
  const selectedLocation = getLocalStorage('location');
  const location =
    useSelector((state) => state.locationModal.location) ||
    selectedLocation ||
    query;
  useEffect(() => {
    window.addEventListener('storage', () => {});
  }, [location]);

  const { data, isLoading } = useSWR('/api/user/places', () =>
    api.getPhotographs_Place_List(location?.id)
  );
  const items = data?.data;
  return (
    <>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
        <TitleBox>
          <p className="flex-grow-0 flex-shrink-0 text-2xl font-medium text-white">
            Places
          </p>
          <Link
            href="/photography/places"
            className="flex items-center self-stretch flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.48]"
          >
            View all
          </Link>
        </TitleBox>
        {/* Body */}
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 md:px-0 overflow-x-auto">
          {isLoading || !data ? (
            <SkeletonCard />
          ) : (
            <>
              <Swiper
                slidesPerView="auto"
                spaceBetween={1}
                modules={[Pagination]}
                className="mySwiper"
              >
                <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 gap-2">
                  {items?.map((item, index) => {
                    return (
                      item?.details.length > 0 && (
                        <SwiperSlide className="placeSlide" key={index}>
                          <MediaBox
                            location_id={item?.location_id}
                            image={item?.details[0]?.image}
                            location={item?.location_name}
                          />
                        </SwiperSlide>
                      )
                    );
                  })}
                </div>
              </Swiper>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Places;
