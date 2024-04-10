import { Dialog, Transition } from '@headlessui/react';
import { PencilIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useUser } from '../../context/UserContext';
import * as api from '../../services/userService'
import StarRatings from 'react-star-ratings';
export const EditRatingModal = ({   studio_id,booking_id,ratingData,mutateFunc }) => {
    const [rating, setRating] = useState(0);
    const [isopen, setModalStatus] = useState(false);
    const [comment, setcomment] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
  
    const closeModal = () => {
      if (submitLoading) {
        return;
      }
      setModalStatus(false);
    };

    useEffect(() => {
        if (ratingData) {
           setRating(ratingData?.rating)
           setcomment(ratingData?.message)
       } 
    },[])
  
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
              if (mutateFunc) { 
                  mutateFunc()
                }
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
        <>
            <button className="self-end" onClick={()=>setModalStatus(true)}>
                <PencilIcon className="h-4 w-4" fill="white" />
            </button>
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
                      className={`btn-primary w-full mt-5  self-stretch md:self-auto ${
                        submitLoading ? 'cursor-not-allowed' : 'cursor-pointer'
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
   </>
    );
  };