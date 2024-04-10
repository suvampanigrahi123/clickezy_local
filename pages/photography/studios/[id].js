/* eslint-disable jsx-a11y/no-redundant-roles */
import { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import Link from 'next/link';
import Header from '../../../components/common/Header';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import * as api from '../../../services/userService';
import ArrowLeftIcon from '../../../components/common/icons/arrowlefticon';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { imageOnError } from '../../../utils/errorImage';
import EmptyData from '../../../components/common/EmptyData';
import { StudioDetailsPreLoader } from '../../../components/preloader/studio';
import { getLocalStorage } from '../../../utils/localStore';
import { printLog } from '../../../helper/printLog';
import { useUser } from '../../../context/UserContext';
import { studioLabel } from '../../../constants/labelText';
import useLocationModal from '../../../hooks/useLocationModal';
import PrimaryLayout from '../../../components/layout/PrimaryLayout';
import { StarIcon } from '@heroicons/react/24/outline';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedIndex } from '../../../redux/slices/studioslice';
import StudioRating from '../../../components/StudioRating';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function StudioName({ title }) {
  return (
    <p className="flex-grow-0 flex-shrink-0 font-medium text-left capitalize text-white">
      {title ? `${title} Studio` : 'Studio Name'}
    </p>
  );
}

function StudioUserName({ title }) {
  return (
    <p className="flex-grow-0 flex-shrink-0 font-medium text-left capitalize text-white md:text-2xl">
      {title || 'Studio User Name'}
    </p>
  );
}

function StudioInfo({ image, studioName, studioRating, studioDesc }) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center flex-grow gap-4 md:gap-8">
        <div className="flex md:flex-row justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
          <div className="w-16 md:w-24 h-16 md:h-24 rounded-full overflow-hidden">
            <LazyLoadImage
              src={image || '/164-164.png'}
              className="w-full h-full object-cover bg-black lg:w-full lg:h-full"
              width={64}
              height={64}
              alt=""
              onError={imageOnError}
            />
          </div>
          <div className="flex flex-col justify-start items-start flex-grow relative md:gap-1">
            <p className="flex-grow-0 flex-shrink-0 text-[13px] font-medium text-left text-white/[0.64]">
              Photographer
            </p>
            <StudioUserName title={studioName} />
            {studioRating > 0 && <StudioRating studio_rating={studioRating} />}
          </div>
        </div>
        <div className="flex flex-col justify-center self-stretch flex-grow relative gap-2.5 md:hidden">
          <p className="text-xs text-left text-white/[0.64]">
            {studioDesc || 'Studio Description'}
          </p>
        </div>
      </div>
    </>
  );
}

function StudioUserInfo({
  studioId,
  studioImg,
  studioName,
  studioRating,
  studioDesc,
  locationId,
  category_id,
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 overflow-hidden gap-4 p-6 md:px-44">
      <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
        <div className="hidden md:flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
          <button onClick={() => router.back()}>
            <ArrowLeftIcon height={24} width={24} />
          </button>
        </div>
        <StudioInfo
          image={studioImg}
          studioName={studioName}
          studioRating={studioRating}
          studioDesc={studioDesc}
        />
      </div>
      <Link
        href={`/booking?studio_id=${studioId}&location_id=${locationId}&cat_id=${category_id}`}
        className="md:hidden btn-primary self-stretch"
      >
        Book Now
      </Link>
    </div>
  );
}

