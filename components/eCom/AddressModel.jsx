import { Dialog, Popover, Transition } from '@headlessui/react';
import CloseModal from '../common/icons/CloseModal';
import {
  EllipsisVerticalIcon,
  PencilIcon,
  ShieldCheckIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Fragment, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import * as api from '../../services/storeService';
import { toast } from 'react-hot-toast';
import { printLog } from '../../helper/printLog';
import { filter } from 'lodash';

export function FormGroup(prop) {
  return (
    <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
      <div className="flex justify-between items-center w-full">
        <span className="after:content-['*'] after:ml-0.5 after:text-red-500  flex-grow-0 flex-shrink-0 text-sm font-medium text-left capitalize text-white/[0.8]">
          {prop.title}
        </span>
      </div>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
        <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
          <>
            <input
              type={prop.type}
              name={prop.name}
              className="formInput w-full"
              placeholder={prop.placeholder}
              onChange={prop.onChange}
              disabled={prop.status}
              onBlur={prop.onBlur}
              autoComplete="off"
              value={prop.value}
            />
          </>
        </div>
      </div>
      {prop.error && <span className="text-xs text-red-500">{prop.error}</span>}
    </label>
  );
}

const AddressModel = ({ address, mutate, userId, isDisplayFullAddress }) => {
  const [isNew, setIsNew] = useState(false);
  const [checkAddress, setCheckAddress] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAlternative, setIsAlternative] = useState(false);
  const [editAddress, setEditAddress] = useState({
    address: [],
    isEdit: false,
    alternativePhoneExists: false,
  });

  function closeModal() {
    setIsOpen(false);
  }

  function openModal(e) {
    e.preventDefault();
    setIsOpen(true);
  }

  const cancelNewAddress = (e) => {
    e.preventDefault();
    setIsNew(false);
  };

  const addressSelect = async (e, id) => {
    e.preventDefault();
    try {
      const data = await api.saveDefaultAddress(id);
      if (data) {
        toast.success('Address saved successfully');
      }
      mutate();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsOpen(false);
    }
  };

  const addAlternativeNumber = (e) => {
    e.preventDefault();
    setIsAlternative(true);
  };
  const deleteAlternativeNumber = (e) => {
    e.preventDefault();
    setIsAlternative(false);
  };

  const EditInformationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(3, 'Too short')
      .max(25, 'Too Long')
      .required('Enter Your Name')
      .matches(/^[A-Za-z\s]*$/, 'Please enter valid Name'),
    phone: Yup.string()
      .trim()
      .min(10, 'Too short')
      .max(10, 'Too Long')
      .required('Enter Your Phone Number')
      .matches(/^[0-9\s]*$/, 'Please enter valid Phone Number'),
    alterNativePhone: Yup.string()
      .trim()
      .min(10, 'Too short')
      .max(10, 'Too Long')
      .matches(/^[0-9\s]*$/, 'Please enter valid Phone Number'),
    address: Yup.string()
      .trim()
      .min(3, 'Too short')
      .max(25, 'Too Long')
      .required('Enter Your Address')
      .matches(/^[A-Za-z\s]*$/, 'Please enter valid address'),
    landmark: Yup.string()
      .trim()
      .min(3, 'Too short')
      .max(25, 'Too Long')
      .required('Enter Your Landmark'),
    city: Yup.string()
      .trim()
      .min(3, 'Too short')
      .max(25, 'Too Long')
      .required('Select Your City')
      .matches(/^[A-Za-z\s]*$/, 'Please enter valid city name'),
    state: Yup.string()
      .trim()
      .min(3, 'Too short')
      .max(25, 'Too Long')
      .required('Select Your City')
      .matches(/^[A-Za-z\s]*$/, 'Please enter valid state name'),
    zip: Yup.string()
      .required('Enter Your Zip Code')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(6, 'Must be exactly 6 digits')
      .max(6, 'Must be exactly 6 digits'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: (editAddress?.address && editAddress?.address?.name) || '',
      phone: (editAddress?.address && editAddress?.address?.phone) || '',
      alterNativePhone:
        (editAddress?.address && editAddress?.address?.alternative_phone) || '',
      address: (editAddress?.address && editAddress?.address?.address) || '',
      landmark: (editAddress?.address && editAddress?.address?.landmark) || '',
      city: (editAddress?.address && editAddress?.address?.city) || '',
      state: (editAddress?.address && editAddress?.address?.state) || '',
      zip: (editAddress?.address && editAddress?.address?.zip) || '',
    },
    validationSchema: EditInformationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        if (values) {
          const payload = {
            name: values.name,
            phone: values.phone,
            alternative_phone: values.alterNativePhone,
            address: values.address,
            landmark: values.landmark,
            city: values.city,
            state: values.state,
            zip: values.zip,
          };
          if (editAddress.isEdit) {
            const data = await api.updateAddress({
              ...payload,
              address_id: editAddress?.address.address_id,
            });
            if (data?.status === 'success' || data?.message === 'success') {
              toast.success('Address Updated');
              mutate();
              setIsNew(false);
            } else {
              toast.error(data.message);
            }
          } else {
            const data = await api.saveAddress({
              ...payload,
              user_id: userId,
            });
            if (data?.status === 'success') {
              toast.success('Address saved');
              mutate();
              setIsNew(false);
            } else {
              toast.error(data.message);
            }
          }
        }
      } catch (error) {
        toast.error('something went wrong');
        printLog(error);
      }
    },
  });

  const addNewAddress = (e) => {
    e.preventDefault();
    setEditAddress({ address: [], isEdit: false });
    setIsNew(true);
  };

  const deleteAddress = async (id) => {
    try {
      const data = await api.deleteAddress(id);
      if (data.message === 'success') {
        mutate();
      } else {
        toast.error('Something Went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateAddress = async (id) => {
    const addressForEdit = filter(address, (o) => o.address_id === id);
    // check alternative number
    let alternativePhoneExists = false;
    if (
      addressForEdit &&
      addressForEdit.length > 0 &&
      addressForEdit[0].alternative_phone
    ) {
      alternativePhoneExists = true;
    }
    // if alternative number present then show in UI
    if (alternativePhoneExists) {
      setIsAlternative(true);
    } else {
      setIsAlternative(false);
    }

    setEditAddress({
      address: addressForEdit && addressForEdit[0],
      isEdit: true,
      alternativePhoneExists,
    });
    setIsNew(true);
  };

  const setAddress = (e, address) => {
    if (e.target.checked) {
      setCheckAddress(address);
    }
  };
  const defaultAddress = filter(address, (o) => o.is_default);
  let selectedAddress = '';
  let selectedName = '';

  if (defaultAddress && defaultAddress.length > 0) {
    const add = defaultAddress[0];
    selectedAddress =
      add?.landmark +
      ' ' +
      add?.address +
      ' ' +
      add?.city +
      ' ' +
      add?.state +
      ' ' +
      add?.zip +
      ', ' +
      add?.phone;

    selectedName = add?.name;
  }
  return (
    <>
      {defaultAddress && defaultAddress.length > 0 && (
        <div className="w-full">
          {/* Display Full Address */}
          {isDisplayFullAddress ? (
            <>
              <div className="w-full p-3">
                <div className="flex justify-between items-center">
                  <div className="text-white text-lg">{selectedName}</div>
                  <div className="border p-1 px-3 rounded-sm border-gray-500 ">
                    <button className="w-full text-white" onClick={openModal}>
                      Change
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-white text-sm">{selectedAddress}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                onClick={openModal}
                className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-4 px-4 py-3.5 bg-[#27292d] md:bg-transparent cursor-pointer"
              >
                <div className="w-full flex justify-start items-center flex-grow relative gap-2">
                  <p className="flex-grow-0 flex-shrink-0 text-xs text-left text-white">
                    Delivering to
                  </p>
                  <p className="flex-grow w-full text-xs font-semibold text-left text-white truncate">
                    {selectedAddress}
                  </p>
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      d="M7.75835 5.59246C7.6811 5.66955 7.61981 5.76113 7.57799 5.86194C7.53617 5.96275 7.51465 6.07082 7.51465 6.17996C7.51465 6.2891 7.53617 6.39717 7.57799 6.49798C7.61981 6.59879 7.6811 6.69036 7.75835 6.76746L10.9917 10.0008L7.75835 13.2341C7.60254 13.3899 7.515 13.6013 7.515 13.8216C7.515 14.042 7.60254 14.2533 7.75835 14.4091C7.91417 14.5649 8.1255 14.6525 8.34585 14.6525C8.56621 14.6525 8.77754 14.5649 8.93335 14.4091L12.7584 10.5841C12.8356 10.507 12.8969 10.4155 12.9387 10.3146C12.9805 10.2138 13.0021 10.1058 13.0021 9.99662C13.0021 9.88749 12.9805 9.77942 12.9387 9.67861C12.8969 9.57779 12.8356 9.48622 12.7584 9.40913L8.93335 5.58412C8.61669 5.26746 8.08335 5.26746 7.75835 5.59246Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      <Transition
        show={isOpen}
        as={Fragment}
        className="fixed inset-y-0 max-w-sm min-h-screen mx-auto z-50"
      >
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-y-0 inset-x-0 m-auto min-w-full sm:max-w-sm bg-[#00000084] backdrop-blur-sm z-40"
            onClick={closeModal}
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>
          <Transition.Child
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
            className="fixed bottom-0 md:bottom-0 inset-x-0 m-auto max-w-full md:max-w-[50vw] h-[93vh] max-h-[93vh] rounded-t-xl md:rounded-xl text-base shadow-lg overflow-auto ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50"
          >
            <div className="flex flex-col justify-start items-start self-stretch flex-grow relative bg-[#202124] min-h-[inherit]">
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0  bg-[#18191b] sticky top-0 z-50 p-4 gap-8">
                <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                  <p className="flex-grow-0 flex-shrink-0 text-lg text-center text-white">
                    {!isNew ? 'Select your address' : 'Add/Edit a new address'}
                  </p>
                  <button type="button" onClick={closeModal}>
                    <CloseModal />
                  </button>
                </div>

                <div className="flex flex-col w-full">
                  <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
                    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-5">
                      <>
                        {!isNew && (
                          <div className="flex flex-col gap-3 w-full">
                            {address?.map((item) => (
                              <label
                                htmlFor={item?.address_id}
                                className="flex align-middle justify-center bg-[#262830] p-2 w-full rounded-sm"
                                key={item?.address_id}
                              >
                                <div className="w-[10%] flex items-start pt-2 ">
                                  <input
                                    type="radio"
                                    name="address"
                                    id={item?.address_id}
                                    className="w-4 h-4"
                                    defaultChecked={item?.is_default}
                                    onChange={(e) => setAddress(e, item)}
                                  />
                                </div>
                                <div className="w-[70%] flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 ml-2">
                                  <p className="flex-grow-0 flex-shrink-0 text-md text-left text-white">
                                    {item?.name || 'Akash'}
                                  </p>
                                  <ul className="flex-grow-0 flex-shrink-0 text-sm text-left text-white/[0.64]">
                                    <li>
                                      {item?.landmark +
                                        ' ' +
                                        item?.address +
                                        ' ' +
                                        item?.city}
                                    </li>

                                    <li>{item?.state + ' ' + item?.zip}</li>
                                    <li>{item?.phone}</li>
                                  </ul>
                                </div>
                                <div className="w-[15%] flex items-start pt-2 px-4 text-white">
                                  <Popover className="relative">
                                    {({ open }) => (
                                      <>
                                        <Popover.Button>
                                          <EllipsisVerticalIcon className="w-6 h-6" />
                                        </Popover.Button>

                                        <Transition
                                          enter="transition duration-100 ease-out"
                                          enterFrom="transform scale-95 opacity-0"
                                          enterTo="transform scale-100 opacity-100"
                                          leave="transition duration-75 ease-out"
                                          leaveFrom="transform scale-100 opacity-100"
                                          leaveTo="transform scale-95 opacity-0"
                                        >
                                          <Popover.Panel className="absolute z-10 right-1 w-max">
                                            <div className="flex flex-col gap-3 p-3 px-6 bg-black/50 rounded-md ">
                                              <button
                                                className="flex gap-2"
                                                onClick={(e) =>
                                                  addressSelect(
                                                    e,
                                                    item?.address_id
                                                  )
                                                }
                                              >
                                                <ShieldCheckIcon className="w-5 h-5" />
                                                Set as default
                                              </button>
                                              <button
                                                className="flex gap-2"
                                                onClick={() =>
                                                  updateAddress(
                                                    item?.address_id
                                                  )
                                                }
                                              >
                                                <PencilIcon className="w-5 h-5" />
                                                Edit
                                              </button>
                                              <button
                                                className="flex gap-2"
                                                onClick={() =>
                                                  deleteAddress(
                                                    item?.address_id
                                                  )
                                                }
                                              >
                                                <TrashIcon className="w-5 h-5" />
                                                Delete
                                              </button>
                                            </div>
                                          </Popover.Panel>
                                        </Transition>
                                      </>
                                    )}
                                  </Popover>
                                </div>
                              </label>
                            ))}

                            <div className="text-blue-500 mt-4">
                              <button onClick={addNewAddress}>
                                + Add New Address
                              </button>
                            </div>
                          </div>
                        )}
                        {isNew && (
                          <>
                            <div className="flex flex-col gap-3 flex-grow-0 flex-shrink-0 text-sm text-left text-white/[0.64] w-full">
                              <FormGroup
                                type="text"
                                title="Full Name (Required)"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                  formik.errors.name && formik.touched.name
                                    ? formik.errors.name
                                    : null
                                }
                              />
                              <FormGroup
                                type="text"
                                title="Phone Number (Required)"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                  formik.errors.phone && formik.touched.phone
                                    ? formik.errors.phone
                                    : null
                                }
                              />
                              {isAlternative && (
                                <FormGroup
                                  type="text"
                                  title="Alternative Phone Number"
                                  name="alterNativePhone"
                                  value={formik.values.alterNativePhone}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={
                                    formik.errors.alterNativePhone &&
                                    formik.touched.alterNativePhone
                                      ? formik.errors.alterNativePhone
                                      : null
                                  }
                                />
                              )}
                              {!editAddress.alternativePhoneExists && (
                                <>
                                  {isAlternative ? (
                                    <>
                                      <span
                                        className="text-blue-500 cursor-pointer"
                                        onClick={deleteAlternativeNumber}
                                      >
                                        - Remove Alternative Number
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span
                                        className="text-blue-500 cursor-pointer"
                                        onClick={addAlternativeNumber}
                                      >
                                        + Add Alternative Number
                                      </span>
                                    </>
                                  )}
                                </>
                              )}

                              <div className="w-[50%]">
                                <FormGroup
                                  type="text"
                                  title="Pincode (Required)"
                                  name="zip"
                                  value={formik.values.zip}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={
                                    formik.errors.zip && formik.touched.zip
                                      ? formik.errors.zip
                                      : null
                                  }
                                />
                              </div>

                              <div className="flex gap-4">
                                <div className="w-1/2">
                                  <FormGroup
                                    type="text"
                                    title="state"
                                    name="state"
                                    value={formik.values.state}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                      formik.errors.state &&
                                      formik.touched.state
                                        ? formik.errors.state
                                        : null
                                    }
                                  />
                                </div>
                                <div className="w-1/2">
                                  <FormGroup
                                    type="text"
                                    title="City"
                                    name="city"
                                    value={formik.values.city}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                      formik.errors.city && formik.touched.city
                                        ? formik.errors.city
                                        : null
                                    }
                                  />
                                </div>
                              </div>

                              <FormGroup
                                type="text"
                                title="House No., Building Name (Required)"
                                name="address"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                  formik.errors.address &&
                                  formik.touched.address
                                    ? formik.errors.address
                                    : null
                                }
                              />
                              <FormGroup
                                type="text"
                                title="Landmark"
                                name="landmark"
                                value={formik.values.landmark}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                  formik.errors.landmark &&
                                  formik.touched.landmark
                                    ? formik.errors.landmark
                                    : null
                                }
                              />
                            </div>
                            <div className="flex w-full text-white flex-shrink space-x-2 mb-4">
                              <button
                                className="w-full btn-primary capitalize rounded-xl  bg-[#393b40]"
                                type="submit"
                                onClick={formik.handleSubmit}
                              >
                                {editAddress?.isEdit ? 'Update' : 'Save'}
                              </button>
                              <button
                                className="w-full btn-primary btn-primary capitalize rounded-xl  bg-[#e24b4b]"
                                onClick={cancelNewAddress}
                              >
                                Close
                              </button>
                            </div>
                          </>
                        )}
                      </>
                      {/* {!isNew && (
                        <div className="flex w-full justify-center mb-4">
                          <button
                            className="btn-primary w-full m-auto"
                            onClick={addressSelect}
                          >
                            Done
                          </button>
                        </div>
                      )} */}
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

export default AddressModel;
