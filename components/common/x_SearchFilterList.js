import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  setCategory,
  setEquipment,
  setLocation,
} from '../../redux/slices/searchSlice';

function FilterList({ title = '', filterlist, ...others }) {
  let isShowing;
  const dispatch = useDispatch();
  const [selected, setSelected] = useState('');
  const handleChange = (selected) => {
    setSelected(selected);
  };

  useEffect(() => {
    if (others.isPlace) {
      dispatch(setLocation(selected));
    }
    if (others.isEquipment) {
      dispatch(setEquipment(selected));
    }
    if (others.isCategory) {
      dispatch(setCategory(selected));
    }
  }, [selected]);

  return (
    <Listbox value={selected} onChange={handleChange}>
      <div className="relative w-full">
        <Listbox.Button className="flex justify-start items-center h-7 relative gap-2 pl-3 pr-1.5 rounded-[6px] bg-[#19191c]">
          <p className="flex-grow-0 flex-shrink-0 text-[13px] text-center text-white">
            {title}
          </p>
          <ChevronDownIcon className="h-4 w-4 text-[#ffffff80]" />
        </Listbox.Button>
        <Transition
          show={isShowing}
          // as={Fragment}
          className="fixed inset-y-0 max-w-sm min-h-screen mx-auto z-50"
        >
          <Transition.Child
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-y-0 inset-x-0 m-auto max-w-sm bg-[#00000084] backdrop-blur-sm z-40"
          />
          <Transition.Child
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
            className="fixed bottom-0 inset-x-0 m-auto max-w-sm min-h-[600px] max-h-[600px] rounded-t-xl text-base shadow-lg overflow-auto ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50"
          >
            <div className="flex flex-col justify-start items-start self-stretch flex-grow relative bg-[#202124] min-h-[inherit]">
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 bg-[#202124] sticky top-0 z-50 p-4">
                <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative overflow-hidden">
                  <p className="flex-grow-0 flex-shrink-0 text-[13px] font-medium text-center text-white/[0.32]">
                    Filter by Ratings
                  </p>
                  <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      fill="black"
                      stroke="black"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 9L9 15"
                      stroke="white"
                      strokeOpacity="0.64"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 9L15 15"
                      stroke="white"
                      strokeOpacity="0.64"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <Listbox.Options className="flex flex-col flex-grow self-stretch px-4">
                {filterlist?.map((item, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      `relative cursor-default select-none py-4 pl-3 pr-1 flex justify-start items-center flex-grow-0 flex-shrink-0 self-stretch border-b border-[#ffffff10] last:border-0 ${
                        active ? 'bg-[#19191b55] text-white' : 'text-white'
                      }`
                    }
                    value={item}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {item.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 bg-[#202124] sticky bottom-0 z-50 p-4">
                <Link href="#" className="btn-primary self-stretch">
                  Apply
                </Link>
              </div>
            </div>
          </Transition.Child>
        </Transition>
      </div>
    </Listbox>
  );
}

export default FilterList;
