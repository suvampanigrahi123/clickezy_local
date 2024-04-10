import React, { memo, useEffect } from 'react';
import Avatar from '../user/Avatar';
import Skeleton from 'react-loading-skeleton';
import Link from 'next/link';
import { useUser } from '../../context/UserContext';
import useSWR from 'swr';
import * as api from '../../services/userService';
import { useRouter } from 'next/router';
import { profileLabel } from '../../constants/labelText';
import {
  ChevronRightIcon,
  GiftIcon,
  CalendarIcon,
  CubeIcon,
  UserIcon,
  MapPinIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  ArrowRightEndOnRectangleIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';

const MyProfile = () => {
  const router = useRouter();

  const { userId: id, setLogout, setLogin } = useUser();
  const { data, isLoading, error, mutate } = useSWR(
    id && ['/api/user/', id],
    () => api.getUserProfileDetails(id),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  if (error) {
    setLogout();
    router.replace('/login');
  }
  //logout
  const handleLogout = () => {
    setLogout();
    router.replace('/login');
  };

  useEffect(() => {
    if (data && data.statusCode === 200) {
      setLogin(data);
    }
  }, [data]);

  return (
    <>
      <div className="flex flex-col justify-start items-start self-stretch md:rounded-xl md:bg-black md:overflow-hidden">
        {/* Profile */}
        <div className="flex flex-col justify-start items-start self-stretch px-6 py-4 bg-[#0F0F0F]">
          <div className="flex justify-start items-center self-stretch relative gap-4">
            <div className="w-16 md:w-12 h-16 md:h-12 bg-[#202124] rounded-full relative">
              {isLoading ? (
                <Skeleton
                  width="100%"
                  height="100%"
                  baseColor="#606265"
                  highlightColor="#323335"
                  borderRadius={'100%'}
                />
              ) : (
                <Avatar
                  profileImage={data?.user_image}
                  userId={data?.user_id}
                  mutate={mutate}
                />
              )}
            </div>
            <div className="flex flex-col justify-start items-start flex-grow gap-1">
              <div className="flex flex-col justify-start items-start relative">
                {isLoading ? (
                  <>
                    <Skeleton
                      width={180}
                      height={22}
                      baseColor="#606265"
                      highlightColor="#323335"
                    />
                    <Skeleton
                      width={240}
                      height={22}
                      baseColor="#606265"
                      highlightColor="#323335"
                    />
                  </>
                ) : (
                  <>
                    <p className="flex-grow-0 flex-shrink-0 text-xl md:text-base font-semibold text-left capitalize text-white">
                      {data?.name || 'Your Name'}
                    </p>
                    <p className="flex-grow-0 flex-shrink-0 text-xs font-medium md:font-normal text-left text-white/[0.64]">
                      {data?.email || 'name@example.com'}
                    </p>
                  </>
                )}
              </div>
              {/* <div className="flex justify-start items-center relative">
                      <p className="flex-grow-0 flex-shrink-0 text-sm text-left capitalize text-[#0b8aed]">
                        View Activity
                      </p>
                      <RightTringleLittle />
                    </div> */}
            </div>
          </div>
        </div>
        {/* Menu */}
        <div className="flex flex-col justify-start items-start self-stretch gap-3 px-6 py-4 md:pb-6">
          <Link
            href={'/user/refer'}
            replace
            className="flex justify-center items-center w-full h-12 md:h-auto gap-2 px-6 py-3 md:py-2 rounded-2xl md:rounded-xl bg-[#0b3d2e] border-[1.33px] border-[#156049]"
          >
            <GiftIcon className="w-7 md:w-5 h-7 md:h-5 text-white" />
            <p className="text-white text-sm md:text-xs font-medium capitalize">
              Refer and Earn
            </p>
          </Link>
          <div className="flex flex-col justify-start items-start self-stretch">
            <Link
              href="/user/my_booking"
              className="flex justify-between items-center self-stretch relative py-3 border-b border-white/[0.08]"
            >
              <div className="flex justify-start items-center relative gap-2">
                <CalendarIcon className="w-7 md:w-5 h-7 md:h-5 text-[#1E78BF]" />
                <p className="flex-grow-0 flex-shrink-0 text-sm md:text-[13px] font-medium text-left capitalize text-white">
                  {profileLabel.booking.heading}
                </p>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-white/30" />
            </Link>
            <Link
              href="/user/orders"
              className="flex justify-between items-center self-stretch relative py-3 border-b border-white/[0.08]"
            >
              <div className="flex justify-start items-center relative gap-2">
                <CubeIcon className="w-7 md:w-5 h-7 md:h-5 text-[#1E78BF]" />
                <p className="flex-grow-0 flex-shrink-0 text-sm md:text-[13px] font-medium text-left capitalize text-white">
                  {profileLabel.order.heading}
                </p>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-white/30" />
            </Link>
            <div className="flex flex-col justify-start items-start self-stretch pt-2">
              <div className="flex flex-col justify-start items-start self-stretch relative gap-1 pt-4 pb-1">
                <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-white/[0.64]">
                  Account Settings
                </p>
              </div>
              <Link
                href="/user/edit_profile"
                className="flex justify-between items-center self-stretch relative py-3 border-b border-white/[0.08]"
              >
                <div className="flex justify-start items-center relative gap-2">
                  <UserIcon className="w-7 md:w-5 h-7 md:h-5 text-[#1E78BF]" />
                  <p className="flex-grow-0 flex-shrink-0 text-sm md:text-[13px] font-medium text-left capitalize text-white">
                    Edit Profile
                  </p>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-white/30" />
              </Link>
              <Link
                href="/user/address"
                className="flex justify-between items-center self-stretch relative py-3 border-b border-white/[0.08]"
              >
                <div className="flex justify-start items-center relative gap-2">
                  <MapPinIcon className="w-7 md:w-5 h-7 md:h-5 text-[#1E78BF]" />
                  <p className="flex-grow-0 flex-shrink-0 text-sm md:text-[13px] font-medium text-left capitalize text-white">
                    Saved Address
                  </p>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-white/30" />
              </Link>
              <Link
                href="/user/notifications"
                className="flex justify-between items-center self-stretch relative py-3 border-b border-white/[0.08]"
              >
                <div className="flex justify-start items-center relative gap-2">
                  <BellAlertIcon className="w-7 md:w-5 h-7 md:h-5 text-[#1E78BF]" />
                  <p className="flex-grow-0 flex-shrink-0 text-sm md:text-[13px] font-medium text-left capitalize text-white">
                    Notifications
                  </p>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-white/30" />
              </Link>
            </div>
            <div className="flex flex-col justify-start items-start self-stretch pt-2">
              <div className="flex flex-col justify-start items-start self-stretch relative gap-1 pt-4 pb-1">
                <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-white/[0.64]">
                  Feedback &amp; Information
                </p>
              </div>
              <Link
                href="/user/term-policy"
                className="flex justify-between items-center self-stretch relative py-3 border-b border-white/[0.08]"
              >
                <div className="flex justify-start items-center relative gap-2">
                  <DocumentTextIcon className="w-7 md:w-5 h-7 md:h-5 text-[#1E78BF]" />
                  <p className="flex-grow-0 flex-shrink-0 text-sm md:text-[13px] font-medium text-left capitalize text-white">
                    Terms, Policies, &amp; Licenses
                  </p>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-white/30" />
              </Link>
              <Link
                href="/user/browserFAQ"
                className="flex justify-between items-center self-stretch relative py-3"
              >
                <div className="flex justify-start items-center relative gap-2">
                  <QuestionMarkCircleIcon className="w-7 md:w-5 h-7 md:h-5 text-[#1E78BF]" />
                  <p className="flex-grow-0 flex-shrink-0 text-sm md:text-[13px] font-medium text-left capitalize text-white">
                    Browse FAQs
                  </p>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-white/30" />
              </Link>
            </div>
          </div>
          <button
            className="flex justify-center items-center w-full h-12 md:h-auto gap-2 px-6 py-3 md:py-2 rounded-2xl md:rounded-xl bg-white/[0.04] border-[1.33px] border-white/[0.08]"
            onClick={handleLogout}
          >
            <ArrowRightEndOnRectangleIcon className="w-7 md:w-5 h-7 md:h-5 text-white" />
            <div className="text-white text-sm md:text-xs font-medium capitalize">
              Logout
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default memo(MyProfile);
