import Link from 'next/link';
import SecondaryLayout from '../../components/layout/SecondaryLayout';
import Header from '../../components/common/Header';
import ArrowLeftIcon from '../../components/common/icons/arrowlefticon';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { imageOnError } from '../../utils/errorImage';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as api from '../../services/userService';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { printLog } from '../../helper/printLog';
export default function Customisation() {
  const [showModal, setshowModal] = useState(false);
  const [retouchRequestLoading, setretouchRequestLoading] = useState(false);
  const [desc, setdesc] = useState('');
  const router = useRouter();
  const [image, setImage] = useState('');
  const { image_id, booking_id } = router.query;
  const { data } = useSWR(
    booking_id && [('/api/bookingdetails/id', booking_id)],
    () => api.getUserBookingDetailsByID(booking_id)
  );

  useEffect(() => {
    if (
      data?.images?.photographs?.length ||
      data?.images?.edited?.length ||
      data?.images?.retouch_request?.length
    ) {
      const imageArray = [
        ...data.images.photographs,
        ...data.images.edited,
        ...data.images.retouch_request,
      ];
      const image = imageArray?.find((image) => image.id === image_id);
      setImage(image);
    }
  }, [data, image_id]);

  const handleDesc = (value) => {
    if (value.length <= 200) {
      setdesc(value);
    }
  };
  const handleSubmit = async () => {
    //sendRetouchRequest
    try {
      const payload = {
        image_id,
        booking_id,
        message: desc,
      };
      setretouchRequestLoading(true);
      const response = await api.sendRetouchRequest(payload);
      if (response?.status === 'SUCCESS') {
        setretouchRequestLoading(false);
        toast.success(response?.message);
        setshowModal(true);
      } else {
        setretouchRequestLoading(false);
        toast.error(response?.message);
      }
    } catch (error) {
      setretouchRequestLoading(false);
      printLog(error);
    }
  };
  const handleYesModal = () => {
    setshowModal(false);
    router.push(`/user/my_booking/${booking_id}`);
  };
  return (
    <SecondaryLayout>
      <Header>
        <div className="flex flex-col justify-start items-start ">
          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 pl-5 py-4">
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
              <Link
                href={`photo_detail?booking_id=${booking_id}&image_id=${image_id}`}
              >
                <ArrowLeftIcon height={24} width={24} />
              </Link>
            </div>
            <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
              <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                Retouch Request
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
      <div className="flex flex-col justify-start items-start ">
        <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 pl-5 py-4">
          <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
            <Link
              href={`photo_detail?booking_id=${booking_id}&image_id=${image_id}`}
            >
              <ArrowLeftIcon height={24} width={24} />
            </Link>
          </div>
          <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
            <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
              Retouch Request
            </p>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isopen={showModal}
        message={
          'Your Request for Retouch this Image has been sent to photographer wait for the photographer upload the edited image till then you can check other images if you want customize other image'
        }
        title={'Retouch Image Request Sent Successfully'}
        handleSubmit={handleYesModal}
      />
      {/* Page Body */}
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 pb-12 gap-2">
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-6 px-6">
          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-6 pt-5 pb-7">
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                <p className="self-stretch flex-grow-0 flex-shrink-0 text-sm text-left text-white/[0.64]">
                  Welcome to our image retouching service!, Please provide
                  specific instructions for the retouching. Include details
                  about what you want to be edited and any special requests.
                </p>
              </div>
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-6">
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                  <p className="flex-grow-0 flex-shrink-0 text-xs font-normal text-left text-white/[0.64]">
                    Photograph
                  </p>
                  <LazyLoadImage
                    src={image ? image.thumb : '/164-164.png'}
                    alt="..."
                    className="w-32 h-32 object-cover rounded-md"
                    onError={imageOnError}
                  />
                </div>
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
                  <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                    <span className="flex-grow-0 flex-shrink-0 text-xs font-normal text-left capitalize text-white/[0.64]">
                      Description
                    </span>
                    <textarea
                      className="formInput h-[150px] p-3 resize-none"
                      value={desc}
                      onChange={(e) => handleDesc(e.target.value)}
                    ></textarea>
                  </label>
                  <div className="flex justify-between items-center w-full">
                    {desc && desc.length < 20 && (
                      <span className="text-red-700">20 minimum</span>
                    )}
                    <div className="flex text-white">
                      <span className="text-green-700">{desc.length}</span> /
                      <span className="text-red-700">{200}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2.5 px-4 py-3 rounded-2xl bg-[#186ced] text-white"
                  onClick={handleSubmit}
                  style={
                    desc.length < 20 || retouchRequestLoading
                      ? { backgroundColor: 'grey', cursor: 'not-allowed' }
                      : {}
                  }
                  disabled={
                    desc.length < 20 || retouchRequestLoading ? 'disable' : ''
                  }
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SecondaryLayout>
  );
}

export function ConfirmationModal({ handleSubmit, isopen, title, message }) {
  function handleYes() {
    handleSubmit();
  }
  return (
    <>
      <Transition appear show={isopen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
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
                <Dialog.Panel className="w-[22rem] max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{message}</p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleYes}
                    >
                      Got it, thanks!
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
