import Link from 'next/link';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import PrimaryLayout from '../../../../components/layout/PrimaryLayout';
import Header from '../../../../components/common/Header';
import * as api from '../../../../services/userService';
import ImageCard from '../../../../components/photos/ImageCard';
import SkeletonCard from '../../../../components/common/SkeletonCard';
import Arrowlefticon from '../../../../components/common/icons/arrowlefticon';
import { getLocalStorage } from '../../../../utils/localStore';
import { Gallery } from 'react-photoswipe-gallery';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useState } from 'react';
import { useUser } from '../../../../context/UserContext';
import useLocationModal from '../../../../hooks/useLocationModal';
import { useSelector } from 'react-redux';

export default function PhotosDetails() {
  const router = useRouter();
  const {
    isStudio,
    cat,
    stu,
    refer_code,
    location_name: selectLocation,
    location_id: location_id,
  } = router.query;
  useLocationModal({ willPopupVisible: true });
  const selectedLocation = getLocalStorage('location');

  // ** check if location id present in query then pick that one
  // ** if not then pick from redux store
  // ** else pick from local storage
  let location = '';
  if (router.query?.location_id) {
    location = router.query?.location_id ?? router.query.location_id;
  } else if (selectedLocation) {
    location = selectedLocation.id;
  }

  const { userId } = useUser();

  const [index, setIndex] = useState(0);
  const [data, setData] = useState([]);
  const locationId = location;
  const {
    data: response,
    isLoading,
    mutate,
  } = useSWR(
    cat &&
      locationId &&
      stu && [
        '/api/photography/category/stdio-info' + locationId,
        cat,
        stu,
        index,
      ],
    () => api.get_studio_details_(cat, stu, locationId, userId, index)
  );

  const items = response?.data;
  const [images, setimages] = useState([]);
  useEffect(() => {
    if (items && items[0]?.details?.length > 0) {
      setimages([...items[0]?.details]);
      setData(items);
    }
  }, [items]);

  const getMoreData = () => {
    if (
      response?.data?.length > 0 &&
      response?.total_elements > images?.length
    ) {
      setIndex(index + 1);
    }
  };
  const handleGalleryClose = () => {
    mutate([
      '/api/photography/category/stdio-info',
      cat,
      stu,
      locationId,
      index,
    ]);
  };
  const onBeforeOpen = (pswpInstance) => {
    pswpInstance.on('close', () => {
      handleGalleryClose();
    });
  };

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
            <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
              {isStudio ? (
                <>
                  <p className="ml-3 flex-grow-0 flex-shrink-0 font-medium text-left capitalize text-white">
                    {data && data[0]?.details && data[0]?.details[0]?.category}
                  </p>
                </>
              ) : (
                <>
                  <p className="ml-3 flex-grow-0 flex-shrink-0 font-medium text-left capitalize text-white">
                    {data && data[0]?.studio_name}
                  </p>
                </>
              )}
            </div>
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-4">
              <CustomLink
                stu={stu}
                cat={cat}
                refer_code={refer_code}
                locationName={selectLocation}
                locationId={locationId}
              />
            </div>
          </div>
        </div>
      </Header>

      {/* Page Body */}
      {isLoading && !data ? (
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-8 py-8 md:px-44 bg-[#19191C]">
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
            </div>
            <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
              {isStudio ? (
                <>
                  <p className="flex-grow-0 flex-shrink-0 text-2xl font-medium text-left capitalize text-white">
                    {data && data[0]?.details && data[0]?.details[0]?.category}
                  </p>
                </>
              ) : (
                <>
                  <p className="flex-grow-0 flex-shrink-0 text-2xl font-medium text-left capitalize text-white">
                    {data && data[0]?.studio_name}
                  </p>
                </>
              )}
            </div>
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-4">
              <CustomLink
                stu={stu}
                cat={cat}
                refer_code={refer_code}
                locationName={selectLocation}
                locationId={locationId}
              />
            </div>
          </div>
          {/* Title for Desktop only : End */}

          {/* Gallery : Start */}
          {data[0]?.details?.length > 0 && (
            <>
              {/* Gallery */}
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                {data[0]?.details?.length > 0 ? (
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
                      onBeforeOpen={onBeforeOpen}
                    >
                      <div className="flex flex-col self-stretch flex-grow">
                        <InfiniteScroll
                          dataLength={images.length} //This is important field to render the next data
                          next={getMoreData}
                          hasMore={true}
                          refreshFunction={() => {}}
                          pullDownToRefresh
                          pullDownToRefreshThreshold={50}
                          pullDownToRefreshContent={
                            <h3 style={{ textAlign: 'center' }}>
                              Pull down to refresh
                            </h3>
                          }
                          releaseToRefreshContent={
                            <h3 style={{ textAlign: 'center' }}>
                              Release to refresh
                            </h3>
                          }
                          loader={
                            isLoading && (
                              <div className="py-12 px-6 md:px-16">
                                <SkeletonCard />
                              </div>
                            )
                          }
                        >
                          <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0">
                            {images?.map((item, index) => (
                              <ImageCard
                                key={index}
                                {...item}
                                studio_name={data[0]?.studio_name}
                                studio_image={data[0]?.studio_img}
                                studio_id={data[0]?.studio_id}
                                isStudioInfo={true}
                                mutate={mutate}
                                dontShowStudio={true}
                              />
                            ))}
                          </div>
                        </InfiniteScroll>
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

function CustomLink({ stu, cat, refer_code, locationName, locationId }) {
  let query = '';
  if (locationId) {
    query = query + `&location_id=${locationId}`;
  }
  if (locationName) {
    query = query + `&location_name=${locationName}`;
  } else if (refer_code) {
    query = query + `&refer_code=${refer_code}`;
  }
  return (
    <>
      <Link
        href={`/booking?studio_id=${stu}&cat_id=${cat}${query}`}
        className="btn-primary self-stretch text-xs rounded-xl font-medium px-4 py-2"
      >
        Book Now
      </Link>
    </>
  );
}