function Listbox(prop) {
  return (
    <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-4 border-b border-[#2E2F34] last:border-0 first:pt-0">
      <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-white">
        {prop.title}
      </p>
      <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
        {prop.icon && prop.icon} {prop.value}
      </p>
    </div>
  );
}

function MediaTitle({ title }) {
  return (
    <div className="flex flex-col justify-center md:justify-start items-center md:items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
      <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-white">
        {title || 'Title'}
      </p>
    </div>
  );
}

function MediaBox({ image, title }) {
  return (
    <>
      <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 relative gap-3">
        <div className="w-full md:w-40 md:h-40 aspect-w-16 aspect-h-16 ">
          <img
            src={image || '/164-164.png'}
            className="w-full h-full object-center object-cover bg-black rounded-lg"
            width={144}
            height={144}
            alt=""
            onError={imageOnError}
          />
        </div>

        <MediaTitle title={title} />
      </div>
    </>
  );
}

function Gallery({ data, studio_id, locationId }) {
  return (
    <>
      {data?.length > 0 ? (
        <div className="grid grid-cols-3 md:flex md:flex-wrap items-start gap-4 w-full">
          {data?.map((item, index) => {
            return (
              <Link
                href={`/photography/studios/studio-info?cat=${item?.category_id}&stu=${studio_id}&location_id=${locationId}`}
                key={index}
              >
                <MediaBox
                  image={item?.thumb}
                  title={item?.category_name}
                  cat_id={item?.category_id}
                  stu_id={studio_id}
                />
              </Link>
            );
          })}
        </div>
      ) : (
        <>
          <EmptyData />
        </>
      )}
    </>
  );
}
function EquipmentsInfo({ data }) {
  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col items-start gap-8">
          {data.map((item, index) => {
            return (
              <div
                key={index}
                className="flex justify-start items-start self-stretch relative gap-4 md:gap-8"
              >
                <div className="w-16 md:w-24 h-16 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <LazyLoadImage
                    src={item?.thumb || '/164-164.png'}
                    className="w-full h-full object-center object-cover bg-black rounded-lg"
                    width={144}
                    height={144}
                    alt="studio category image"
                    onError={imageOnError}
                  />
                </div>
                <div className="flex flex-col justify-start items-start flex-grow relative gap-1 md:gap-2 md:py-2">
                  <p className="flex-grow-0 flex-shrink-0 text-sm md:text-base font-medium text-left text-white">
                    {item?.name || 'Title'}
                  </p>
                  <p className="text-xs md:text-sm text-left text-white/[0.64]">
                    {item?.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <EmptyData />
        </>
      )}
    </>
  );
}

function StudioReviews({ reviews, data, getMoreData, isLoading, dashboard }) {
  function getTotal() {
    let total = 0;
    if (dashboard) {
      total =
        dashboard?.one_star +
        dashboard?.two_star +
        dashboard?.three_star +
        dashboard?.four_star +
        dashboard?.five_star;
    }
    return total;
  }
  function average() {
    let avg = 0;
    if (dashboard) {
      avg += (
        (dashboard?.one_star +
          dashboard?.two_star * 2 +
          dashboard?.three_star * 3 +
          dashboard?.four_star * 4 +
          dashboard?.five_star * 5) /
        getTotal()
      ).toFixed(2);
    }
    return Number(avg);
  }

  function getPercentage(rating) {
    if (!rating) {
      return 0;
    }
    return `${((getTotal() * 100) / rating).toFixed(2)}%`;
  }

  function getDifference(date) {
    if (!date) {
      return '';
    }
    const then = moment(`${date}`, 'DD-MM-YYYY');
    const now = moment(new Date(), 'YYYY-MM-DD');
    const duration = moment.duration(now.diff(then));
    if (duration.isValid()) {
      const day = Math.abs(Math.trunc(duration.asDays()));
      const weeks = Math.abs(Math.trunc(duration.asWeeks()));
      const month = Math.abs(Math.trunc(duration.asMonths()));
      const year = Math.abs(Math.trunc(duration.asYears()));
      return year > 0
        ? `${year > 1 ? `${year} years ago` : `${year} year ago`} `
        : month > 0
          ? `${month > 1 ? `${month} months ago` : `${month} month ago`}`
          : weeks > 0
            ? `${weeks > 0 ? `${weeks} weeks ago` : `${weeks} week ago`}`
            : `${day === 0
              ? 'Today'
              : `${day > 1 ? `${day} days ago` : `${day} day ago`}`
            }`;
    }
  }
  return (
    <>
      {getTotal() > 0 && (
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 overflow-hidden gap-4 p-6 md:px-44">
          <p className="flex-grow-0 flex-shrink-0 font-medium text-left capitalize text-white md:text-2xl">
            Review & Rating
          </p>
          <div className="flex w-full flex-col gap-4">
            <div className="w-[50%] max-md:w-full">
              <div className="flex justify-between">
                <p className="flex-grow-0 flex-shrink-0 font-medium text-left capitalize text-white md:text-2xl">
                  Rating
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <span className="text-3xl font-normal text-white">
                      {average()}
                    </span>
                    <StarIcon
                      width={20}
                      height={20}
                      fill="blue"
                      className="text-blue-500"
                    />
                  </div>
                  <span className="text-sm text-white/60 ">
                    {getTotal()} reviewers
                  </span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between w-full">
                <div className="w-full">
                  <div className="flex justify-center items-center gap-3">
                    <div className="flex justify-center items-center gap-1 w-1/5">
                      <span className="text-white text-lg">5</span>
                      <StarIcon
                        width={20}
                        height={20}
                        className="text-blue-500"
                      />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{
                          width: getPercentage(dashboard.five_star),
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-center items-center">
                      <span className="text-white text-lg">
                        {dashboard?.five_star}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-3">
                    <div className="flex justify-center items-center gap-1 w-1/5">
                      <span className="text-white text-lg">4</span>
                      <StarIcon
                        width={20}
                        height={20}
                        className="text-blue-500"
                      />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: getPercentage(dashboard.four_star) }}
                      ></div>
                    </div>
                    <div className="flex justify-center items-center gap-1">
                      <span className="text-white text-lg">
                        {dashboard?.four_star}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-3">
                    <div className="flex justify-center items-center gap-1 w-1/5">
                      <span className="text-white text-lg">3</span>
                      <StarIcon
                        width={20}
                        height={20}
                        className="text-blue-500"
                      />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: getPercentage(dashboard.three_star) }}
                      ></div>
                    </div>
                    <div className="flex justify-center items-center gap-1">
                      <span className="text-white text-lg">
                        {dashboard?.three_star}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-3">
                    <div className="flex justify-center items-center gap-1 w-1/5">
                      <span className="text-white text-lg">2</span>
                      <StarIcon
                        width={20}
                        height={20}
                        className="text-blue-500"
                      />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: getPercentage(dashboard.two_star) }}
                      ></div>
                    </div>
                    <div className="flex justify-center items-center gap-1">
                      <span className="text-white text-lg">
                        {dashboard?.two_star}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-3">
                    <div className="flex justify-center items-center gap-1 w-1/5">
                      <span className="text-white text-lg">1</span>
                      <StarIcon
                        width={20}
                        height={20}
                        className="text-blue-500"
                      />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: getPercentage(dashboard.one_star) }}
                      ></div>
                    </div>
                    <div className="flex justify-center items-center gap-1">
                      <span className="text-white text-lg">
                        {dashboard.one_star}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Review Comments */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <p className="flex-grow-0 flex-shrink-0 font-medium text-left capitalize text-white md:text-2xl pb-2">
                  Reviews
                </p>
              </div>
              <InfiniteScroll
                dataLength={0} //This is important field to render the next data
                next={getMoreData}
                hasMore={true}
                refreshFunction={() => { }}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                pullDownToRefreshContent={
                  <h3 style={{ textAlign: 'center' }}>Pull down to refresh</h3>
                }
                releaseToRefreshContent={
                  <h3 style={{ textAlign: 'center' }}>Release to refresh</h3>
                }
                loader={
                  isLoading && (
                    <div className="py-12 px-6 md:px-16">loading</div>
                  )
                }
              >
                <div className="flex flex-col w-full">
                  {reviews?.map((item, idx) => (
                    <StudioReview
                      key={idx}
                      item={item}
                      getDifference={getDifference}
                    />
                  ))}
                </div>
              </InfiniteScroll>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StudioReview({ item, getDifference }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <div className="w-16  h-16  rounded-full overflow-hidden">
          <LazyLoadImage
            src={item?.user_image}
            className="w-full h-full object-contain bg-black lg:w-full lg:h-full"
            width={64}
            height={64}
            alt=""
            onError={imageOnError}
          />
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex gap-2">
            <span className="font-bold text-[16px] text-white">
              {item?.user_name}
            </span>
          </div>
          <span className="font-thin text-[14px] text-white/[0.64]">
            Reviewed {getDifference(item?.date)}
          </span>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <p className="text-sm text-left text-white/[0.64]">
          {item?.rating} out 5 star for sure.
        </p>
        <p className="text-xs text-left text-white/[0.64]">
          {item?.message ? item?.message : 'No message Available'}
        </p>
      </div>
    </div>
  );
}

