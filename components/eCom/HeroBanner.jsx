import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';

import BannerImage from './BannerImage';
import { orderBy } from 'lodash';
export default function Banner({ banners }) {
  const bannersList = orderBy(banners, ['sort_order'], 'asc');
  return (
    <div className="relative w-full">
      <div className="w-full flex overflow-hidden relative m-auto banner">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Pagination]}
          className="w-full h-full mySwiper p-0"
        >
          {bannersList?.map((banner, i) => (
            <SwiperSlide key={i}>
              <div className="w-full aspect-w-16 aspect-h-10 md:aspect-h-5 overflow-hidden rounded relative brightness-75">
                <BannerImage image={banner?.image} />
              </div>
              <div className="absolute top-4 w-full">
                <span className="text-3xl font-bold text-white text-center">
                  {banner?.text}
                </span>
                <span className="block text-xl font-bold text-white">
                  {banner?.description}
                </span>
                {/* <button>
                  <a href="#" target="_blank" rel="noreferrer">
                    <span className="text-white">Button</span>
                  </a>
                </button> */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
