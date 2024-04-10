import React, { useState } from 'react';
import AuthProvider from '../../components/common/AuthProvider';
import ProfileLayout from '../../components/layout/ProfileLayout';
import Header from '../../components/common/Header';
import ArrowLeftIcon from '../../components/common/icons/arrowlefticon';
import { Popover, Transition } from '@headlessui/react';
import {
  EllipsisVerticalIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';
import useSWR from 'swr';
import * as api from '../../services/storeService';
import { useUser } from '../../context/UserContext';
import { filter } from 'lodash';
import { toast } from 'react-hot-toast';
import { printLog } from '../../helper/printLog';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';

export function FormGroup(prop) {
  return (
    <label className="flex flex-col md:flex-row justify-start items-start md:items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
      <div className="flex justify-between items-center w-full md:w-48">
        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 flex-grow-0 flex-shrink-0 text-sm font-medium text-left capitalize text-white/[0.8]">
          {prop.title}
        </span>
        {prop.error && (
          <span className="text-xs text-red-500">{prop.error}</span>
        )}
      </div>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 md:flex-grow flex-shrink-0 gap-4">
        <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
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
        </div>
      </div>
    </label>
  );
}

const SavedAddress = () => {
  const { userId } = useUser();
  const router = useRouter();
  const { data: address, mutate } = useSWR(
    userId && ['/store/getAddress' + userId],
    () => api.getAddress(userId)
  );

  const [isNew, setIsNew] = useState(false);
  const [checkAddress, setCheckAddress] = useState(null);
  const [isAlternative, setIsAlternative] = useState(false);
  const [editAddress, setEditAddress] = useState({
    address: [],
    isEdit: false,
  });

  // const cancelNewAddress = (e) => {
  //   e.preventDefault();
  //   setIsNew(false);
  // };

  const addressSelect = async () => {
    try {
      await api.saveDefaultAddress(checkAddress?.address_id);
      mutate();
      toast.success('Default address saved successfully');
    } catch (error) {
      toast.error('Something went wrong');
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
      .matches(/^[A-Za-z0-9\s,.-]+$/, 'Please enter a valid address'),
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
        (editAddress?.address && editAddress?.address?.alterNativePhone) || '',
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
    router.push(
      {
        pathname: '/user/address',
        query: { searchTerm: 'new' },
      },
      undefined,
      { shallow: true }
    );
  };

  const deleteAddress = async (id) => {
    try {
      const data = await api.deleteAddress(id);
      if (data.message === 'success') {
        mutate();
        toast.success('Address deleted successfully');
      } else {
        toast.error('Something Went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateAddress = async (id) => {
    const addressForEdit = filter(address, (o) => o.address_id === id);
    setEditAddress({
      address: addressForEdit && addressForEdit[0],
      isEdit: true,
    });
    setIsNew(true);
    router.push(
      {
        pathname: '/user/address',
        query: { searchTerm: 'edit' },
      },
      undefined,
      { shallow: true }
    );
  };
  const setAddress = (e, address) => {
    if (e.target.checked) {
      setCheckAddress(address);
      addressSelect();
    }
  };
  const handleBackNav = (e) => {
    e.preventDefault();
    const query = router.query;
    if (
      (query && query.searchTerm?.toLowerCase() === 'new') ||
      (query && query.searchTerm?.toLowerCase() === 'edit')
    ) {
      router.push('/user/address');
      setIsNew(false);
    } else {
      router.push('/user');
    }
  };

  return (
    <>
      <ProfileLayout>
        <AuthProvider>
          <header className="flex flex-col justify-start items-start bg-[#010201] md:bg-transparent md:border-b md:border-white/10 min-h-[64px] md:min-h-0">
            <div className="flex flex-col justify-start items-start self-stretch">
              <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 pl-5 md:px-0 py-4 md:pt-0">
                <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
                  {!isNew && (
                    <>
                      <button
                        onClick={handleBackNav}
                        className="flex md:hidden"
                      >
                        <ArrowLeftIcon height={24} width={24} />
                      </button>
                      <MapPinIcon className="hidden md:flex w-6 h-6 text-white" />
                    </>
                  )}
                  {isNew && (
                    <button onClick={handleBackNav} className="flex">
                      <ArrowLeftIcon height={24} width={24} />
                    </button>
                  )}
                </div>
                <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
                  {!isNew && (
                    <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                      {/* Select Address */}
                      Address
                    </p>
                  )}
                  {isNew && (
                    <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                      Add/Edit New Address
                    </p>
                  )}
                </div>
                <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-4">
                  {!isNew && (
                    <button
                      className="btn-primary self-stretch text-xs rounded-xl font-medium px-4 py-2"
                      onClick={addNewAddress}
                      type="button"
                    >
                      Add New Address
                    </button>
                  )}
                  {isNew && (
                    <button
                      className="btn-primary self-stretch text-xs rounded-xl font-medium px-4 py-2"
                      type="submit"
                      onClick={formik.handleSubmit}
                    >
                      {editAddress?.isEdit ? 'Update' : 'Save'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page Body */}
          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4 pb-4 md:pb-0 md:pt-4 w-screen md:w-full">
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 px-4 md:px-0">
              {!isNew && (
                <div className="flex flex-col self-stretch gap-2">
                  <ul className="flex flex-col list-none gap-2">
                    {address?.map((item, idx) => (
                      <li key={idx}>
                        <input
                          type="radio"
                          name="address"
                          id={item?.address_id}
                          defaultChecked={item?.is_default}
                          onChange={(e) => setAddress(e, item)}
                          className="hidden peer"
                        />
                        <div className="flex justify-between bg-white/5 rounded-md px-3 py-4 gap-3 border border-transparent hover:bg-white/10 transition-all peer-checked:bg-blue-500/20 peer-checked:border-green-700">
                          <label
                            htmlFor={item?.address_id}
                            className="flex self-stretch gap-3 cursor-pointer"
                            key={item?.address_id}
                          >
                            <div className="flex px-1">
                              <div className="flex justify-center items-center w-10 h-10 rounded-full bg-green-400/30">
                                <MapPinIcon className="w-4 h-4 text-green-100" />
                              </div>
                              {/* <input
                                type="radio"
                                name="address"
                                id={item?.address_id}
                                className="form-radio peer"
                                defaultChecked={item?.is_default}
                                onChange={(e) => setAddress(e, item)}
                              /> */}
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="flex-grow-0 flex-shrink-0 text-xs text-white/60">
                                {item?.name || 'Akash'}
                              </p>
                              <div className="flex flex-col md:flex-row text-white">
                                <div className="flex flex-col text-sm capitalize">
                                  {item?.landmark + ', ' + item?.address}
                                </div>
                                <div className="hidden md:flex flex-col text-sm capitalize">
                                  ,&nbsp;
                                </div>
                                <div className="flex flex-col text-sm capitalize">
                                  {item?.city +
                                    ', ' +
                                    item?.state +
                                    ', ' +
                                    item?.zip}
                                </div>
                              </div>
                              <div className="flex flex-col text-sm md:text-xs text-white/60">
                                {'(+91) ' + item?.phone}
                              </div>
                            </div>
                          </label>
                          <div className="flex">
                            <div className="flex flex-col gap-3">
                              <button
                                className="group flex p-1"
                                onClick={() => updateAddress(item?.address_id)}
                              >
                                <PencilIcon className="w-5 md:w-4 h-5 md:h-4 text-white group-hover:text-white/60" />
                              </button>
                              <button
                                className="group flex p-1"
                                onClick={() => deleteAddress(item?.address_id)}
                              >
                                <TrashIcon className="w-5 md:w-4 h-5 md:h-4 text-white group-hover:text-white/60" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {isNew && (
                <div className="flex flex-col gap-3 flex-grow-0 flex-shrink-0 text-sm text-left text-white/[0.64] w-full px-2">
                  <FormGroup
                    type="text"
                    title="Full Name"
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
                    title="Phone Number"
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
                  <div className="flex flex-col md:flex-row justify-start items-start md:items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                    <div className="flex justify-between items-center w-full md:w-48"></div>
                    {isAlternative ? (
                      <button
                        className="btn-primary text-xs text-red-400 bg-transparent hover:bg-transparent p-0 flex flex-row items-center gap-1 focus:ring-0"
                        onClick={deleteAlternativeNumber}
                      >
                        <MinusIcon className="w-4 h-4 text-inherit" />
                        Remove Alternative Number
                      </button>
                    ) : (
                      <button
                        className="btn-primary text-xs text-blue-400 bg-transparent hover:bg-transparent p-0 flex flex-row items-center gap-1 focus:ring-0"
                        onClick={addAlternativeNumber}
                      >
                        <PlusIcon className="w-4 h-4 text-inherit" />
                        Add Alternative Number
                      </button>
                    )}
                  </div>
                  <FormGroup
                    type="text"
                    title="Pincode"
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
                  <div className="flex md:flex-col gap-4 md:gap-3">
                    <div className="basis-1/2">
                      <FormGroup
                        type="text"
                        title="state"
                        name="state"
                        value={formik.values.state}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.errors.state && formik.touched.state
                            ? formik.errors.state
                            : null
                        }
                      />
                    </div>
                    <div className="basis-1/2">
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
                    title="House No., Building Name"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.errors.address && formik.touched.address
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
                      formik.errors.landmark && formik.touched.landmark
                        ? formik.errors.landmark
                        : null
                    }
                  />
                  <div className="flex justify-end pt-2">
                    <button
                      className="btn-primary self-stretch md:self-auto w-full md:w-28"
                      type="submit"
                      onClick={formik.handleSubmit}
                    >
                      {editAddress?.isEdit ? 'Update' : 'Save'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </AuthProvider>
      </ProfileLayout>
    </>
  );
};

export default SavedAddress;
