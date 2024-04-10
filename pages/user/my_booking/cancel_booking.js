import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR from 'swr';
import * as api from '../../../services/userService';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { ConfirmationModal } from '../customisation_request';
import SecondaryLayout from '../../../components/layout/SecondaryLayout';
import Header from '../../../components/common/Header';
import ArrowLeftIcon from '../../../components/common/icons/arrowlefticon';
import AuthProvider from '../../../components/common/AuthProvider';
const CancelBooking = () => {
  const [showModal, setshowModal] = useState(false);
  const router = useRouter();
  const { booking_id } = router.query;
  const { data } = useSWR(
    booking_id && ('/booking/cancel-reasons', booking_id),
    () => api.getCancelReasons()
  );
  const [comment, setcomment] = useState('');
  const [reason, setReason] = useState('');
  const [declineBookingLoading, setdeclineBookingLoading] = useState(false);
  const handleComment = (value) => {
    if (value?.length <= 300) {
      setcomment(value);
    }
  };
  /**
   * @Handler Click
   * @description Handle click event for Cancel Booking
   */
  const confrimHandler = async () => {
    let payload = {};
    if (reason === 'other') {
      if (comment.length >= 20) {
        payload = {
          booking_id,
          reason: comment,
        };
      } else {
        toast.error('please add comment to decline minimum 20 character');
        return;
      }
    } else {
      payload = {
        booking_id,
        reason,
      };
    }
    try {
      setdeclineBookingLoading(true);
      const response = await api.cancelBooking(payload);
      if (response && response?.status === 'SUCCESS') {
        setshowModal(true);
        setdeclineBookingLoading(false);
      } else {
        toast.error(response?.message);
        setdeclineBookingLoading(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setdeclineBookingLoading(false);
    }
  };
  const handleChange = (reason) => {
    setReason(reason);
  };

  const handleYesModal = () => {
    router.push(`/user/my_booking/${booking_id}`);
    setshowModal(false);
  };
  return (
    <SecondaryLayout>
      <AuthProvider>
        <Header>
          <div className="flex flex-col justify-start items-start ">
            <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 pl-5 py-4">
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
                <Link href={`/user/my_booking/${booking_id}`}>
                  <ArrowLeftIcon height={24} width={24} />
                </Link>
              </div>
              <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
                <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                  Cancel Booking
                </p>
              </div>
            </div>
          </div>
        </Header>
        <ConfirmationModal
          isopen={showModal}
          message={
            "Your Booking Canceled Successfully,You can't further process with this booking"
          }
          title={'Booking Canceled Successfully'}
          handleSubmit={handleYesModal}
        />
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-10 px-6 py-2">
          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-8">
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
              <p className="flex-grow-0 flex-shrink-0 text-2xl font-semibold text-center text-white">
                Decline Reason
              </p>
              <p className="flex-grow-0 flex-shrink-0 text-sm text-center text-white/[0.64]">
                This will help us to improve our service.
              </p>
            </div>
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
              <div className="flex flex-col justify-center items-stretch self-stretch flex-grow-0 flex-shrink-0 gap-4">
                {data &&
                  data.length > 0 &&
                  data?.map((item, i) => (
                    <div
                      key={i}
                      className="radioGroup flex justify-start items-center flex-grow relative gap-4"
                    >
                      <input
                        type="radio"
                        name="selector"
                        id={`reason${i + 1}`}
                        value="one"
                        onClick={() => handleChange(item?.reason)}
                        autoComplete="off"
                      />
                      <label
                        htmlFor={`reason${i + 1}`}
                        className="flex justify-start items-center text-base font-medium text-left text-white gap-4"
                      >
                        {item?.reason}
                      </label>
                    </div>
                  ))}
                <div className="radioGroup flex justify-start items-center flex-grow relative gap-4">
                  <input
                    type="radio"
                    name="selector"
                    id={'otherreason'}
                    value="one"
                    onClick={() => setReason('other')}
                  />
                  <label
                    htmlFor={'otherreason'}
                    className="flex justify-start items-center text-base font-medium text-left text-white gap-4"
                  >
                    other
                  </label>
                </div>
              </div>
            </div>
            {reason === 'other' && (
              <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                <span className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white/[0.64]">
                  Add your Comment
                </span>
                <textarea
                  className="formInput h-[150px] p-3 resize-none"
                  value={comment}
                  onChange={(e) => handleComment(e.target.value)}
                ></textarea>
                <div className="flex justify-between w-full">
                  {comment?.length && comment.length < 20 ? (
                    <span className="text-red-700 ">20 minimum</span>
                  ) : null}
                  <div className="flex">
                    <span className="text-green-700">{comment.length}/</span>
                    <span className="text-white">300</span>
                  </div>
                </div>
              </label>
            )}
          </div>
          <div className="flex flex-row-reverse justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-4">
            <button
              type="button"
              className="btn-primary w-1/2 bg-red-700 hover:bg-red-800"
              onClick={confrimHandler}
              disabled={reason && !declineBookingLoading ? '' : 'disable'}
              style={
                reason && !declineBookingLoading
                  ? {}
                  : { backgroundColor: 'grey' }
              }
            >
              Confrim
            </button>
            <Link
              href={`/user/my_booking/${booking_id}`}
              className="btn-primary w-1/2"
              disabled={declineBookingLoading ? 'disable' : ''}
            >
              Cancel
            </Link>
          </div>
        </div>
      </AuthProvider>
    </SecondaryLayout>
  );
};

export default CancelBooking;
