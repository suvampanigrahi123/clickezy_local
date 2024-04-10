import Link from 'next/link';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import PrimaryLayout from '../../../components/layout/PrimaryLayout';
import Header from '../../../components/common/Header';
import TitleBox from '../../../components/common/TitleBox';
import * as api from '../../../services/userService';
import Studio from '../../../components/photos/Studio';
import ImageCard from '../../../components/photos/ImageCard';
import SearchIcon from '../../../components/common/icons/search';
import { uniqBy } from 'lodash';
import Arrowlefticon from '../../../components/common/icons/arrowlefticon';
import CategoryDetailsSkeleton from '../../../components/preloader/categorydetails';
import { useUser } from '../../../context/UserContext';

export default function PhotosDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { userId } = useUser();
  const { data, isLoading, mutate } = useSWR(
    id && ['/api/photography/category', id],
    () => api.get_Place_List_By_ID(id, userId)
  );

  const items = data?.data;
  const studioList = items && uniqBy(items[0]?.details, 'studio_id');

  return (
    <PrimaryLayout>
      <Header>
        <div className="flex flex-col justify-start items-start self-stretch relative bg-black">
          <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 px-6 pt-6 pb-4 gap-3">
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
              <button onClick={() => router.back()}>
                <Arrowlefticon height={24} width={24} />
              </button>
            </div>
            <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
              <p className="flex-grow-0 flex-shrink-0 font-medium text-left capitalize text-white">
                {items && items[0]?.location_name}
              </p>
            </div>
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-4">
              <Link
                // href=""
                href={`/booking?location_id=${items && items[0]?.location_id}`}
                className="btn-primary text-xs rounded-xl font-medium px-4 py-2"
              >
                Book Now
              </Link>
              <Link
                href="/search"
                className="flex justify-start items-center relative gap-2.5"
              >
                <SearchIcon />
              </Link>
            </div>
          </div>
        </div>
      </Header>

      {/* Page Body */}
      {isLoading || !data ? (
        <CategoryDetailsSkeleton />
      ) : (
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-8 py-8 md:px-44 bg-[#19191C]">
          {items && (
            <>
              <div className="hidden md:flex flex-col self-stretch flex-grow py-4 bg-[#19191C] border-b border-white/5 sticky top-[72px] z-10">
                <TitleBox>
                  <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1 gap-3">
                    <button onClick={() => router.back()}>
                      <Arrowlefticon className="w-4 h-4" />
                    </button>
                    <p className="flex-grow-0 flex-shrink-0 text-2xl font-medium text-white capitalize">
                      {items[0]?.location_name}
                    </p>
                  </div>
                  <Link
                    href={`/booking?location_id=${items[0]?.location_id}`}
                    className="btn-primary text-xs rounded-xl font-medium px-4 py-2 bg-blue-700/30 border border-blue-700"
                  >
                    Book Now
                  </Link>
                </TitleBox>
              </div>

              {/* Studio */}
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 md:px-0 overflow-x-auto scrollbar-thin scrollbar-track-current scrollbar-thumb-slate-600 scrollbar-corner-black">
                <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 gap-4">
                  {studioList?.map((item, index) => (
                    <Studio
                      key={index}
                      {...item}
                      location_id={id}
                      isPlace={true}
                    />
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                {/* <Gallery options={{ zoom: false, loop: false }}> */}
                <div className="flex flex-col self-stretch flex-grow">
                  {/* Infinity Scroll : Start */}
                  <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0">
                    {items[0]?.details?.map((item, index) => (
                      <ImageCard
                        key={index}
                        {...item}
                        id={id}
                        mutate={mutate}
                        isLocation={true}
                        location_name={items[0]?.location_name}
                      />
                    ))}
                  </div>
                  {/* Infinity Scroll : End */}
                </div>
                {/* </Gallery> */}
              </div>
            </>
          )}
        </div>
      )}
    </PrimaryLayout>
  );
}
