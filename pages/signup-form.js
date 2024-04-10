'use client';
import { useFormik } from 'formik';
import SecondaryLayout from '../components/layout/SecondaryLayout';
import InputField from '../components/form-element/InputField';
import { useDispatch, useSelector } from 'react-redux';
import {
  setDob,
  setEmail,
  setGender,
  setName,
  setShowVerificationModal,
} from '../redux/slices/signupSlice';
import { useRouter } from 'next/router';
import * as api from '../services/userService';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SelectBox from '../components/form-element/SelectBox';
import moment from 'moment';
import {
  NotVerified,
  VeriFiedIcon,
} from '../components/common/icons/statusicons';
import { VerifySecondIdentiy } from '../components/common/VerifySecondIdentity';
import { printLog } from '../helper/printLog';
import { DatePicker } from 'antd';
import { getLocalStorage } from '../utils/localStore';
import { useUser } from '../context/UserContext';
import { basicInfoLabel } from '../constants/labelText';
import { UserValidator } from '../constants/userYupValidator';
import { LoadingOutlined } from '@ant-design/icons';

function FormGroup(prop) {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-for
    <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
      <div className="flex justify-between items-center w-full">
        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white/[0.64]">
          {prop.title}
        </span>
        <small className="text-xs text-red-500">{prop.error}</small>
      </div>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
        <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
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
              showToday={false}
            />
          ) : (
            <InputField
              type={prop.type}
              name={prop.name}
              className="formInput"
              value={prop.value}
              onChange={prop.onChange}
              onBlur={prop.onBlur}
              disabled={prop.status}
              min={prop.min || ''}
              max={prop.max || ''}
            />
          )}
        </div>
      </div>
    </label>
  );
}

