import { Fragment, useEffect } from 'react';
import Header from '../../components/common/Header';
import PrimaryLayout from '../../components/layout/PrimaryLayout';
import moment from 'moment/moment';
import ArrowLeftIcon from '../../components/common/icons/arrowlefticon';
import NormalNotification from '../../components/common/icons/normalnotification.js';
import SorryLogo from '../../components/common/icons/sorrylogo.js';
import ThankYouLogo from '../../components/common/icons/thankyoulogo';
import Link from 'next/link';
import useSWR from 'swr';
import * as api from '../../services/userService';
import { useRouter } from 'next/router';
import { printLog } from '../../helper/printLog';
import { useUser } from '../../context/UserContext';
import ProfileLayout from '../../components/layout/ProfileLayout';
import AuthProvider from '../../components/common/AuthProvider';
import { BellAlertIcon } from '@heroicons/react/24/outline';

const Notifications = () => {
  const { userId: id } = useUser();

  const { data } = useSWR(id && ['/api/user_notifications' + id], () =>
    api.getUserNotifications(id)
  );

  function getDifference(datetime) {
    const givenDateTime = moment(datetime, 'DD-MM-YYYY HH:mm:ss');

    const differenceInMilliseconds = givenDateTime.diff(
      moment(),
      'milliseconds'
    );

    const formattedDifference = moment
      .duration(differenceInMilliseconds)
      .humanize();
    return formattedDifference;
  }

  useEffect(() => {
    if (data) {
      data?.forEach(async (item) => {
        if (item?.is_seen) {
          try {
            await api.changeStatusofNotification(
              item?.notification_id,
              false,
              item?.is_active
            );
          } catch (error) {
            printLog(error);
          }
        }
      });
    }
  }, [data]);

  const router = useRouter();

  const handleNavigate = async (item) => {
    try {
      if (item?.module?.toLowerCase() === 'booking') {
        router.push(`/user/my_booking/${item?.booking_id}`);
      }
      if (item?.module?.toLowerCase() === 'order') {
        router.push('/user/orders');
      }
      api.changeStatusofNotification(item?.notification_id, false, false);
    } catch (error) {
      printLog(error);
    }
  };
  return (
    <>
      <ProfileLayout>
        <AuthProvider>
          <header className="flex flex-col justify-start items-start bg-[#010201] md:bg-transparent md:border-b md:border-white/10 min-h-[64px] md:min-h-0">
            <div className="flex flex-col justify-start items-start self-stretch">
              <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 pl-5 md:px-0 py-4 md:pt-0">
                <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
                  <Link href={'/user'} className="flex md:hidden">
                    <ArrowLeftIcon height={24} width={24} />
                  </Link>
                  <BellAlertIcon className="hidden md:flex w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
                  <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                    Notifications
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Page body */}
          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 bg-[#19191C] md:gap-8 w-screen md:max-w-2xl ">
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 md:gap-4 px-6 md:p-0">
              {!data?.length && (
                <div className="flex justify-center items-center self-stretch h-[70vh] text-[#9b9191] md:bg-black">
                  No new notifications
                </div>
              )}
              {data &&
                data.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleNavigate(item)}
                    className="flex cursor-pointer flex-row justify-between items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 md:bg-black py-8 md:p-6 md:rounded-xl md:gap-4 border-b border-white/10 md:border-0"
                  >
                    <div className="flex justify-center items-center h-10 w-10 rounded-full bg-[#186ced]">
                      {item?.notification === 'Sorry!!!' ? (
                        <SorryLogo />
                      ) : item?.notification?.trim() === 'Thank you.' ? (
                        <ThankYouLogo />
                      ) : (
                        <NormalNotification />
                      )}
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center self-stretch flex-grow gap-2">
                      <div className="flex flex-col justify-start items-center">
                        <h6 className="flex-grow-0 flex-shrink-0 text-lg capitalize text-white w-full text-[14px]">
                          {item?.notification
                            ?.match(/.{1,40}/g)
                            ?.map((line, i) => (
                              <Fragment key={i}>
                                <span>{line}</span>
                              </Fragment>
                            ))}
                        </h6>
                        <p className="flex-grow-0 flex-shrink-0 text-sm lowercase text-white/70 w-full">
                          {item.desc?.match(/.{1,53}/g)?.map((line, i) => (
                            <Fragment key={i}>
                              <span>{line}</span>
                            </Fragment>
                          ))}
                        </p>
                      </div>
                      <p className="flex-grow-0 flex-shrink-0 text-xs md:text-sm lowercase text-white/70">
                        {getDifference(item?.created_date)} ago
                      </p>
                    </div>
                    {/* <ChevronRightIcon className="w-6 h-6 md:w-4 md:h-4 text-white/60" /> */}
                  </div>

                  // <button key={i} onClick={() => handleNavigate(item)}>
                  //   <li
                  //     className="w-full bg-transparent border-[0px] border-b-[1px] border-b-white/40 hover:via-gray-600 cursor-pointer flex-grow-0 flex-shrink-0 text-xs font-medium text-left uppercase text-white/[0.64] pb-2"
                  //     style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.14)' }}
                  //   >
                  //   </li>
                  // </button>
                ))}
            </div>
          </div>
        </AuthProvider>
      </ProfileLayout>
    </>
  );
};

export default Notifications;
