import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import CloseModal from '../common/icons/CloseModal';
const ShareButtons = ({ openModal, setOpenModal }) => {
  function closeModal() {
    setOpenModal(false);
  }

  return (
    <>
      <Transition
        show={openModal}
        className="fixed inset-y-0 max-w-sm min-h-screen mx-auto z-[10000000008]"
      >
        <Dialog
          as="div"
          className="relative z-[10000000008]"
          onClose={closeModal}
        >
          <Transition.Child
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-y-0 inset-x-0 m-auto min-w-full sm:max-w-sm bg-[#00000084] backdrop-blur-sm z-40"
            onClick={closeModal}
          ></Transition.Child>
          <Transition.Child
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
            className="fixed bottom-0 md:bottom-auto md:inset-y-24 inset-x-0 m-auto max-w-full md:max-w-sm min-h-[600px] max-h-[600px] rounded-t-xl md:rounded-xl text-base shadow-lg overflow-auto ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-[10000000009]"
          >
            <div className="flex flex-col justify-start items-start self-stretch flex-grow relative bg-[#202124] min-h-[inherit]">
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0  bg-[#202124] sticky top-0 z-50 p-4 px-6 gap-8">
                <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                  <p className="flex-grow-0 flex-shrink-0 text-lg text-center text-white">
                    Select your address
                  </p>
                  <button type="button" onClick={closeModal}>
                    <CloseModal />
                  </button>
                </div>
                <div className="flex flex-col w-full gap-10">
                  <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
                    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-10">
                      <div className="flex flex-col gap-3 w-full">
                        <label
                          htmlFor="address1"
                          className="flex align-middle justify-start border rounded-md border-white/[0.3] p-2 w-full"
                        >
                          <div className="flex items-start pt-2 px-4">
                            <input
                              type="radio"
                              name="address"
                              id="address1"
                              className="w-4 h-4"
                            />
                          </div>
                          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 ml-2">
                            <p className="flex-grow-0 flex-shrink-0 text-md text-left text-white">
                              Akash Pradhan
                            </p>
                            <ul className="flex-grow-0 flex-shrink-0 text-sm text-left text-white/[0.64]">
                              <li>Address line 1</li>
                              <li>Address line 2</li>
                              <li>City</li>
                              <li>State</li>
                              <li>Pincode</li>
                            </ul>
                          </div>
                        </label>
                      </div>
                      <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-6 px-10">
                        <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 self-stretch gap-4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default ShareButtons;
