import { Dialog, Listbox, Transition } from '@headlessui/react';
import CloseModalIcon from './icons/closemodalIcon';
import clsx from 'clsx';

const Drawer = ({
  isOpen = false,
  closeModal,
  title = '',
  children,
  height,
}) => {
  return (
    <>
      <div className="relative w-full">
        <Transition show={isOpen} className="fixed inset-y-0 mx-auto z-50">
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              className="fixed inset-y-0 inset-x-0 m-auto max-w-full bg-[#00000084] backdrop-blur-sm z-40"
            />
            <Transition.Child
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
              className={clsx(
                'fixed bottom-0 inset-x-0 m-auto max-w-full md:max-w-[30rem] bg-[#202124] rounded-t-xl text-base shadow-lg overflow-auto ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50',
                'bottom-16 md:bottom-0 max-h-[80vh]',
                'h-4/5',
                height
              )}
            >
              <div className="flex flex-col justify-start items-start self-stretch flex-grow relative  min-h-[inherit]">
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-3 bg-[#202124] sticky top-0 z-50 p-4">
                  <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative overflow-hidden">
                    <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-center text-white">
                      {title}
                    </p>
                    <CloseModalIcon closeModal={closeModal} />
                  </div>
                </div>
                {children}
              </div>
            </Transition.Child>
          </Dialog>
        </Transition>
      </div>
    </>
  );
};

export default Drawer;
