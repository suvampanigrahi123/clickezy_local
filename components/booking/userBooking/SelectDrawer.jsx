import { Dialog, Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { imageOnError } from '../../../utils/errorImage';
import CloseModalIcon from '../../common/icons/closemodalIcon';

function Drawer({
  selected,
  onChange,
  options,
  isShow,
  openModal,
  closeModal,
  handleSearch,
  search,
  error,
  drawerLabel = '',
}) {
  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative w-full">
        <Listbox.Button
          className={`formInput w-full flex justify-between ${
            error === 'bookingLocation' &&
            'border-red-500 border-2 border-solid'
          }`}
          onClick={openModal}
        >
          <span className="block truncate text-base font-medium text-left text-gray-200">
            {selected.name}
          </span>
          <span className="pointer-events-none flex items-center">
            <ChevronDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          show={isShow}
          className="fixed inset-y-0 max-w-sm min-h-screen mx-auto z-50"
        >
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
              className="fixed bottom-0 inset-x-0 m-auto max-w-full md:max-w-[30rem] min-h-[80vh] max-h-[80vh] rounded-t-xl text-base shadow-lg overflow-auto ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50"
            >
              <div className="flex flex-col justify-start items-start self-stretch flex-grow relative bg-[#202124] min-h-[inherit]">
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-3 bg-[#202124] sticky top-0 z-50 p-4">
                  <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative overflow-hidden">
                    <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-center text-white">
                      {drawerLabel}
                    </p>
                    <CloseModalIcon closeModal={closeModal} />
                  </div>
                  <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
                    <input
                      type="text"
                      placeholder="Search"
                      className="formInput w-full"
                      onChange={handleSearch}
                      value={search}
                      autoComplete="off"
                    />
                  </div>
                </div>
                {options?.length === 0 && (
                        <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 self-stretch p-4">
                          <p className="flex-grow-0 flex-shrink-0 text-base font-normal text-center text-white">
                            No Data Found
                          </p>
                        </div>
                      )}
                <Listbox.Options className="grid grid-cols-3 items-start gap-4 gap-y-5 self-stretch px-4">
                  {options?.map((location, locationIdx) => (
                    <Listbox.Option
                      key={locationIdx}
                      className={({ active }) =>
                        `cursor-default flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 ${
                          active ? 'bg-[#19191b55] text-white' : 'text-white'
                        }`
                      }
                      value={location}
                    >
                      {({ selected }) => (
                        <>
                          <div
                            className={`w-full aspect-w-16 aspect-h-16 ${
                              selected && 'bg-[#3636ea] rounded-lg'
                            }`}
                          >
                            <LazyLoadImage
                              src={location.thumb || '/164-164.png'}
                              className="w-full h-full object-center object-cover bg-black rounded-lg"
                              width={144}
                              height={144}
                              alt=""
                              onError={imageOnError}
                            />
                          </div>
                          <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
                            <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-white">
                              {location.name}
                            </p>
                          </div>
                          {selected ? (
                            <div className="absolute left-0 right-0 w-full flex justify-center items-center text-white">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </div>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Transition.Child>
          </Dialog>
        </Transition>
      </div>
    </Listbox>
  );
}

export default Drawer;
