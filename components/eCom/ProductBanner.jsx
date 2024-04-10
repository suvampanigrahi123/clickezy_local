import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';
import BannerImage from './BannerImage';
import { memo, useEffect, useRef, useState } from 'react';

function ProductBanner({ banners = [], dynamicImage, isLoading }) {
  const swiperRef = useRef(null);
  const [swiper, setSwiper] = useState(null);

  let bannerImage = [];

  const createBanner = (banners) => {
    let banner = [];
    if (dynamicImage) {
      banner.unshift(dynamicImage, ...banners);
    } else {
      banner = banners;
    }
    return banner;
  };

  bannerImage = createBanner(banners);
  useEffect(() => {
    if (bannerImage && swiper) {
      swiper?.slideTo(0, 2000);
    }
  }, [bannerImage]);

  return (
    <div className="relative h-full md:h-[60vh] w-full">
      <div className="w-full h-full flex overflow-hidden relative m-auto banner">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          // autoplay={{
          //   delay: 8000,
          //   disableOnInteraction: false,
          // }}
          pagination={{
            clickable: true,
          }}
          lazy="true"
          modules={[Autoplay, Pagination]}
          className="w-full h-full mySwiper p-0"
          ref={swiperRef}
          onSwiper={(swiper) => setSwiper(swiper)}
        >
          {bannerImage?.map((banner, i) => (
            <SwiperSlide key={i} className="productSlider">
              <div className="w-full h-full  aspect-w-16 aspect-h-10 md:aspect-h-5 overflow-hidden">
                <BannerImage image={banner} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default memo(ProductBanner);
