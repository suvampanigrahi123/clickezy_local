import { Dialog, Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { filter } from 'lodash';
import { Fragment, useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch, useSelector } from 'react-redux';
import { setError, setStudio } from '../../../redux/slices/PackageSlice';
import { imageOnError } from '../../../utils/errorImage';
import CloseModalIcon from '../../common/icons/closemodalIcon';
import useSwr from 'swr';
import * as api from '../../../services/userService';
import StudioBookingLoader from '../../preloader/StudioBookingLoader';

export const PackageStudio = ({ title, studio_id }) => {
  return (
    <>
      <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white/[0.64]">
          {title}
        </span>
        <PackageStudioList studio_id={studio_id} />
      </label>
    </>
  );
};

function PackageStudioList({ studio_id }) {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState({
    studio_name: 'Select',
    studio_id: 0,
  });
  const { packageFor, packageLocation } = useSelector((state) => state.package);
  const [isshow, setisshow] = useState(false);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const error = useSelector((state) => state.package.error);
  const [dependent, setDependent] = useState({
    locationId: null,
    categoryId: null,
  });

  const { data: studioList, isLoading } = useSwr(
    dependent.categoryId && dependent.locationId && ['getStudio', dependent],
    () => api.getPackageStudioById(dependent)
  );
  

  const studios = studioList?.data?.data?.package_data;
  useEffect(() => {
    setItems([]);
    setSelected({ studio_name: 'Select', id: 0 });
    dispatch(setStudio({ studio_name: 'Select', id: 0 }));
    if (packageFor?.id && packageLocation.id) {
      setDependent({
        locationId: packageLocation.id,
        categoryId: packageFor.id,
      });
    }
    if (studios && studios.length > 0) {
      setItems(studios);
      const data = filter(studios, (item) => {
        return item.studio_id === studio_id;
      });
      if (data && data.length > 0) {
        setSelected(data[0]);
        dispatch(setStudio(data[0]));
      }
    }
  }, [packageFor, packageLocation, studios, studio_id]);

  const openModal = () => {
    setisshow(true);
  };

  const closeModal = () => {
    setisshow(false);
  };

  const changeList = (studio) => {
    setSelected(studio);
    if (studio.studio_name.toLowerCase() === 'select') {
      dispatch(setError('studio'));
    } else {
      dispatch(setError(null));
      dispatch(setStudio(studio));
    }
    closeModal();
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value && value.length > 0) {
      const data = filter(studios, (item) => {
        return item.studio_name.toLowerCase().includes(value.toLowerCase());
      });
      setItems(data);
    } else {
      setItems(studios);
    }
  };

  return (
    <>
      {isLoading && <StudioBookingLoader />}
      {!isLoading && (
        <Listbox value={selected} onChange={changeList}>
          <div className="relative w-full">
            <Listbox.Button
              className={`formInput w-full flex justify-between ${
                error === 'studio' && 'border-red-500 border-2 border-solid'
              }`}
              onClick={openModal}
            >
              <span className="block truncate text-base font-medium text-left text-gray-200">
                {selected.studio_name}
              </span>
              <span className="pointer-events-none flex items-center">
                <ChevronDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              show={isshow}
              // as={Fragment}
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
                          Choose a Studio
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
                    <Listbox.Options className="flex flex-col flex-grow self-stretch">
                      {items?.length === 0 && (
                        <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 self-stretch p-4">
                          <p className="flex-grow-0 flex-shrink-0 text-base font-normal text-center text-white">
                            No Studio Found
                          </p>
                        </div>
                      )}
                      {items?.map((studio, index) => (
                        <Listbox.Option
                          key={index}
                          className={({ active }) =>
                            `relative cursor-default select-none py-4 pl-5 pr-3 flex justify-start items-center flex-grow-0 flex-shrink-0 self-stretch border-b border-[#ffffff10] last:border-0 ${
                              active
                                ? 'bg-[#19191b55] text-white'
                                : 'text-white'
                            }`
                          }
                          value={studio}
                        >
                          {({ selected }) => (
                            <Fragment>
                              <div className="flex justify-between items-center flex-grow relative gap-4">
                                <div className="flex justify-start items-center flex-grow flex-shrink-0 self-stretch relative gap-4">
                                  <LazyLoadImage
                                    src={
                                      studio?.studio_image ||
                                      '/assets/images/profile-0.png'
                                    }
                                    className="w-8 h-8 object-cover bg-black rounded-full"
                                    width={32}
                                    height={32}
                                    alt=""
                                    onError={imageOnError}
                                  />
                                  <p
                                    className={`flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative text-left text-white ${
                                      selected ? 'font-medium' : 'font-normal'
                                    }`}
                                  >
                                    {studio.studio_name}
                                  </p>
                                </div>
                                <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1 pr-3">
                                  <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative">
                                    ₹ 
                                  </div>
                                  <p className="flex-grow-0 flex-shrink-0 text-left capitalize text-[#2fa3ff]">
                                    {Math.round(studio?.photo_price)}
                                   
                                  </p>
                                </div>
                              </div>
                              {selected ? (
                                <div className="absolute left-0 flex flex-grow-0 flex-shrink-0 justify-center items-center ml-5 w-8 h-8 text-white rounded-full bg-[#0362fcad] backdrop-blur-sm">
                                  <CheckIcon
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                </div>
                              ) : null}
                            </Fragment>
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
      )}
    </>
  );
}