export default function StudiosDetails() {
  const router = useRouter();
  const { id, loc, tab } = router.query;
  useLocationModal({ willPopupVisible: true });
  const location = getLocalStorage('location') || loc;
  const [index, setindex] = useState(0);
  const [reviews, setreviews] = useState([]);

  const { data, isLoading } = useSWR(
    id && location && ['/api/photography/studio', id, location],
    () => api.getStudioDetails(location?.id, id)
  );

  const { data: response, isLoading: reviewLoading } = useSWR(
    id && ['/api/photography/reviews', id, index],
    () => api.getStudioReviews(id, index, 5)
  );

  const items = response?.review_data;
  useEffect(() => {
    if (items?.length > 0) {
      setreviews((prev) => [...prev, ...items]);
    }
  }, [items]);

  const getMoreData = () => {
    if (items?.length > 0 && !reviewLoading) {
      setindex(index + 1);
    }
  };

  const { userId } = useUser();
  /**
   * @send studio view Count
   */
  useEffect(() => {
    try {
      const ViewCount = async (payload) => {
        await api.setStudioViewCount(payload);
      };

      if (userId && id) {
        const payload = {
          user_id: userId,
          studio_id: id,
        };
        ViewCount(payload);
      }
    } catch (error) {
      printLog(error);
    }
  }, []);
  const { selectedIndex } = useSelector((state) => state.studio);
  const dispatch = useDispatch();
  const { data: folderList } = useSWR(
    id && ['/api/photography/studio', id],
    () => api.getFolderList(id)
  );

  return (
    <PrimaryLayout>
      <Header>
        <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 py-4">
          <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
            <button onClick={() => router.back()}>
              <ArrowLeftIcon height={24} width={24} />
            </button>
          </div>
          <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
            <StudioName title={data?.studio_name || ''} />
          </div>
        </div>
      </Header>

      {/* Page Body */}
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 bg-[#19191C] min-h-[inherit]">
        {isLoading || !data ? (
          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 overflow-hidden gap-4 p-6 md:px-44">
            <StudioDetailsPreLoader />
          </div>
        ) : (
          <>
            {/* When user click on studio book now button then the category will be selected as 1st category */}
            <StudioUserInfo
              studioId={data?.studio_id}
              studioImg={data?.studio_img}
              studioName={data?.studio_name}
              studioRating={data?.studio_rating}
              studioDesc={data?.about}
              locationId={data?.location_id}
              category_id={
                data?.photographs_category &&
                data?.photographs_category[0]?.category_id
              }
            />

            <Tab.Group
              selectedIndex={selectedIndex}
              defaultIndex={0}
              onChange={(selected) => {
                dispatch(setSelectedIndex(selected));
              }}
            >
              {/* Tab Head */}
              <Tab.List className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-6 px-6 md:px-44 py-2 bg-[#141417]">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'flex-grow-0 flex-shrink-0 rounded-lg py-2 md:px-3 text-sm md:text-base font-medium',
                      selected
                        ? 'text-blue-500'
                        : 'text-blue-100 hover:text-white'
                    )
                  }
                >
                  Gallery
                </Tab>

                <Tab
                  className={({ selected }) =>
                    classNames(
                      'flex-grow-0 flex-shrink-0 rounded-lg py-2 md:px-3 text-sm md:text-base font-medium',
                      selected
                        ? 'text-blue-500'
                        : 'text-blue-100 hover:text-white'
                    )
                  }
                >
                  Equipments
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'flex-grow-0 flex-shrink-0 rounded-lg py-2 md:px-3 text-sm md:text-base font-medium',
                      selected
                        ? 'text-blue-500'
                        : 'text-blue-100 hover:text-white'
                    )
                  }
                >
                  About
                </Tab>
                {folderList?.length > 0 && (
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        'flex-grow-0 flex-shrink-0 rounded-lg py-2 md:px-3 text-sm md:text-base font-medium',
                        selected
                          ? 'text-blue-500'
                          : 'text-blue-100 hover:text-white'
                      )
                    }
                  >
                    Portfolio
                  </Tab>
                )}
              </Tab.List>
              {/* Tab Body */}
              <Tab.Panels className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-6 p-6 md:px-44 md:py-10">
                {/* Gallery */}
                <Tab.Panel className="w-full">
                  <Gallery
                    data={data?.photographs_category}
                    studio_id={id}
                    locationId={data?.location_id}
                  />
                </Tab.Panel>
                {/* Equipments */}
                <Tab.Panel className="flex flex-col md:flex-row justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative md:gap-16 w-full">
                  <EquipmentsInfo data={data?.equipments} />
                </Tab.Panel>
                {/* About */}
                <Tab.Panel className="flex flex-col md:flex-row justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative md:gap-16">
                  <div className="hidden w-1/2 md:flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
                    <div className="flex flex-col justify-start items-start self-stretch relative border-b border-[#2E2F34]">
                      <Listbox
                        title={studioLabel.studioName}
                        value={data?.studio_name || ''}
                      />
                    </div>
                    <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                      <p className="flex-grow-0 flex-shrink-0 text-2xl md:text-base font-semibold text-left text-white ">
                        {studioLabel.description}
                      </p>
                    </div>
                    <p className="text-sm text-left text-white/[0.64] break-all">
                      {data?.about}
                    </p>
                  </div>
                  <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 md:flex-grow flex-shrink-0 relative md:bg-black/20 md:p-8 md:rounded-lg">
                    <Listbox
                      title={studioLabel.perHourPrice}
                      value={`₹ ${data?.studio_info?.per_hour || '0'} `}
                    />
                    <Listbox
                      title={studioLabel.perDaysPrice}
                      value={`₹ ${data?.studio_info?.per_day || '0'}`}
                    />
                    <Listbox
                      title={studioLabel.totalLikes}
                      value={`${data?.studio_info?.total_like || '0'}`}
                    />

                    <Listbox
                      title={studioLabel.totalVisits}
                      value={`${data?.studio_info?.studio_view_count || '0'}`}
                    />
                  </div>
                </Tab.Panel>
                {folderList?.length > 0 && (
                  <Tab.Panel className="flex flex-col md:flex-row justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative md:gap-16">
                    <FolderPanel data={folderList} id={id} />
                  </Tab.Panel>
                )}
              </Tab.Panels>
            </Tab.Group>

            <StudioReviews
              reviews={reviews}
              getMoreData={getMoreData}
              isLoading={reviewLoading}
              dashboard={response?.dashboard}
            />

            <SimilarStudios id={id} loc={loc} />
          </>
        )}
      </div>
    </PrimaryLayout>
  );
}

