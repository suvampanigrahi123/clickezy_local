import useSWR from 'swr';
import * as api from '../../../services/userService';
import * as Yup from 'yup';
import Link from 'next/link';
import SecondaryLayout from '../../../components/layout/SecondaryLayout';
import Header from '../../../components/common/Header';
import ArrowLeftIcon from '../../../components/common/icons/arrowlefticon';
import CalenderIcon from '../../../components/common/icons/calendericon';
import LocationSymbol from '../../../components/common/icons/location';
import { useRouter } from 'next/router';
import moment from 'moment/moment';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { imageOnError } from '../../../utils/errorImage';
import AuthProvider from '../../../components/common/AuthProvider';
import { Fragment, useEffect, useState } from 'react';
import { mybookingLabel } from '../../../constants/labelText';
import {
  getBookingDuration,
  getDifference,
} from '../../../utils/CountdownTimer';
import { toast } from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { BookingDetailsSkeleton } from '../../../components/preloader/bookingdetails';
import StarRatings from 'react-star-ratings';
import { useUser } from '../../../context/UserContext';
import { useFormik } from 'formik';
import {
  ChangeStatusOfView,
  OptionModal,
} from '../../../components/bookingdetails/optionModal';
import { EditRatingModal } from '../../../components/bookingdetails/EditRatingModal';

