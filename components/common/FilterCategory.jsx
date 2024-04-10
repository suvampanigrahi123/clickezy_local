import Router from 'next/router';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';
import 'swiper/css/free-mode';
const FilterCategory = ({ category, url }) => {
  const { filter } = useSelector((state) => state.filterTab);
  const items = category?.data;

  const filterCategory = items?.map((item) => {
    return {
      id: item.id,
      name: item.name,
    };
  });
  const handleFilter = (id, url) => {
    window.dispatchEvent(new Event('filterChange'));
    Router.push(`${url}/${id}`);
  };
  return (
    <>
      <div className="flex flex-col justify-center overflow-hidden self-stretch flex-grow-0 flex-shrink-0 px-3 md:px-16 py-2 md:bg-black/20">
        <nav className="flex sm:justify-center gap-2">
          <Swiper
            slidesPerView="auto"
            spaceBetween={10}
            freeMode={true}
            modules={[FreeMode]}
            className="mySwiper"
          >
            {filterCategory?.map((item) => (
              <SwiperSlide key={item.id} className="filterSlider">
                <div
                  onClick={() => handleFilter(item.id, url)}
                  className={`text-sm px-3 py-2 cursor-pointer w-auto rounded-full transition-all
                    ${filter.toLowerCase() === item.name.toLowerCase()
                      ? 'text-slate-950 bg-[#fff] hover:bg-slate-50 font-[500]'
                      : 'text-white bg-[#323232] hover:bg-slate-800 font-normal'
                    }
                  `}
                >
                  {item.name}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </nav>
      </div>
    </>
  );
};

export default FilterCategory;