export default function AccountBasicInfo() {
  // const currentPath = usePageReloadTracking('/signup');
  // console.log('currentPath', currentPath);
  const router = useRouter();
  const dispatch = useDispatch();

  const prevPath = getLocalStorage('prevRoute');

  const { setLogin } = useUser();
  const gender = [
    { value: '', label: 'Select' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'others', label: 'Others' },
  ];
  const {
    mobile,
    email,
    user_id,
    name: Fname,
    isEmailVerified,
    isPhoneVerified,
  } = useSelector((state) => state.signup);
  const [isMobile, setisMobile] = useState(mobile !== '' ? mobile : '');
  const [isEmail, setIsEmail] = useState(email !== '' ? email : '');
  const [otpSendLoading, setOtpSendLoading] = useState(false);

  useEffect(() => {
    if (!prevPath) {
      router.replace('/signup');
    }
    if (!user_id && user_id !== '') {
      router.replace('/login');
    }
  }, []);

  /**
   * @description:
   */
  useEffect(() => {
    if (mobile && parseInt(mobile, 10)) {
      setisMobile(mobile);
    } else if (email && email.includes('@')) {
      setIsEmail(email);
    }
  }, [mobile, email]);

  /**
   * @description:
   */
  const formik = useFormik({
    initialValues: {
      name: Fname !== '' ? Fname : '',
      mobile: isMobile !== '' ? isMobile : '',
      email: isEmail !== '' ? isEmail : '',
      dob: '',
      gender: '',
      address: [
        {
          address: '',
          landmark: '',
          city: '',
          zip: '',
        },
      ],
    },

    validationSchema: UserValidator,
    onSubmit: async (values) => {
      if (values && isPhoneVerified && isEmailVerified) {
        const res = await api.saveSignForm({
          name: values.name,
          email: values.email,
          phone: values.mobile,
          dob: values.dob,
          gender: values.gender,
          address: values.address,
          user_id: user_id,
        });
        if (res.data.status_code === 200) {
          dispatch(setName(values.name));
          dispatch(setEmail(values.email));
          dispatch(setDob(values.dob));
          dispatch(setGender(values.gender));
          const data = values;
          data.user_id = user_id;
          setLogin(data);
          toast.success('Welcome to ClickEzy');
          router.replace('/');
        } else {
          toast.error(res.data.message);
        }
      } else if (!isPhoneVerified) {
        toast.error('Verify phone number to submit');
      } else if (!isEmailVerified) {
        toast.error('Verify email address to submit');
      }
    },
  });

  /**
   * @description:
   */
  const handlePhoneVerify = async () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!mobile?.toString()?.length && !phoneRegex.test(formik.values.mobile)) {
      toast.error('Enter valid phone');
    } else {
      //call api
      try {
        const payload = {
          phone: formik.values.mobile,
        };
        setOtpSendLoading(true);
        const { data } = await api.signUpOtpGenerate(payload);
        if (data && data.status_code === 200) {
          setOtpSendLoading(false);
          toast.success(data.message);
          dispatch(setShowVerificationModal(true));
        } else {
          setOtpSendLoading(false);
          toast.error(data.message);
        }
      } catch (error) {
        setOtpSendLoading(false);
        printLog(error);
      }
    }
  };
  /**
   *
   * @returns
   */
  const validateEmail = () => {
    return String(formik.values.email).match(
      /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/gm
    );
  };

  /**
   * @returns
   */
  const handleEmailVerify = async () => {
    if (validateEmail()) {
      try {
        setOtpSendLoading(true);
        const payload = {
          email: formik.values.email,
        };
        const { data } = await api.signUpOtpGenerate(payload);
        if (data && data.status_code === 200) {
          setOtpSendLoading(false);
          toast.success(data.message);
          dispatch(setShowVerificationModal(true));
        } else {
          setOtpSendLoading(false);
          toast.error(data.message);
        }
      } catch (error) {
        setOtpSendLoading(false);
        printLog(error);
      }
    } else {
      toast.error('Enter valid email');
    }
  };

  const handleDate = (date, formik) => {
    const dateFrom = moment(date?.$d).format('YYYY-MM-DD');
    formik.setFieldValue('dob', dateFrom);
  };

  /**
   *
   * @param {*} e
   * @param {*} length
   */
  const handleNumberChange = (e, length) => {
    if (String(e.target.value).length <= length) {
      formik.handleChange(e);
    }
  };
  return (
    <SecondaryLayout>
      {/* Page Body */}
      <div className="flex flex-col md:flex-row justify-start md:justify-center items-start self-stretch flex-grow-0 flex-shrink-0 bg-[#1A1A1D] min-h-[inherit]">
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-10 px-6 py-10 md:max-w-sm md:min-w-[24rem]">
          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-5">
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
              <p className="flex-grow-0 flex-shrink-0 text-2xl font-semibold text-center text-white">
                {basicInfoLabel.heading}
              </p>
            </div>
            <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                <FormGroup
                  type="tel"
                  title={basicInfoLabel.phone.label}
                  name="mobile"
                  value={isMobile !== '' ? isMobile : formik.values.mobile}
                  status={isPhoneVerified}
                  onChange={(e) => handleNumberChange(e, 10)}
                  onBlur={formik.handleBlur}
                  error={
                    formik.errors.mobile && formik.touched.mobile
                      ? formik.errors.mobile
                      : null
                  }
                />
                <div className="flex justify-end w-full">
                  {isPhoneVerified ? (
                    <span className="text-green-400 flex items-center ">
                      {basicInfoLabel.verify} <VeriFiedIcon />
                    </span>
                  ) : (
                    <button
                      onClick={handlePhoneVerify}
                      className={`items-center text-red-600 flex ${
                        otpSendLoading ? 'cursor-wait' : 'cursor-pointer'
                      }`}
                      disabled={otpSendLoading ? 'disable' : ''}
                    >
                      {basicInfoLabel.notVerify} <NotVerified />
                    </button>
                  )}
                </div>
                {!isPhoneVerified && (
                  <VerifySecondIdentiy
                    value={formik.values.mobile}
                    type={'phone'}
                  />
                )}
              </div>

              <FormGroup
                type="text"
                title={basicInfoLabel.name.label}
                name="name"
                value={Fname !== '' ? Fname : formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.errors.name && formik.touched.name
                    ? formik.errors.name
                    : null
                }
              />
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                <FormGroup
                  type="email"
                  name="email"
                  title={basicInfoLabel.email.label}
                  value={isEmail !== '' ? isEmail : formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  status={isEmailVerified}
                  error={
                    formik.errors.email && formik.touched.email
                      ? formik.errors.email
                      : null
                  }
                />
                <div className="flex justify-end w-full">
                  {isEmailVerified ? (
                    <span className="text-green-400 flex items-center ">
                      {basicInfoLabel.verify} <VeriFiedIcon />
                    </span>
                  ) : (
                    <span
                      onClick={handleEmailVerify}
                      className={`items-center text-red-600 flex ${
                        otpSendLoading ? 'cursor-wait' : 'cursor-pointer'
                      }`}
                      disabled={otpSendLoading ? 'disable' : ''}
                    >
                      {basicInfoLabel.notVerify} <NotVerified />
                    </span>
                  )}
                </div>
                {!isEmailVerified && (
                  <VerifySecondIdentiy
                    value={formik.values.email}
                    type={'email'}
                  />
                )}
              </div>
              <SelectBox
                title={basicInfoLabel.gender.label}
                name={'gender'}
                options={gender}
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.errors.gender && formik.touched.gender
                    ? formik.errors.gender
                    : null
                }
              />

              <FormGroup
                type="date"
                name="dob"
                title={basicInfoLabel.dob.label}
                value={formik.values.dob}
                onChange={(date) => handleDate(date, formik)}
                onBlur={formik.handleBlur}
                max={moment().format('YYYY-MM-DD')}
                error={
                  formik.errors.dob && formik.touched.dob
                    ? formik.errors.dob
                    : null
                }
              />
            </div>
          </div>
          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-5">
            <p className="flex-grow-0 flex-shrink-0 text-2xl font-medium text-center text-white">
              {basicInfoLabel.address.heading}
            </p>
            <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
              {formik.values.address.map((item, index) => (
                <div key={index} className="w-full">
                  <FormGroup
                    type="text"
                    title={basicInfoLabel.address.label}
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
                    title={basicInfoLabel.landmark.label}
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
                    title={basicInfoLabel.city.label}
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
                    title={basicInfoLabel.pin.label}
                    name={`address[${index}].zip`}
                    value={formik.values.address[index].zip}
                    onChange={(e) => handleNumberChange(e, 6)}
                    onBlur={formik.handleBlur}
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
          <button
            type="submit"
            className="btn-primary self-stretch"
            onClick={formik.handleSubmit}
            disabled={formik.isSubmitting}
          >
          {formik.isSubmitting ? (
            <>
              <LoadingOutlined /> {basicInfoLabel.button}

            </>
          ) : (
            basicInfoLabel.button
          )}
          </button>
        </div>
      </div>
    </SecondaryLayout>
  );
}
