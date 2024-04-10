import Link from 'next/link';
import TitleBox from '../common/TitleBox';
import useSWR from 'swr';
import * as api from '../../services/userService';
import SkeletonCard from '../common/SkeletonCard';
import { COMMON } from '../../constants/const';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { imageOnError } from '../../utils/errorImage';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Navigation } from 'swiper';
import { getLocalStorage } from '../../utils/localStore';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Image from 'next/image';
import CustomImage from '../CustomImage';

function CatergoryName({ title }) {
  return (
    <p className="text-base text-left capitalize text-white">
      {title !== null ? title : COMMON.CATEGORY_NAME}
    </p>
  );
}

function MediaBox0({ cat_id, cName, image, imageDesc, location }) {
  return (
    <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-2 w-72 relative space-y-[-px]">
      <Link
        href={{
          pathname: `/photography/category/${cat_id}`,
          query: { location: location?.name },
        }}
        className="w-72 h-40 aspect-w-16 aspect-h-9 rounded overflow-hidden relative"
      >
        <CustomImage
          src={image || '/164-164.png'}
          className="w-full h-full bg-black object-cover object-left-50 object-top-1/3"
          alt={imageDesc}
          fill
          quality={80}
          sizes="(min-width: 780px) 453px, calc(97.61vw - 30px)"
          loading="lazy"
        />
      </Link>
      {/* </Link> */}
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative h-12 gap-1">
        <CatergoryName title={cName} />
      </div>
    </div>
  );
}

const Photos = () => {
  const selectedLocation = getLocalStorage('location');
  const location =
    useSelector((state) => state.locationModal.location) || selectedLocation;
  useEffect(() => {
    window.addEventListener('storage', () => {});
  }, [location]);

  const { data, isLoading } = useSWR(
    location && ['/api/user/photographs/category-list', location?.id],
    () => api.getCategoryList(location?.id)
  );

  const items = data?.data;

  // const windowSize = useWindowSize();
  // const [isDesktop] = useState(windowSize.innerWidth >= COMMON.MOBILE_WINDOW);
  return (
    <>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
        <TitleBox>
          <h2 className="flex-grow-0 flex-shrink-0 text-2xl font-medium text-white">
            Photographs
          </h2>
          <Link
            href="/photography/category"
            className="flex items-center self-stretch flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.48]"
          >
            View all
          </Link>
        </TitleBox>
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0">
          {isLoading || !data ? (
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
                {items?.map((item, index) => {
                  return (
                    <SwiperSlide className="photoSlide" key={index}>
                      <MediaBox0
                        cat_id={item?.id}
                        cName={item?.name}
                        image={item?.thumb}
                        imageDesc={`${item?.name} image`}
                        location={location}
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

export default Photos;
