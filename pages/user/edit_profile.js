import useSWR from 'swr';
import Header from '../../components/common/Header';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import ArrowLeftIcon from '../../components/common/icons/arrowlefticon';
import * as api from '../../services/userService';
import { useRouter } from 'next/router';
import AuthProvider from '../../components/common/AuthProvider';
import { toast } from 'react-hot-toast';
import { printLog } from '../../helper/printLog';
import { DatePicker } from 'antd';
import moment from 'moment';
import dayjs from 'dayjs';
import { useUser } from '../../context/UserContext';
import { editprofileLable } from '../../constants/labelText';
import ProfileLayout from '../../components/layout/ProfileLayout';
import { UserIcon } from '@heroicons/react/24/outline';
import { LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';

export function FormGroup(prop) {
  return (
    <label className="flex flex-col md:flex-row justify-start items-start md:items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
      <div className="flex justify-between items-center w-full md:w-32">
        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white/[0.64]">
          {prop.title}
        </span>
        {prop.error && (
          <span className="text-xs text-red-500">{prop.error}</span>
        )}
      </div>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 md:flex-grow flex-shrink-0 gap-4">
        <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
          {prop.status !== 'disable' ? (
            <>
              {prop.type === 'date' ? (
                <DatePicker
                  className={'formInput w-full text-gray-200'}
                  disabledDate={(current) =>
                    current && current > moment().endOf('day')
                  }
                  format="DD-MM-YYYY"
                  onChange={(dateString) => prop.onChange(dateString)}
                  onBlur={prop.onBlur}
                  allowClear={false}
                  inputReadOnly={true}
                  value={dayjs(prop.value, 'YYYY-MM-DD')}
                  showToday={false}
                />
              ) : (
                <input
                  type={prop.type}
                  name={prop.name}
                  className="formInput"
                  placeholder={prop.placeholder}
                  value={prop.value}
                  disabled={prop.status}
                  onChange={prop.onChange}
                  onBlur={prop.onBlur}
                  style={prop.style}
                  pattern={prop.pattern}
                  autoComplete="off"
                />
              )}
            </>
          ) : (
            <>
              <input
                type={prop.type}
                name={prop.name}
                className="formInput"
                placeholder={prop.placeholder}
                defaultValue={prop.value}
                disabled={prop.status}
                onBlur={prop.onBlur}
                autoComplete="off"
              />
            </>
          )}
        </div>
      </div>
    </label>
  );
}

export default function EditProfile() {
  const router = useRouter();
  const { userId } = useUser();
  const [loadingSave,setLoadingSave]=useState(false)
  const { data } = useSWR(userId && '/api/user_booking_details', () =>
    api.getUserProfileDetails(userId)
  );
  const EditInformationSchema = Yup.object({
    email: Yup.string()
      .email('Email is not valid')
      .trim()
      .min(3, 'Too short')
      .max(30, 'Too Long')
      .required('Email is required')
      .matches(
        /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/gm,
        'Please enter valid email'
      ),
    name: Yup.string()
      .min(3, 'Too short')
      .max(25, 'Too Long')
      .trim()
      .required('Please enter your name')
      .matches(/^[A-Za-z\s]*$/, 'Please enter valid name'),
    phone: Yup.string()
      .matches(/^[6-9]\d{9}$/, 'Not a Valid Phone Number')
      .required('please enter Your number')
      .min(10)
      .trim()
      .max(10),
    dob: Yup.date().required('enter your date of birth'),
    address: Yup.array().of(
      Yup.object().shape({
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
        zip: Yup.string()
          .required('Enter Your Zip Code')
          .matches(/^[0-9]+$/, 'Must be only digits')
          .min(6, 'Must be exactly 6 digits')
          .max(6, 'Must be exactly 6 digits'),
      })
    ),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: data?.email || '',
      name: data?.name || '',
      phone: data?.phone || '',
      dob: data?.dob || moment().format('YYYY-MM-DD'),
      address: [
        {
          address: (data?.address && data?.address[0]?.address) || '',
          landmark: (data?.address && data?.address[0]?.landmark) || '',
          city: (data?.address && data?.address[0]?.city) || '',
          zip: (data?.address && data?.address[0]?.zip) || '',
        },
      ],
    },
    validationSchema: EditInformationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        setLoadingSave(true)
        if (values) {
          const { data } = await api.editProfile({
            name: values.name,
            email: values.email,
            phone: values.mobile,
            dob: values.dob,
            gender: values.gender,
            address: values.address,
            user_id: userId,
          });
          if (data.status_code === 200) {
            toast.success(data.status || 'Address update successful',{id:'ghhhhhhhhhhhhhhhhhhhhhh'});
          } else {
            toast.error(data.message);
          }
        }
      } catch (error) {
        toast.error('something went wrong');
        printLog(error);
      }finally{
        setTimeout(()=>{
          setLoadingSave(false)
        },2000)
      }
    },
  });
  function isInputNumber(event) {
    var char = String.fromCharCode(event.which);
    if (!/[0-9]/.test(char)) {
      event.preventDefault();
    }
  }
  const handleDate = (date, formik) => {
    const dateFrom = moment(date?.$d).format('YYYY-MM-DD');
    formik.setFieldValue('dob', dateFrom);
  };
  return (
    <ProfileLayout>
      <AuthProvider>
        <header className="flex flex-col justify-start items-start bg-[#010201] md:bg-transparent md:border-b md:border-white/10 min-h-[64px] md:min-h-0">
          <div className="flex flex-col justify-start items-start self-stretch">
            <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 pl-5 md:px-0 py-4 md:pt-0">
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
                <button
                  onClick={() => router.back()}
                  className="flex md:hidden"
                >
                  <ArrowLeftIcon height={24} width={24} />
                </button>
                <UserIcon className="hidden md:flex w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col justify-center items-start flex-grow self-stretch relative overflow-hidden gap-1">
                <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                  {editprofileLable.header}
                </p>
              </div>
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-4">
              <button
              className="btn-primary self-stretch text-xs rounded-xl font-medium px-4 py-2"
              onClick={formik.handleSubmit}
              type="button"
              disabled={loadingSave} 
            >
                {loadingSave ? (
                  <>
                    <LoadingOutlined /> {editprofileLable.save}
                  </>
                ) : (
                  editprofileLable.save
                )}
            </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 bg-[#19191C] md:gap-4 w-screen md:w-full">
          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-10 px-6 py-8 md:bg-[#202124]/60 md:rounded-xl">
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
              <p className="flex-grow-0 flex-shrink-0 text-2xl md:text-lg font-medium text-center text-white">
                {editprofileLable.heading}
              </p>
              <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
                <FormGroup
                  type="email"
                  title={editprofileLable.email}
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={
                    formik.errors.email && formik.touched.email
                      ? formik.errors.email
                      : null
                  }
                />
                <FormGroup
                  type="text"
                  title={editprofileLable.name}
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
                  type="tel"
                  title={editprofileLable.phone}
                  name="phone"
                  status="disabled"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.errors.phone && formik.touched.phone
                      ? formik.errors.phone
                      : null
                  }
                  onKeyPress={isInputNumber}
                />
                <FormGroup
                  type="date"
                  name="dob"
                  title={editprofileLable.dob}
                  value={formik.values.dob}
                  onChange={(date) => handleDate(date, formik)}
                  onBlur={formik.handleBlur}
                  error={
                    formik.errors.dob && formik.touched.dob
                      ? formik.errors.dob
                      : null
                  }
                />
              </div>
            </div>
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-5">
              <p className="flex-grow-0 flex-shrink-0 text-2xl md:text-lg font-medium text-center text-white">
                {editprofileLable.address.heading}
              </p>
              {formik.values.address.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 gap-4"
                >
                  <FormGroup
                    type="text"
                    title={editprofileLable.address.address}
                    name={`address[${index}].address`}
                    value={formik.values.address[index].address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.errors.address &&
                      formik.errors?.address[index]?.address &&
                      formik.touched.address &&
                      formik.touched?.address[index].address
                        ? formik.errors.address[index].address
                        : null
                    }
                  />
                  <FormGroup
                    type="text"
                    title={editprofileLable.address.landmark}
                    name={`address[${index}].landmark`}
                    value={formik.values.address[index].landmark}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.errors.address &&
                      formik.errors?.address[index]?.landmark &&
                      formik.touched.address &&
                      formik.touched?.address[index].landmark
                        ? formik.errors.address[index].landmark
                        : null
                    }
                  />
                  <FormGroup
                    type="text"
                    title={editprofileLable.address.city}
                    name={`address[${index}].city`}
                    value={formik.values.address[index].city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.errors.address &&
                      formik.errors?.address[index]?.city &&
                      formik.touched?.address &&
                      formik.touched?.address[index].city
                        ? formik.errors.address[index].city
                        : null
                    }
                  />
                  <FormGroup
                    type="tel"
                    title={editprofileLable.address.pin}
                    name={`address[${index}].zip`}
                    value={formik.values.address[index].zip}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    pattern="[0-9]*"
                    error={
                      formik.errors.address &&
                      formik.errors?.address[index]?.zip &&
                      formik.touched?.address &&
                      formik.touched?.address[index].zip
                        ? formik.errors.address[index].zip
                        : null
                    }
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:flex justify-end items-start self-stretch">
            <button
              className="btn-primary self-stretch md:self-auto md:w-28"
              onClick={formik.handleSubmit}
              type="button"
              disabled={loadingSave}
            >
            {loadingSave ? (
              <>
                <LoadingOutlined /> {editprofileLable.save}
              </>
            ) : (
              editprofileLable.save
            )}
        
            </button>
          </div>
        </div>
      </AuthProvider>
    </ProfileLayout>
  );
}
