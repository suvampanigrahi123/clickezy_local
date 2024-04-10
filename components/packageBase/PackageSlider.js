import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper';
import SliderImage from './SliderImage';

import 'swiper/css';
import 'swiper/css/pagination';

export default function PackageSlider({ bannersList }) {
  return (
    <div className="relative w-full h-full">
      <div className="w-full flex overflow-hidden relative m-auto banner h-full">
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
            <SwiperSlide key={i} className="home_swiper_slide">
              <div className="w-full aspect-w-16 aspect-h-10 md:aspect-h-5 overflow-hidden rounded relative brightness-75 h-full">
                <SliderImage image={banner?.image} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