function MediaBox({ source, booking_id }) {
  const router = useRouter();
  const navigateToRetouch = (id) => {
    router.push(`/user/photo_detail?booking_id=${booking_id}&image_id=${id}`);
  };
  return (
    <>
      {source?.map((item, index) => (
        <div key={index}>
          <div
            onClick={() => navigateToRetouch(item?.id)}
            className="flex flex-col justify-center items-stretch flex-grow-0 flex-shrink-0 relative gap-3 cursor-pointer"
          >
            <div className="aspect-w-16 aspect-h-16 ">
              <LazyLoadImage
                src={item?.thumb}
                className="w-full h-full object-center object-cover bg-black rounded-lg"
                alt="media"
                width={51}
                height={50}
                onError={imageOnError}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
function CompleteMediaBox({ source, booking_id, changeStatus, mutate }) {
  const [selectedPrivateImages, setselectedPrivateImages] = useState([]);
  const [selectedPublicImages, setselectedPublicImages] = useState([]);
  const router = useRouter();
  const navigateToRetouch = (id) => {
    if (changeStatus) {
      return;
    }
    router.push(`/user/photo_detail?booking_id=${booking_id}&image_id=${id}`);
  };
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col gap-2">
        {source?.filter((sou) => sou?.is_public === 1)?.length > 0 && (
          <div className="flex w-full justify-between">
            <p className="flex-grow-0 flex-shrink-0 text-[10px] text-center uppercase text-white/[0.64]">
              Public Images
            </p>
            {selectedPublicImages?.length > 0 && changeStatus && (
              <OptionModal
                is_public={1}
                selectedImages={selectedPublicImages}
                setselected={setselectedPublicImages}
                mutate={mutate}
              />
            )}
          </div>
        )}
        <div className="grid grid-cols-4 items-start gap-2 w-full">
          {source
            ?.filter((sou) => sou?.is_public === 1)
            ?.map((item, index) => (
              <div key={index} className="">
                <div
                  onClick={() => navigateToRetouch(item?.id)}
                  className="flex flex-col justify-center items-stretch flex-grow-0 flex-shrink-0 relative gap-3 cursor-pointer"
                >
                  {changeStatus && (
                    <input
                      type="checkbox"
                      className="absolute top-1 left-1 z-10"
                      checked={selectedPublicImages?.find(
                        (selected) => selected.id === item?.id
                      )}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                          setselectedPublicImages([
                            ...selectedPublicImages,
                            item,
                          ]);
                        } else {
                          setselectedPublicImages(
                            selectedPublicImages.filter(
                              (selected) => selected.id !== item.id
                            )
                          );
                        }
                      }}
                    />
                  )}
                  <div className="aspect-w-16 aspect-h-16 ">
                    <LazyLoadImage
                      src={item?.thumb}
                      className="w-full h-full object-center object-cover bg-black rounded-lg"
                      alt="media"
                      width={51}
                      height={50}
                      onError={imageOnError}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        {source?.filter((sou) => sou?.is_public === 0)?.length > 0 && (
          <div className="flex w-full justify-between">
            <p className="flex-grow-0 flex-shrink-0 text-[10px] text-center uppercase text-white/[0.64]">
              Private Images
            </p>
            {selectedPrivateImages?.length > 0 && changeStatus && (
              <OptionModal
                is_public={0}
                selectedImages={selectedPrivateImages}
                setselected={setselectedPrivateImages}
              />
            )}
          </div>
        )}
        <div className="grid grid-cols-4 items-start gap-2 w-full">
          {source
            ?.filter((sou) => sou?.is_public === 0)
            ?.map((item, index) => (
              <div key={index} onClick={(e) => navigateToRetouch(item?.id)}>
                <div className="flex flex-col justify-center items-stretch flex-grow-0 flex-shrink-0 relative gap-3 cursor-pointer">
                  {changeStatus && (
                    <input
                      type="checkbox"
                      className="absolute top-1 left-1 z-10"
                      checked={selectedPrivateImages?.find(
                        (selected) => selected?.id === item?.id
                      )}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                          setselectedPrivateImages([
                            ...selectedPrivateImages,
                            item,
                          ]);
                        } else {
                          setselectedPrivateImages(
                            selectedPrivateImages?.filter(
                              (selected) => selected.id !== item.id
                            )
                          );
                        }
                      }}
                    />
                  )}
                  <div className="aspect-w-16 aspect-h-16 ">
                    <LazyLoadImage
                      src={item?.thumb}
                      className="w-full h-full object-center object-cover bg-black rounded-lg"
                      alt="media"
                      width={51}
                      height={50}
                      onError={imageOnError}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardMyBooking() {
  const router = useRouter();

  const { id } = router.query;

  const [showAcceptBookingModal, setshowAcceptBookingModal] = useState(false);
  const [showRatingModal, setshowRatingModal] = useState(false);

  const { data, isLoading, mutate } = useSWR(
    id && [('/api/bookingdetails/id', id)],
    () => api.getUserBookingDetailsByID(id),
    { refreshInterval: 5000 }
  );
  console.log('data booking', data)

  const formatDates = (date) => {
    const d = date?.split('/')[0];
    const m = date?.split('/')[1];
    const y = date?.split('/')[2];
    const newDate = `${m}-${d}-${y}`;
    return moment(newDate, 'MM-DD-YYYY').format('MMMM DD, YYYY');
  };
  const [acceptBookingLoading, setacceptBookingLoading] = useState(false);
  const [showSurveyModal, setshowSurveyModal] = useState(false);

  /**
   * @Handler Click
   * @description Handle click event for Accept a Booking
   */
  const acceptBookingByUser = async () => {
    try {
      setacceptBookingLoading(true);
      const response = await api.acceptBooking(id);
      if (response.status === 'SUCCESS') {
        toast.success(response.message);
        setacceptBookingLoading(false);
        setshowAcceptBookingModal(false);
        mutate();
        setshowSurveyModal(true);
      } else {
        toast.error(response.message);
        setacceptBookingLoading(false);
      }
    } catch (error) {
      setacceptBookingLoading(false);
    }
  };

  const [timeleft, settimeLeft] = useState('');

  useEffect(() => {
    let timeInterval;
    if (
      data &&
      data.status === 'started' &&
      getDifference(data?.date, data?.from_time).day < 1 &&
      getDifference(data?.date, data?.from_time).milliseconds > 0
    ) {
      timeInterval = setInterval(() => {
        const { timeLeft } = getDifference(data?.date, data?.from_time);
        settimeLeft(`${timeLeft} sec left`);
      }, 1000);
    }
    return () => {
      clearInterval(timeInterval);
    };
  }, [data]);

  const [statusView, setStatusView] = useState({
    photographs: false,
    retouch_request: false,
    customize: false,
  });

  function getDifferenceTime(date) {
    if (!date) {
      return 'Today';
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
    <SecondaryLayout>
      <AuthProvider>
        <Header>
          <div className="flex flex-col justify-start items-start self-stretch bg-[#19191C]">
            <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 pl-5 py-4">
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
                <Link href="/user/my_booking">
                  <ArrowLeftIcon height={24} width={24} />
                </Link>
              </div>
              <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
                <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                  {mybookingLabel.header}
                </p>
              </div>
              {/* <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-4">
              <Link
                href="booking"
                className="btn-primary self-stretch text-xs rounded-xl font-medium px-4 py-2"
              >
                Hire Us
              </Link>
            </div> */}
            </div>
          </div>
        </Header>

        {/* Page Body */}
        {isLoading || !data ? (
          <BookingDetailsSkeleton />
        ) : (
          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 pb-12 gap-2 md:max-w-2xl md:m-auto md:pb-28">
            <div className="hidden md:flex flex-col justify-start items-start self-stretch">
              <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 pt-12 pb-8">
                <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
                  <Link href="/user/my_booking">
                    <ArrowLeftIcon className="h-6 w-6 text-white" />
                  </Link>
                </div>
                <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
                  <p className="flex-grow-0 flex-shrink-0 text-xl font-medium text-left text-white">
                    {mybookingLabel.header}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-6 px-6 md:px-0">
              {/*  */}
              <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 bg-white rounded-md">
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 p-4 gap-4">
                  <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
                    <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
                      <LazyLoadImage
                        src={
                          data?.studio?.studio_image
                            ? data?.studio?.studio_image
                            : '/164-164.png'
                        }
                        className="w-16 h-16 object-cover rounded-full"
                        alt=""
                        width={51}
                        height={51}
                        onError={imageOnError}
                      />
                      <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-0.5">
                        <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-[#202124]">
                          {data?.studio?.studio_name}
                        </p>
                        <p className="flex-grow-0 flex-shrink-0 text-sm font-normal text-left capitalize text-[#202124]">
                          {data?.category?.category_name}
                        </p>
                        <p className="flex-grow-0 flex-shrink-0 font-medium text-left">
                          <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#202124]">
                            ₹ {data?.studio?.per_hour}{' '}
                          </span>
                          <span className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-[#202124]/[0.64]">
                            / hour
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 pt-4 gap-4 border-t border-black/10">
                    <div className="flex flex-col justify-start items-start flex-grow gap-2">
                      <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
                        <CalenderIcon />
                        <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1">
                          <p className="flex-grow-0 flex-shrink-0 text-xs font-normal text-left text-[#202124]">
                            {formatDates(data?.date)}
                          </p>
                          <p className="flex-grow-0 flex-shrink-0 text-xs font-normal text-left text-[#202124]">
                            •
                          </p>
                          <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1">
                            <p className="flex-grow-0 flex-shrink-0 text-xs font-normal text-left text-[#202124]">
                              {moment(data?.from_time, 'HH:mm:ss').format(
                                'hh:mm A'
                              )}
                            </p>
                            <p className="flex-grow-0 flex-shrink-0 text-xs font-normal text-left text-[#202124]">
                              to
                            </p>
                            <p className="flex-grow-0 flex-shrink-0 text-xs font-normal text-left text-[rgb(32,33,36)]">
                              {moment(data?.to_time, 'HH:mm:ss').format(
                                'hh:mm A'
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
                        <LocationSymbol />
                        <p className="flex-grow-0 flex-shrink-0 text-xs font-normal text-left text-[#202124] break-all max-w-full md:pr-2">
                          {data?.location}, {data?.booking_address}
                        </p>
                      </div>
                    </div>
                    {/* Booking Status  */}

                    {/* Showing End Otp while Status is Progress */}
                    {data?.status === 'progress' && (
                      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 p-4 rounded-lg bg-[#19191c]">
                        <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
                          <p className="flex-grow text-xs text-left text-white/[0.64]">
                            End OTP
                          </p>
                          <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-white">
                            {data?.otp_info?.end_otp}
                          </p>
                        </div>
                      </div>
                    )}
                    {/* Showing Start Otp while Status is Started Otp */}
                    {data?.status?.toLowerCase() === 'started' && (
                      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 p-4 rounded-lg bg-[#19191c]">
                        {getDifference(data?.date, data?.from_time)
                          .milliseconds < 0 ? (
                          <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
                            <p className="flex-grow text-xs text-left text-white/[0.64]">
                              Start OTP
                            </p>
                            <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-white">
                              {data?.otp_info?.start_otp}
                            </p>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
                            <p className="flex-grow text-xs text-left text-white/[0.64]">
                              Time Left
                            </p>
                            <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-white">
                              {getDifference(data?.date, data?.from_time)?.day <
                                1
                                ? timeleft
                                : `${getDifference(data?.date, data?.from_time)
                                  ?.day
                                } day left`}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Accept Confirmational Modal */}
              <ConfirmationModal
                title={'Accept Booking'}
                message={
                  data?.images?.retouch_request?.length
                    ? 'This Booking has some retouch request image pending if you accept this booking you will don`t  get that retouch images later ,Are you sure ,you want to accept this booking'
                    : 'Are you sure,you want to accept this booking'
                }
                handleSubmit={acceptBookingByUser}
                setIsOpen={setshowAcceptBookingModal}
                isopen={showAcceptBookingModal}
                acceptBookingLoading={acceptBookingLoading}
              />
              <RatingModal
                isopen={showRatingModal}
                setModalStatus={setshowRatingModal}
                studio_id={data?.studio?.studio_id}
              />
              <SurveyModal
                isopen={showSurveyModal}
                setModalStatus={setshowSurveyModal}
                studio_id={data?.studio?.studio_id}
                setReviewModuleStatus={setshowRatingModal}
                review={data?.review_data}
              />

              {/* Show Complete Status Message */}
              {data?.status === 'completed' && (
                <div
                  className="flex flex-col justify-center items-center w-full gap-4
                "
                >
                  <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center uppercase text-white/[0.64]">
                    This Booking is Completed And your all images are bydefault
                    public you can make them private .
                  </p>
                </div>
              )}
              {/* Show Cancelled Status Message */}
              {data?.status === 'cancelled' && (
                <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center uppercase text-white/[0.64]">
                  {`This Booking is Cancelled By ${data?.cancelled_by === 'user'
                    ? 'You'
                    : data?.studio?.studio_name
                    } due to ${data?.reason}`}
                </p>
              )}
              {/* View uploaded photos Status:-Review */}
              {data?.status === 'review' && (
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
                  <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4 p-4 bg-black rounded-md">
                    {data?.images?.photographs?.length ? (
                      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                        <div className="flex justify-start items-center self-stretch border-t border-white/10 pt-3">
                          <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center uppercase text-white/[0.64]">
                            photographs
                          </p>
                        </div>
                        {Object.entries(data?.images).map(([key, value]) => (
                          <div
                            className="grid grid-cols-4 items-start gap-2 w-full"
                            key={key}
                          >
                            {key === 'photographs' && (
                              <>
                                <MediaBox
                                  source={value}
                                  booking_id={id}
                                  left={data?.left}
                                />
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {data?.images?.edited?.length ? (
                      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                        <div className="flex justify-start items-center self-stretch border-t border-white/10 pt-3">
                          <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center uppercase text-white/[0.64]">
                            Edited photos
                          </p>
                        </div>
                        {Object.entries(data?.images).map(([key, value]) => (
                          <div
                            className="grid grid-cols-4 items-start gap-2 w-full"
                            key={key}
                          >
                            {key === 'edited' && (
                              <>
                                <MediaBox
                                  source={value}
                                  booking_id={id}
                                  left={data?.left}
                                />
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {data?.images?.retouch_request?.length ? (
                      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                        <div className="flex justify-start items-center self-stretch border-t border-white/10 pt-3">
                          <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center uppercase text-white/[0.64]">
                            Retouch photos
                          </p>
                        </div>
                        {Object.entries(data?.images).map(([key, value]) => (
                          <div
                            className="grid grid-cols-4 items-start gap-2 w-full"
                            key={key}
                          >
                            {key === 'retouch_request' && (
                              <>
                                <MediaBox
                                  source={value}
                                  booking_id={id}
                                  left={data?.left}
                                />
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
              {/* View uploaded photos Status :---Completed*/}
              {data?.status === 'completed' && (
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
                  <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4 p-4 bg-black rounded-md">
                    {data?.images?.photographs?.length ? (
                      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                        <div className="flex justify-between w-full items-center self-stretch border-t border-white/10 pt-3">
                          <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center uppercase text-white/[0.64]">
                            photographs
                          </p>
                          <ChangeStatusOfView
                            status={statusView}
                            setstatus={setStatusView}
                            key_name={'photographs'}
                          />
                        </div>
                        {Object.entries(data?.images).map(([key, value]) => (
                          <>
                            {key === 'photographs' && (
                              <>
                                <CompleteMediaBox
                                  source={value}
                                  booking_id={id}
                                  left={data?.left}
                                  changeStatus={statusView.photographs}
                                  mutate={mutate}
                                />
                              </>
                            )}
                          </>
                        ))}
                      </div>
                    ) : null}
                    {data?.images?.edited?.length ? (
                      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                        <div className="flex justify-between items-center self-stretch border-t border-white/10 pt-3">
                          <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center uppercase text-white/[0.64]">
                            Edited photos
                          </p>
                          <ChangeStatusOfView
                            status={statusView}
                            setstatus={setStatusView}
                            key_name={'customize'}
                          />
                        </div>
                        {Object.entries(data?.images).map(([key, value]) => (
                          <>
                            {key === 'edited' && (
                              <>
                                <CompleteMediaBox
                                  source={value}
                                  booking_id={id}
                                  left={data?.left}
                                  changeStatus={statusView.customize}
                                  mutate={mutate}
                                />
                              </>
                            )}
                          </>
                        ))}
                      </div>
                    ) : null}
                    {data?.images?.retouch_request?.length ? (
                      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                        <div className="flex justify-between items-center self-stretch border-t border-white/10 pt-3">
                          <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center uppercase text-white/[0.64]">
                            Retouch photos
                          </p>
                          <ChangeStatusOfView
                            status={statusView}
                            setstatus={setStatusView}
                            key_name={'retouch_request'}
                          />
                        </div>
                        {Object.entries(data?.images).map(([key, value]) => (
                          <>
                            {key === 'retouch_request' && (
                              <>
                                <CompleteMediaBox
                                  source={value}
                                  booking_id={id}
                                  left={data?.left}
                                  changeStatus={statusView.retouch_request}
                                  mutate={mutate}
                                />
                              </>
                            )}
                          </>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
              {/* View uploaded photos Status :---Customize*/}
              {data?.status === 'customize' && (
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
                  <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4 p-4 bg-black rounded-md">
                    {data?.images?.photographs?.length ? (
                      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                        <div className="flex justify-start items-center self-stretch border-t border-white/10 pt-3">
                          <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center uppercase text-white/[0.64]">
                            photographs
                          </p>
                        </div>
                        {Object.entries(data?.images).map(([key, value]) => (
                          <div
                            className="grid grid-cols-4 items-start gap-2 w-full"
                            key={key}
                          >
                            {key === 'photographs' && (
                              <>
                                <MediaBox
                                  source={value}
                                  booking_id={id}
                                  left={data?.left}
                                />
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {data?.images?.edited?.length ? (
                      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                        <div className="flex justify-start items-center self-stretch border-t border-white/10 pt-3">
                          <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center uppercase text-white/[0.64]">
                            Edited photos
                          </p>
                        </div>
                        {Object.entries(data?.images).map(([key, value]) => (
                          <div
                            className="grid grid-cols-4 items-start gap-2 w-full"
                            key={key}
                          >
                            {key === 'edited' && (
                              <>
                                <MediaBox
                                  source={value}
                                  booking_id={id}
                                  left={data?.left}
                                />
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {data?.images?.retouch_request?.length ? (
                      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                        <div className="flex justify-start items-center self-stretch border-t border-white/10 pt-3">
                          <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center uppercase text-white/[0.64]">
                            Request Photos For Retouch
                          </p>
                        </div>
                        {Object.entries(data?.images).map(([key, value]) => (
                          <div
                            className="grid grid-cols-4 items-start gap-2 w-full"
                            key={key}
                          >
                            {key === 'retouch_request' && (
                              <>
                                <MediaBox
                                  source={value}
                                  booking_id={id}
                                  left={data?.left}
                                />
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {data?.status === 'upload' && (
                <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center uppercase text-white/[0.64]">
                  Wait for Photographer to upload the photos those are clicked
                  during photoshoot
                </p>
              )}
              {/*DETAILS  */}
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
                <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2.5">
                  <p className="flex-grow text-xs font-medium text-left uppercase text-white/[0.64]">
                    Details
                  </p>
                </div>
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-6 px-4 py-5 bg-black rounded-md">
                  <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative">
                    <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-3 first:pt-0 last:pb-0 border-b border-white/10 last:border-0">
                      <p className="flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.64]">
                        {mybookingLabel.details.date}
                      </p>
                      <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-white">
                        {formatDates(data?.date)}
                      </p>
                    </div>
                    {/* <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-3 first:pt-0 last:pb-0 border-b border-white/10 last:border-0">
                    <p className="flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.64]">
                      Booking For
                    </p>
                    <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-white">
                      {formatDates(data?.bookingtime?.booking_date_from)}
                    </p>
                  </div> */}
                    <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-3 first:pt-0 last:pb-0 border-b border-white/10 last:border-0">
                      <p className="flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.64]">
                        {mybookingLabel.details.category}
                      </p>
                      <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-white">
                        {data?.category?.category_name}
                      </p>
                    </div>
                    <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-3 first:pt-0 last:pb-0 border-b border-white/10 last:border-0">
                      <p className="flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.64]">
                        {mybookingLabel.details.duraction}
                      </p>
                      <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-white">
                        {getBookingDuration(
                          data?.date,
                          data?.to_time,
                          data?.from_time
                        )}
                      </p>
                    </div>
                    <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-3 first:pt-0 last:pb-0 border-b border-white/10 last:border-0">
                      <p className="flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.64]">
                        {mybookingLabel.details.equipment}
                      </p>
                      <div className="flex flex-col">
                        {data?.used_cam === '' || data?.used_lens === '' ? (
                          <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-white">
                            Not Available
                          </p>
                        ) : (
                          <>
                            <p className="flex-grow-0 flex-shrink-0 text-sm text-right text-white">
                              {data?.used_cam}
                            </p>
                            <p className="flex-grow-0 flex-shrink-0 text-sm text-right text-white">
                              {data?.used_lens}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-3 first:pt-0 last:pb-0 border-b border-white/10 last:border-0">
                      <p className="flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.64]">
                        {mybookingLabel.details.photos}
                      </p>
                      <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-white">
                        {data?.no_of_photos}
                      </p>
                    </div>
                    <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-3 first:pt-0 last:pb-0 border-b border-white/10 last:border-0">
                      <p className="flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.64]">
                        {mybookingLabel.details.payment}
                      </p>
                      <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-white">
                        {data?.payment_status}
                      </p>
                    </div>
                    <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-3 first:pt-0 last:pb-0 border-b border-white/10 last:border-0">
                      <p className="flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.64]">
                        {mybookingLabel.details.amount}
                      </p>
                      <p className="flex-grow-0 flex-shrink-0 text-lg font-semibold text-left text-white">
                        ₹ {data?.amount}
                      </p>
                    </div>
                    {data?.additional_information && (
                      <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-3 first:pt-0 last:pb-0 border-b border-white/10 last:border-0">
                        <p className="flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.64]">
                          Additional Info
                        </p>
                        <p className="text-sm max-w-[50%] text-left text-white break-all">
                          {data?.additional_information}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {data?.status === 'started' && (
                <div className="flex justify-start md:justify-end items-center self-stretch gap-4 mb-6">
                  <Link
                    href={`/user/my_booking/cancel_booking?booking_id=${id}`}
                    className="btn-primary w-full md:w-auto md:px-8 bg-red-700 hover:bg-red-800"
                  >
                    Cancel
                  </Link>
                </div>
              )}
              {(data?.status === 'review' || data?.status === 'customize') && (
                <div
                  className="flex justify-start md:justify-end items-center self-stretch gap-4 mb-6"
                  onClick={() => setshowAcceptBookingModal(true)}
                >
                  <button className="btn-primary w-full md:w-auto md:px-8">
                    Accept
                  </button>
                </div>
              )}
              {data?.status === 'completed' &&
                data?.review_data?.studio_rating_id !== '0' ? (
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
                  <div className="flex justify-between items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2.5">
                    <p className="flex-grow text-xs font-medium text-left uppercase text-white/[0.64]">
                      Your Review
                    </p>
                    <EditRatingModal
                      booking_id={id}
                      studio_id={data?.studio?.studio_id}
                      ratingData={data?.review_data}
                      mutateFunc={mutate}
                    />
                  </div>
                  <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-6 px-4 py-5 bg-black rounded-md">
                    <div className="flex flex-col justify-between">
                      <div className="flex gap-2">
                        <span className="font-bold text-[16px] text-white">
                          You
                        </span>
                      </div>
                      <span className="font-thin text-[14px] text-white/[0.64]">
                        Reviewed {getDifferenceTime(data?.review_data?.date)}
                      </span>
                    </div>
                    <div className="flex flex-col w-full gap-3">
                      <StarRatings
                        rating={data?.review_data?.rating}
                        starRatedColor="tomato"
                        numberOfStars={5}
                        name="rating"
                        starHoverColor="tomato"
                        starDimension="20px"
                      />
                      <p className="text-sm text-left text-white/[0.64]">
                        {data?.review_data?.message
                          ? data?.review_data?.message
                          : 'No message Available'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : <div
                className="flex justify-start md:justify-end items-center self-stretch gap-4 mb-6"
                onClick={() => setshowRatingModal(true)}
              >
                <button className="btn-primary w-full md:w-auto md:px-8">
                  Submit review
                </button>
              </div>}
            </div>
          </div>
        )}
      </AuthProvider>
    </SecondaryLayout>
  );
}

export function ConfirmationModal({
  handleSubmit,
  isopen,
  title,
  message,
  setIsOpen,
  acceptBookingLoading,
}) {
  const closeModal = () => {
    if (acceptBookingLoading) {
      return;
    }
    setIsOpen(false);
  };
  return (
    <>
      <Transition appear show={isopen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{message}</p>
                  </div>

                  <div className="mt-4 flex justify-between w-full">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleSubmit}
                      disabled={acceptBookingLoading ? 'disable' : ''}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      disabled={acceptBookingLoading ? 'disable' : ''}
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export const RatingModal = ({ isopen, setModalStatus, studio_id }) => {
  const [rating, setRating] = useState(0);
  const [comment, setcomment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const router = useRouter();

  const closeModal = () => {
    if (submitLoading) {
      return;
    }
    setModalStatus(false);
  };
  const { id: booking_id } = router.query;

  const changeRating = (value) => {
    setRating(value);
  };
  const { userId: id } = useUser();

  const handleSubmit = async () => {
    if (rating > 0) {
      try {
        setSubmitLoading(true);
        const payload = {
          booking_id,
          user_id: id,
          message: comment,
          rating,
          studio_id,
        };
        const data = await api.submitReview(payload);
        setSubmitLoading(false);
        if (data.status?.toLowerCase() === 'success') {
          toast.success(data?.message);
          closeModal();
          setcomment('');
          setRating(0);
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        setSubmitLoading(false);
      }
    } else {
      toast.error('Add rating to submit');
    }
  };

  return (
    <Transition appear show={isopen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <button
                  className="text-right w-full flex justify-end"
                  onClick={() => setModalStatus(false)}
                  disabled={submitLoading ? 'disabled' : ''}
                >
                  <span className="border border--solid border-black/80 p-2 rounded-2xl shadow-xl transition-all px-4 bg-gray-500 text-white/70 flex-grow-0 flex-shrink-0 text-xs font-medium text-center uppercase text-white/[0.64 cursor-pointer">
                    skip
                  </span>
                </button>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Rate our Service
                </Dialog.Title>
                <div className="flex flex-col gap-6">
                  <div className="flex w-full justify-center items-center">
                    <StarRatings
                      rating={rating}
                      starRatedColor="tomato"
                      changeRating={changeRating}
                      numberOfStars={5}
                      name="rating"
                      starHoverColor="tomato"
                      starDimension="30px"
                    />
                  </div>
                  <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                    <span className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-black/80">
                      Write a review
                    </span>
                    <textarea
                      className="formInput bg-white text-black h-[120px] w-[100%] resize-none placeholder:text-black/50"
                      placeholder="what is your experience? what do you like? what do you unlike"
                      value={comment}
                      onChange={(e) => setcomment(e.target.value)}
                    ></textarea>
                  </label>
                  <button
                    className={`btn-primary w-full mt-5  self-stretch md:self-auto ${submitLoading ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    onClick={handleSubmit}
                    disabled={submitLoading ? 'disable' : ''}
                  >
                    Submit
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export const SurveyModal = ({
  isopen,
  setModalStatus,
  studio_id,
  setReviewModuleStatus,
  review,
}) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const router = useRouter();
  const initialValues = {
    name: '',
    age: '',
    gender: '',
    additional_info: '',
  };
  const signUpSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required('Name is required')
      .min(4, 'Name should be minimum 4 charcter')
      .max(25, 'Name should be maximum 25 charcter'),
    age: Yup.string().trim().required('age is required'),
    gender: Yup.string().trim().required('gender is required'),
    additional_info: Yup.string()
      .trim()
      .required('additional info is required')
      .min(10, 'Minimum 10 characters')
      .max(250, 'maximum 250 characters'),
  });
  const { id: booking_id } = router.query;

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: signUpSchema,
      validateOnChange: true,
      validateOnBlur: false,
      onSubmit: async (values, action) => {
        try {
          setSubmitLoading(true);
          const data = await api.submitSurveyDetails(
            booking_id,
            values.age,
            values.name,
            values.additional_info,
            values.gender
          );
          if (data?.status === 'success') {
            toast.success(data?.message);
            setModalStatus(false);
            if (review?.studio_rating_id == 0) {
              setReviewModuleStatus(true);
            }
            setSubmitLoading(false);
          } else {
            toast.error(data?.message);
            setSubmitLoading(false);
          }
        } catch (error) {
          toast.error('Something went wrong');
          setSubmitLoading(false);
        }
      },
    });

  const closeModal = () => {
    if (submitLoading) {
      return;
    }
    setModalStatus(false);
  };
  return (
    <Transition appear show={isopen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm transform overflow-auto rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh]">
                <button
                  className="text-right w-full flex justify-end"
                  onClick={() => {
                    setModalStatus(false);
                    if (review?.studio_rating_id == 0) {
                      setReviewModuleStatus(true);
                    }
                  }}
                  disabled={submitLoading ? 'disabled' : ''}
                >
                  <span className="border border--solid border-black/80 p-2 rounded-2xl shadow-xl transition-all px-4 bg-gray-500 text-white/70 flex-grow-0 flex-shrink-0 text-xs font-medium text-center uppercase text-white/[0.64 cursor-pointer">
                    skip
                  </span>
                </button>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Survey
                  <span className="text-sm font-medium leading-6 text-gray-900 inline-block">
                    This survey will help us to build customizeable product for
                    u
                  </span>
                </Dialog.Title>
                <div className="flex flex-col gap-6">
                  <label className="flex flex-col justify-start items-start self-stretch flex-grow flex-shrink-0 relative gap-2">
                    <span className="flex-grow-0 flex-shrink-0 text-xs md:text-sm text-left capitalize text-black/80 after:content-['*'] after:ml-0.5 after:text-red-500">
                      Name
                    </span>
                    <div className="relative w-full md:w-full">
                      <input
                        autoComplete="off"
                        placeholder="Enter User Name"
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={
                          errors.name && touched.name
                            ? { border: '1px solid red' }
                            : {}
                        }
                        className="form-input w-full rounded-lg border    text-black bg-white"
                      />
                      {errors.name && touched.name && (
                        <span className="text-red-500 text-right w-full text-sm">
                          {errors.name}
                        </span>
                      )}
                    </div>
                  </label>
                  <label className="flex flex-col justify-start items-start self-stretch flex-grow flex-shrink-0 relative gap-2">
                    <span className="flex-grow-0 flex-shrink-0 text-xs md:text-sm text-left capitalize text-black/80 after:content-['*'] after:ml-0.5 after:text-red-500">
                      Age
                    </span>
                    <div className="relative w-full md:w-full">
                      <input
                        autoComplete="off"
                        placeholder="Enter Age"
                        type="number"
                        name="age"
                        onKeyPress={(e) => {
                          if (e.target.value.length > 1) {
                            e.preventDefault();
                          }
                        }}
                        value={values.age}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={
                          errors.age && touched.age
                            ? { border: '1px solid red' }
                            : {}
                        }
                        className={
                          'form-input w-full rounded-lg border    text-black bg-white'
                        }
                      />
                    </div>
                  </label>
                  <label className="flex flex-col justify-start items-start self-stretch flex-grow flex-shrink-0 relative gap-2">
                    <span className="flex-grow-0 flex-shrink-0 text-xs md:text-sm text-left capitalize text-black/80 after:content-['*'] after:ml-0.5 after:text-red-500">
                      Gender
                    </span>
                    <div className="relative w-full md:w-full">
                      <select
                        name="gender"
                        value={values.gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={
                          errors.gender && touched.gender
                            ? { border: '1px solid red' }
                            : {}
                        }
                        className={
                          'form-input w-full rounded-lg border    text-black bg-white'
                        }
                      >
                        <option value={''}>Select</option>
                        <option value={'MALE'}>Male</option>
                        <option value={'FEMALE'}>Female</option>
                        <option value={'OTHER'}>Other</option>
                      </select>
                    </div>
                  </label>
                  <label className="flex flex-col justify-start items-start self-stretch flex-grow flex-shrink-0 relative gap-2">
                    <span className="flex-grow-0 flex-shrink-0 text-xs md:text-sm text-left capitalize text-black/80 after:content-['*'] after:ml-0.5 after:text-red-500">
                      Additional Info
                    </span>
                    <div className="relative w-full md:w-full">
                      <textarea
                        name="additional_info"
                        value={values.additional_info}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={
                          errors.additional_info && touched.additional_info
                            ? { border: '1px solid red' }
                            : {}
                        }
                        className="form-input w-full rounded-lg border h-[120px] resize-none   text-black bg-white"
                        placeholder="Enter additional information"
                      ></textarea>
                      <span className="flex justify-end items-center w-full text-xs text-black/80 gap-2">
                        {values.additional_info?.trim() &&
                          values.additional_info.trim().length < 10 && (
                            <p className="text-black/80 before:content-['('] before:mr-0.5 after:content-[')'] after:ml-0.5">
                              10 minimum
                            </p>
                          )}
                        <span className="flex gap-1">
                          <p
                            className={`${values.additional_info.trim().length < 10
                              ? 'text-black'
                              : 'text-green-400'
                              }`}
                          >
                            {values.additional_info.trim().length}
                          </p>
                          /<p>{250}</p>
                        </span>
                      </span>
                    </div>
                  </label>
                  <button
                    className={`btn-primary w-full mt-5  self-stretch md:self-auto ${submitLoading ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    onClick={handleSubmit}
                    disabled={submitLoading ? 'disable' : ''}
                  >
                    Submit
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
