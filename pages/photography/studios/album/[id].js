import useSWR from 'swr';
import { useRouter } from 'next/router';
import PrimaryLayout from '../../../../components/layout/PrimaryLayout';
import Header from '../../../../components/common/Header';
import * as api from '../../../../services/userService';
import ImageCard from '../../../../components/photos/ImageCard';
import SkeletonCard from '../../../../components/common/SkeletonCard';
import Arrowlefticon from '../../../../components/common/icons/arrowlefticon';
import { Gallery } from 'react-photoswipe-gallery';
import useLocationModal from '../../../../hooks/useLocationModal';
import { useUser } from '../../../../context/UserContext';

export default function PhotosDetails() {
  const { userId } = useUser();
  const router = useRouter();
  const { id,album } = router.query;
  useLocationModal({ willPopupVisible: true });
  const {
    data: response,
    isLoading,
    mutate,
  } = useSWR(
      (id) && [
        '/api/photography/category/stdio-info' + id,
      ],
    () => api.getFolderDetails(id,userId)
  );

  const items = response;


  return (
    <PrimaryLayout>
      <Header>
        <div className="flex flex-col justify-start items-start self-stretch relative bg-black">
          <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 px-6 pt-6 pb-4">
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
              <button onClick={() => router.back()}>
                <Arrowlefticon height={24} width={24} />
              </button>
            </div>
            <div className="flex flex-col justify-center items-start flex-grow relative  gap-1">
              {album && (
                <>
                  <p className="ml-3 flex-grow-0 flex-shrink-0 font-medium text-left capitalize text-white">
                    {`${album?.replace('-','&').split('_').join(' ')}`}
                  </p>
                </>
              ) 
              }
            </div>
          </div>
        </div>
      </Header>

      {/* Page Body */}
      {isLoading || !response ? (
        <div className='flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-8 py-8 md:px-44 bg-[#19191C]'>
        <SkeletonCard />
        </div>
      ) : (
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-8 py-8 md:px-44 bg-[#19191C]">
          {/* Title for Desktop only : Start */}
          <div className="hidden md:flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 py-4 gap-3 bg-[#19191C] border-b border-white/5 sticky top-[72px] z-10">
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
              <button onClick={() => router.back()}>
                <Arrowlefticon className="w-4 h-4" />
                </button>
                <div className="flex flex-col justify-center items-start flex-grow relative  gap-1">
              { (
                <>
                  <p className="ml-3 flex-grow-0 flex-shrink-0 font-medium text-left capitalize text-white">
                  {album? `${album?.replace('-','&').split('_').join(' ')}`:'Album name'}
                  </p>
                </>
              ) 
              }
            </div>
            </div>
          
            {/* <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-4">
              <Link
                href={`/booking?studio_id=${
                  items && items[0]?.studio_id
                }&cat_id=${
                  items && items[0].details && items[0]?.details[0]?.category_id
                }`}
                className="btn-primary self-stretch text-xs rounded-xl font-medium px-4 py-2 bg-blue-700/30 border border-blue-700"
              >
                Book Now
              </Link>
            </div> */}
          </div>
          {/* Title for Desktop only : End */}

          {/* Gallery : Start */}
          {items && (
            <>
              {/* Gallery */}
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                {items.length > 0 ? (
                  <>
                    <Gallery
                      options={{
                        zoom: true,
                        loop: false,
                        counter: false,
                        // close: false,
                        bgOpacity: 0.2,
                        padding: { top: 20, bottom: 40, left: 100, right: 100 },
                      }}
                    >
                      <div className="flex flex-col self-stretch flex-grow">
                          <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0">
                            {items?.map((item, index) => (
                              <ImageCard
                                key={index}
                                {...item}
                                studio_name={item?.studio_details?.studio_name}
                                studio_image={item?.studio_details?.studio_image}
                                studio_id={item?.studio_details?.studio_id}
                                isStudioInfo={true}
                                rating={item?.studio_details?.rating}
                                mutate={mutate}
                                heart_count={Number(item?.heart_count)}
                                is_heart={Number(item?.is_heart)}
                                dontShowStudio={true}
                              />
                            ))}
                          </div>
                      </div>
                    </Gallery>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                      <p className="text-center text-white">No item to show</p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          {/* Gallery : End */}
        </div>
      )}
    </PrimaryLayout>
  );
}
