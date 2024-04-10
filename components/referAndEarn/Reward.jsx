import clsx from 'clsx';
import * as api from '../../services/userService';
import { toast } from 'react-hot-toast';
import { useSWRConfig } from 'swr';
import { COMMON } from '../../constants/const';
const Reward = ({ changeTab, referDetails, userId, mutate }) => {
  const { mutate: mutateCoupon } = useSWRConfig();
  // *** Case-1 : if user invited 5 friends and 3 booking are successful, show claim button on success ***
  // *** Case-2 : if 12 invited user then user can claim reward ***
  // *** user can claim reward for both of scenarios ***

  const referData = referDetails?.referDataDTO;
  const totalJoined = referData?.active_registered || 0;
  const totalBooked = referData?.active_booked || 0;
  const referNow = () => {
    changeTab(1);
  };

  const claimRewards = async () => {
    const data = await api.claimRewards(userId);
    if (data) {
      toast.success('Coupon Claimed SuccessFully');
      mutate();
      mutateCoupon(['/refered-coupons/', userId]);
    }
  };
  return (
    <>
      <div>
        <h1 className="text-lg text-white">Free photo-shoot by refer</h1>
        <span className="text-sm text-gray-400">
          Earn a picture perfect experience. Refer your friends and enjoy a
          complimentary photo-shoot.
        </span>

        <div className="bg-[#252529] border border-gray-600 rounded-lg pl-7 py-5 mt-7">
          <ol className="relative text-gray-500 border-s border-black">
            <li className="mb-5 ms-6">
              <span
                className={clsx(
                  'absolute flex items-center justify-center w-3 h-3  rounded-full -start-2 ring-4 ring-black',
                  totalJoined >= COMMON.REFER_CASE1.INVITED_USER
                    ? 'bg-green-500'
                    : totalJoined >= 1
                    ? 'bg-yellow-300'
                    : 'bg-gray-500'
                )}
              ></span>
              <div className="flex items-center justify-between pr-5">
                <div>
                  <h3 className="font-medium text-white">
                    {totalJoined} friends sign up
                  </h3>
                  <p className="text-sm">
                    {totalJoined >= COMMON.REFER_CASE1.INVITED_USER ? (
                      <span className="text-green-500">
                        Congratulations! You met the sign up target.
                      </span>
                    ) : (
                      `Required ${
                        COMMON.REFER_CASE1.INVITED_USER - totalJoined
                      } more friends to sign up.`
                    )}
                  </p>
                </div>
                <button
                  onClick={referNow}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm rounded-full px-3 py-2 md:p-4"
                >
                  Invite Now
                </button>
              </div>
            </li>
            <li className="mb-5 ms-6">
              <span
                className={clsx(
                  'absolute flex items-center justify-center w-3 h-3  rounded-full -start-2 ring-4 ring-black',
                  totalBooked >= COMMON.REFER_CASE1.BOOKING
                    ? 'bg-green-500'
                    : totalBooked >= 1
                    ? 'bg-yellow-300'
                    : 'bg-gray-500'
                )}
              ></span>
              <h3 className="font-medium text-white">
                {totalBooked} successful bookings
              </h3>
              <p className="text-sm">
                {totalBooked >= COMMON.REFER_CASE1.BOOKING ? (
                  <span className="text-green-500">
                    Congratulations! You met the booking target.
                  </span>
                ) : (
                  `Required ${
                    COMMON.REFER_CASE1.BOOKING - totalBooked
                  } more successful bookings.`
                )}
              </p>
            </li>
            <li className="ms-6">
              <span
                className={clsx(
                  'absolute flex items-center justify-center w-3 h-3  rounded-full -start-2 ring-4 ring-black',
                  totalJoined >= COMMON.REFER_CASE1.INVITED_USER &&
                    totalBooked >= COMMON.REFER_CASE1.BOOKING
                    ? 'bg-green-500'
                    : 'bg-gray-500'
                )}
              ></span>
              <div className="flex justify-between pr-5">
                <h3 className="font-medium text-white">
                  30 mins free photoshoot
                </h3>

                {totalJoined >= COMMON.REFER_CASE1.INVITED_USER &&
                  totalBooked >= COMMON.REFER_CASE1.BOOKING && (
                    <button
                      onClick={claimRewards}
                      className="text-white bg-yellow-600 hover:bg-yellow-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm rounded-full px-3 py-2 md:p-4"
                    >
                      Claim Now
                    </button>
                  )}
              </div>
            </li>
          </ol>
        </div>

        <div className="text-white text-center w-full mt-4">OR</div>

        {/* Case 2 */}
        <div className="bg-[#252529] border border-gray-600 rounded-lg pl-7 py-5 mt-7">
          <ol className="relative text-gray-500 border-s border-black">
            <li className="mb-5 ms-6">
              <span
                className={clsx(
                  'absolute flex items-center justify-center w-3 h-3  rounded-full -start-2 ring-4 ring-black',
                  totalJoined >= COMMON.REFER_CASE2.INVITED_USER
                    ? 'bg-green-500'
                    : totalJoined >= 1
                    ? 'bg-yellow-300'
                    : 'bg-gray-500'
                )}
              ></span>
              <div className="flex items-center justify-between pr-5">
                <div>
                  <h3 className="font-medium text-white">
                    {totalJoined} friends Joined
                  </h3>

                  <p className="text-sm">
                    {totalJoined >= COMMON.REFER_CASE2.INVITED_USER
                      ? 'Congratulations! You met the sign-up target.'
                      : `Required ${
                          COMMON.REFER_CASE2.INVITED_USER - totalJoined
                        } more friends to get coupon`}
                  </p>
                </div>
                <button
                  onClick={referNow}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm rounded-full px-3 py-2 md:p-4"
                >
                  Invite Now
                </button>
              </div>
            </li>

            <li className="ms-6">
              <span
                className={clsx(
                  'absolute flex items-center justify-center w-3 h-3  rounded-full -start-2 ring-4 ring-black',
                  totalJoined >= COMMON.REFER_CASE2.INVITED_USER
                    ? 'bg-green-500'
                    : 'bg-gray-500'
                )}
              ></span>
              <div className="flex justify-between pr-5">
                <div>
                  <h3 className="font-medium text-white">
                    30 mins free photoshoot
                  </h3>
                  {totalJoined >= COMMON.REFER_CASE2.INVITED_USER && (
                    <p className="text-sm text-green-500">
                      Congratulations! You have met the booking target and
                      earned a 30 minute free photoshoot session.
                    </p>
                  )}
                </div>
                {totalJoined >= COMMON.REFER_CASE2.INVITED_USER && (
                  <button
                    onClick={claimRewards}
                    className="text-white bg-yellow-600 hover:bg-yellow-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm rounded-full px-3 py-2 md:p-4"
                  >
                    Claim Now
                  </button>
                )}
              </div>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
};

export default Reward;
