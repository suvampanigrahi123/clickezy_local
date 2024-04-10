'use client';
import React, { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import StarRatings from 'react-star-ratings';
import { toast } from 'react-hot-toast';
import * as api from '../../services/storeService';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUser } from '../../context/UserContext';
import { COMMON } from '../../constants/const';

const Review = ({ userId, orderId, productId, orderInfo }) => {
  const initialRatting = {
    rating: Number(orderInfo?.rating) || 0,
    message: orderInfo?.review_message?.split(';$')[1] || '',
  };
  const initialImagesState = {
    images1: { image: '', previewImage: orderInfo?.image1 || '' },
    images2: { image: '', previewImage: orderInfo?.image2 || '' },
    images3: { image: '', previewImage: orderInfo?.image3 || '' },
  };
const { user } = useUser();
const [isOpen, setIsOpen] = useState(false);
const [ratingForm, setRatingForm] = useState(initialRatting);
  const [uploadedImages, setUploadedImages] = useState(1);
  const [images, setImages] = useState(initialImagesState);
  const handleReview = (e) => {
    e.preventDefault();
    setIsOpen(true);
    setData();
  };

  function setData() {
    if (orderInfo && orderInfo?.rating) {
      setRatingForm(
        { rating: Number(orderInfo?.rating) || 0, message: orderInfo?.review_message?.split(';$')[1] || '', }
      )
      setImages( {
        images1: { image: '', previewImage: orderInfo?.image1 || '' },
        images2: { image: '', previewImage: orderInfo?.image2 || '' },
        images3: { image: '', previewImage: orderInfo?.image3 || '' },
      })
    }
  }
  const closeModal = () => {
    setIsOpen(false);
    setData();
  };

  
  const handleRating = (rate) => {
    setRatingForm({ ...ratingForm, rating: rate });
  };
  const handleMessage = (e) => {
    setRatingForm({
      ...ratingForm,
      message: e.target.value,
    });
  };
  const saveRatingForm = async (e) => {
    const formData = new FormData();
    if (ratingForm && ratingForm.rating > 0) {
      const keyword = generateKeyword();
      const message = keyword + ';$' + ratingForm.message;
      formData.append('product_id', Number(productId));
      formData.append('user_id', userId);
      formData.append('order_item_id', orderId);
      formData.append('rating', ratingForm.rating);
      formData.append('message', message);
      formData.append('image1', images.images1?.image);
      formData.append('image2', images.images2?.image);
      formData.append('image3', images.images3?.image);
      const res = await api.saveRating(formData);
      if (res && res.data && res.data.status === 'success') {
        setIsOpen(false)
        toast.success('Rating updated successfully');
      }
    } else {
      toast.error('Give us rating');
    }
  };

  const generateKeyword = () => {
    const starRatingKeyword = COMMON.STAR_RATING_KEYWORD;
    if (ratingForm.rating > 0) {
      const randomNum = Math.floor(Math.random() * 5);
      const key = starRatingKeyword[2][randomNum];
      return key;
    }
  };

  const handleImageUpload = (e, imageNo) => {
    try {
      var input = e.target;
      var file = input.files[0];
      if (file.size > 1048576) {
        toast.error('File Size must be not greater than 1MB');
        return;
      }
      setUploadedImages((prev) => prev + 1);
      const img = URL.createObjectURL(e.target.files[0]);
      if (imageNo === 1) {
        setImages({ ...images, images1: { image: file, previewImage: img } });
      } else if (imageNo === 2) {
        setImages({ ...images, images2: { image: file, previewImage: img } });
      } else if (imageNo === 3) {
        setImages({ ...images, images3: { image: file, previewImage: img } });
      }
    } catch (error) {
      toast.error('something went wrong');
    }
  };
  const removeImage = (e, imageNo) => {
    e.preventDefault();
    setUploadedImages((prev) => prev - 1);
    if (imageNo === 1) {
      setImages({ ...images, images1: { image: '', previewImage: '' } });
    } else if (imageNo === 2) {
      setImages({ ...images, images2: { image: '', previewImage: '' } });
    } else if (imageNo === 3) {
      setImages({ ...images, images3: { image: '', previewImage: '' } });
    }
  };
  return (
    <>
      <div
        className="w-full flex justify-between items-center text-[#BDBDBD] cursor-pointer bg-[#1E1F22] rounded-md px-4 py-2"
        onClick={handleReview}
      >
        <div>Give us your experience</div>
        <div>
          <Image src="/icons/arrowRight.svg" width={10} height={10} alt="" />
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
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
            <div className="fixed inset-0 bg-black/25" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  >
                    Rate Our Service
                  </Dialog.Title>
                  <div className="mt-2 px-2">
                    <div className="text-sm text-gray-500 flex flex-col my-3 items-center justify-center">
                      {/* Profile */}
                      <div className="flex flex-col justify-center p-2">
                        <div className="flex flex-col justify-center items-center">
                          <Image
                            src={user?.user_image || '/164-164.png'}
                            width={80}
                            height={80}
                            alt="user_profile"
                            className="w-10 h-10 rounded-full"
                          />
                          <span>{user?.name}</span>
                        </div>
                      </div>
                      <StarRatings
                        rating={ratingForm.rating}
                        starRatedColor="#FF9529"
                        changeRating={handleRating}
                        numberOfStars={5}
                        name="rating"
                        starDimension="35px"
                      />
                    </div>
                    <div>
                      <textarea
                        className="w-full border border-gray-400 h-20 p-2"
                        placeholder="Type you review......."
                        width="100%"
                        onChange={handleMessage}
                        value={ratingForm.message}
                      ></textarea>
                    </div>
                    {ratingForm.rating >= 1 && (
                      <div className="w-full flex justify-evenly">
                        {new Array(3).fill(0).map((_, i) => (
                          <div className="" key={i}>
                            {images['images' + (i + 1)].previewImage === '' && (
                              <div className="rounded-md border flex justify-center items-center border-indigo-500 bg-gray-300 shadow-md w-20 h-20">
                                <label
                                  htmlFor={`upload${i + 1}`}
                                  className="w-full h-full flex flex-col justify-center items-center cursor-pointer"
                                >
                                  {i >= uploadedImages &&
                                  images['images' + (i + 1)].previewImage !==
                                    '' ? (
                                    ''
                                  ) : (
                                    <PlusIcon className="w-8 h-8" />
                                  )}
                                </label>
                                <input
                                  key={i}
                                  id={`upload${i + 1}`}
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, i + 1)}
                                  disabled={
                                    i >= uploadedImages &&
                                    images['images' + (i + 1)].previewImage !==
                                      ''
                                  }
                                />
                              </div>
                            )}
                            {images['images' + (i + 1)].previewImage !== '' && (
                              <div className="rounded-md border shadow-md w-20 h-20 relative">
                                <Image
                                  src={images['images' + (i + 1)].previewImage}
                                  width={80}
                                  height={80}
                                  alt="images"
                                  className="p-2 w-20 h-20 relative"
                                />
                                <button
                                  className="absolute top-1 right-1"
                                  onClick={(e) => removeImage(e, i + 1)}
                                >
                                  <XMarkIcon
                                    className="text-white"
                                    width={20}
                                    height={20}
                                  />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex mr-2 justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={saveRatingForm}
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

export default Review;
