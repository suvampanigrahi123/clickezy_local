import Link from 'next/link';
import TitleBox from '../common/TitleBox';
import useSWR from 'swr';
import * as api from '../../services/userService';
import SkeletonCard from '../common/SkeletonCard';
// import Image from 'next/image';
import { imageOnError } from '../../utils/errorImage';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';
import { getLocalStorage } from '../../utils/localStore';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setSelectedIndex } from '../../redux/slices/studioslice';
import Image from 'next/image';
import 'swiper/css/free-mode';
import 'swiper/css';
import CustomImage from '../CustomImage';
function StudioName({ title }) {
  return (
    <div className="flex justify-center relative w-full">
      <p className="text-xs text-center text-white capitalize break-words truncate">
        {title || ''}
      </p>
    </div>
  );
}

function MediaBox({ image, studio_name, studio_id }) {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-24 relative gap-2">
      {/* <Link href={`/photography/studios/${studio_id}`}> */}
      <Link
        href={`/photography/studios/${studio_id}`}
        onClick={() => dispatch(setSelectedIndex(0))}
        className="w-24 h-24 aspect-w-1 aspect-h-1 rounded-full overflow-hidden relative"
      >
        <CustomImage
          src={image || '/164-164.png'}
          className="w-full h-full object-center bg-black object-cover object-left-50 object-top-1/3"
          fill
          quality={80}
          alt=""
          sizes="(min-width: 780px) 453px, calc(97.61vw - 30px)"
          loading="lazy"
        />
      </Link>
      {/* </Link> */}
      <StudioName title={studio_name} />
    </div>
  );
}

const Studio = () => {
  const selectedLocation = getLocalStorage('location');
  const location =
    useSelector((state) => state.locationModal.location) || selectedLocation;
  useEffect(() => {
    window.addEventListener('storage', () => {});
  }, [location]);

  const { data, isLoading } = useSWR(location?.id && '/api/user/studios', () =>
    api.getStudioList(location?.id)
  );
  const items = data?.data;
  return (
    <>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
        <TitleBox>
          <h2 className="flex-grow-0 flex-shrink-0 text-2xl font-medium text-white">
            Studios
          </h2>
          <Link
            href="/photography/studios"
            className="flex items-center self-stretch flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.48]"
          >
            View all
          </Link>
        </TitleBox>
        {/* Body */}
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0">
          {isLoading || !data ? (
            <SkeletonCard />
          ) : (
            <>
              <Swiper
                slidesPerView="auto"
                spaceBetween={16}
                modules={[FreeMode]}
                freeMode={true}
                className="mySwiper"
              >
                {items?.map((item, index) => {
                  return (
                    <SwiperSlide className="studioSlice" key={index}>
                      <MediaBox
                        studio_id={item?.id}
                        image={item?.image}
                        studio_name={item?.name}
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

export default Studio;