export const FolderPanel = ({ data }) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 items-start gap-4">
      {data?.map((folder, i) => (
        <Link
          key={i}
          className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 cursor-pointer"
          href={`/photography/studios/album/${folder?.booking_id
            }?album=${folder?.folder_name
              ?.replace('&', '-')
              .split(' ')
              .join('_')}`}
        >
          <div className="absolute top-4 right-4 max-md:top-0 max-md:right-0 flex gap-2 bg-gradient-to-r from-black">
            <svg
              className="MuiSvgIcon-root icon margin-r-5 text-white"
              focusable="false"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path>
            </svg>
            <span className="text-white">{folder?.no_of_photo}</span>
          </div>
          <div className="w-full aspect-h-[64] bg-white/5">
            {
              <img
                src={folder?.image}
                className="object-center object-cover rounded-lg h-[104px] w-[104px] md:w-[260px] md:h-[130px] lg:w-[390px] lg:h-[220px] lg:object-center md:items-center"
                alt={folder?.folder_name}
                onError={imageOnError}
              />
            }
          </div>
          <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 gap-1 absolute bottom-1 left-2 max-md:left-0 max-md:bottom-0">
            <p className="flex-grow-0 flex-shrink-0 text-xs md:text-base font-medium text-center text-white bg-gradient-to-r from-black">
              {folder?.folder_name}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

const SimilarStudios = ({ loc, id }) => {
  const location = getLocalStorage('location') || loc;
  const { data: similarStudioData } = useSWR(
    id && location && ['/api/photography/similar_studio', id, location],
    () => api.getStudioListsPagination(location?.id, 0, 10)
  );
  const items = similarStudioData?.data;
  return (
    <>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 py-3 gap-4  p-6 md:px-44 md:py-10">
        <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative  md:px-0">
          <p className="flex-grow-0 flex-shrink-0 text-xl font-medium text-white">
            Similar Studios
          </p>
          {items?.length > 0 && (
            <Link
              href="/photography/studios"
              className="flex items-center self-stretch flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.48]"
            >
              View all
            </Link>
          )}
        </div>
        {/* Body */}
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 studio_profile">
          {false ? (
            <></>
          ) : (
            <>
              <Swiper
                slidesPerView="auto"
                spaceBetween={16}
                //   modules={[Pagination]}
                className="mySwiper studio_profile"
                style={{ overflow: 'auto', scrollbarWidth: 'none' }}
              >
                {items
                  ?.filter((v, i) => v.studio_id !== id && i < 10)
                  ?.map((item, index) => {
                    return (
                      index < 9 && (
                        <SwiperSlide
                          className="studioSlice studio_profile"
                          key={index}
                        >
                          <StudioMediaBox
                            studio_id={item?.studio_id}
                            image={item?.studio_img}
                            studio_name={item?.studio_name}
                          />
                        </SwiperSlide>
                      )
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
function StudioMediaBox({ image, studio_name, studio_id }) {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-24 relative gap-2">
      {/* <Link href={`/photography/studios/${studio_id}`}> */}
      <Link
        href={`/photography/studios/${studio_id}`}
        onClick={() => dispatch(setSelectedIndex(0))}
        className="w-24 h-24 aspect-w-1 aspect-h-1 rounded-full overflow-hidden"
      >
        <LazyLoadImage
          src={image !== null && image ? image : '/164-164.png'}
          className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
          width={96}
          height={96}
          alt=""
          effect="blur"
          onError={imageOnError}
        />
      </Link>
      {/* </Link> */}
      <div>
        <span className="text-white text-xs ">
          {studio_name?.length > 10
            ? `${studio_name.slice(0, 10)}..`
            : studio_name}
        </span>
        <div className="text-[#808080] font-medium text-[12px]">Studio</div>
      </div>
    </div>
  );
}
