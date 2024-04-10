import Router, { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';
import 'swiper/css/free-mode';

const PackageFilterCategory = ({ category, url }) => {
  const { packagefilters } = useSelector((state) => state.packagefilter);
  console.log('packagefileters..', category);
  const items = category?.data;

  const filterCategory = items?.map((item) => {
    return {
      id: item.category_id,
      name: item.category_name,
    };
  });
  const router=useRouter()
  
  const handleFilter = (categoryId) => {
    console.log('filtercategory..', categoryId);
    Router.push(`/packagecategory/category/${categoryId}`);
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
            {/* Adding the 'All' option */}
            <SwiperSlide key="all" className="filterSlider">
              <div
              onClick={()=>router.push('/packagecategory/category')}
                // Assuming 'all' as the ID for showing all studios
                className={`text-sm px-10  py-2 cursor-pointer w-auto rounded-full transition-all
                    ${false
                      ? 'text-slate-950 bg-[#fff] hover:bg-slate-50 font-[500]'
                      : 'text-white bg-[#323232] hover:bg-slate-800 font-normal'
                    }
                  `}
              >
                All
              </div>
            </SwiperSlide>

            {/* Mapping other categories */}
            {category?.category_data?.map((item) => (
              <SwiperSlide key={item.id} className="filterSlider">
                <div
                  onClick={() =>  handleFilter(item.category_id)}
                  className={`text-sm px-10  py-2 cursor-pointer w-auto rounded-full transition-all
                    ${false
                      ? 'text-slate-950 bg-[#fff] hover:bg-slate-50 font-[500]'
                      : 'text-white bg-[#323232] hover:bg-slate-800 font-normal'
                    }
                  `}
                >
                  {item.category_name}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </nav>
      </div>
    </>
  );
};

export default PackageFilterCategory;
