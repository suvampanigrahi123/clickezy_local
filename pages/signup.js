import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { Dialog, Transition } from '@headlessui/react';
import SecondaryLayout from '../components/layout/SecondaryLayout';
import Header from '../components/common/Header';
import InputField from '../components/form-element/InputField';
import * as api from '../services/userService';
import { useDispatch } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { signUpLabel } from '../constants/labelText';
import {
  resetSignup,
  setEmail,
  setMobile,
  setName,
  setUserId,
} from '../redux/slices/signupSlice';
import CloseModalIcon from '../components/common/icons/closemodalIcon';
import { GoogleOAuthProvider } from '@react-oauth/google';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { isEmailValid, isPhoneValid } from '../utils/validation';
import { printLog } from '../helper/printLog';
import { OTPModal } from '../components/form-element/OTPModal';

export default function Signup() {
  const [isOpen, setIsOpen] = useState(false);
  const [OtpModal, setOtpModal] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  function closeModal() {
    setAcceptTerms(true);
    setIsOpen(false);
  }
  const acceptTermsHandler = () => {
    setIsOpen(false);
    setAcceptTerms(true);
    formik.setFieldValue('acceptTerms', true);
  };
  function openModal() {
    setIsOpen(true);
  }

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetSignup());
  }, []);

  const formik = useFormik({
    initialValues: {
      email_number: '',
      acceptTerms: acceptTerms ? acceptTerms : false,
    },
    validationSchema: Yup.object({
      email_number: Yup.string()
        .required('Email or Phone is required')
        .test('email_or_phone', 'Invalid Email or Phone', (value) => {
          return isEmailValid(value) || isPhoneValid(parseInt(value ?? '0'));
        }),
      acceptTerms: Yup.boolean()
        .oneOf([true], 'Please accept terms and conditions')
        .required('Please accept terms and conditions'),
    }),
    onSubmit: async (values) => {
      const t = toast.loading('OTP is sending...');
      const { email_number } = values;
      const isEmail = isEmailValid(email_number);
      let payload = {};
      if (!isEmail) {
        payload = {
          phone: email_number,
        };
      } else {
        payload = {
          email: email_number,
        };
      }
      // check if all fields are valid
      try {
        if (values.email_number && values.acceptTerms) {
          const { data } = await api.signUpOtpGenerate(payload);
          if (data && data.status_code === 200) {
            toast.dismiss(t);
            toast.success(data.message);
            if (isEmailValid(values.email_number)) {
              dispatch(setEmail(values.email_number));
            } else {
              dispatch(setMobile(parseInt(values.email_number)));
            }
            setOtpModal(true);
          } else {
            toast.dismiss(t);
            toast.error(data.message);
          }
        }
      } catch (error) {
        toast.dismiss();
        toast.error('Something went wrong, please try again later');
        printLog(error);
      }
    },
  });

  const [shouldFetch, setShouldFetch] = useState(false);
  const [token, setToken] = useState([]);
  // const googleSignUp = useGoogleLogin({
  //   onSuccess: async (response) => {
  //     setToken(response);
  //     if (response) {
  //       setShouldFetch(true);
  //     }
  //   },
  //   onError: (error) => {
  //     toast.error('Something went wrong, please try again later');
  //     printLog(error);
  //   },
  // });

  const { data: googleProfile } = useSWR(
    shouldFetch ? '/google/login' : null,
    () => api.googleLogin(token)
  );
  if (googleProfile) {
    const { email, name, id } = googleProfile.data;
    dispatch(setUserId(id));
    dispatch(setEmail(email));
    dispatch(setName(name));
    router.replace('/signup-form');
  }

  const setOpenModalHandler = (value) => {
    setOtpModal(value);
  };
  return (
    <SecondaryLayout>
      <Header>
        <div className="flex justify-start items-center self-stretch flex-grow gap-2 px-6 md:px-44 py-4">
          <Link
            href={'/'}
            className="flex justify-start items-center flex-grow relative"
          >
            <p className="flex-grow-0 flex-shrink-0 text-xl font-medium capitalize">
              <span className="flex-grow-0 flex-shrink-0 text-xl font-medium capitalize text-[#1185e0]">
                Click
              </span>
              <span className="flex-grow-0 flex-shrink-0 text-xl font-medium capitalize text-white">
                ezy
              </span>
            </p>
          </Link>
        </div>
      </Header>

      {/* Page Body */}
      <GoogleOAuthProvider clientId={process.env.CLIENT_ID}>
        <div className="flex flex-col md:flex-row justify-start md:justify-center items-start self-stretch flex-grow-0 flex-shrink-0 bg-[#1A1A1D] min-h-[inherit]">
          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-10 px-6 py-12">
            <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
              <p className="flex-grow-0 flex-shrink-0 text-2xl font-semibold text-center text-white">
                {signUpLabel.heading}
              </p>
              <p className="flex-grow-0 flex-shrink-0 text-sm text-center text-white/[0.64]">
                {signUpLabel.desc}
              </p>
            </div>
            <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
              {/* Google login */}
              {/* <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-3">
                <button
                  onClick={() => googleSignUp()}
                  className="btn-primary flex justify-center items-center relative w-full bg-[#27292d] gap-3 h-12"
                >
                  <GoogleIcon />
                  <p className="flex-grow-0 flex-shrink-0 text-sm font-normal text-center text-white">
                    {signUpLabel.google}
                  </p>
                </button>
              </div>
              <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2.5 py-4">
                <HalfLine />
                <p className="flex-grow-0 flex-shrink-0 text-xs font-semibold text-center text-[#7b8794]">
                  OR
                </p>
                <HalfLine />
              </div> */}

              <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                <span className="sr-only after:content-['*'] after:ml-0.5 after:text-red-500 flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white/[0.64]">
                  Email or phone
                </span>
                <InputField
                  type="text"
                  placeholder={signUpLabel.placeHolder}
                  name="email_number"
                  className="formInput"
                  value={formik.values.email_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.errors.email_number && formik.touched.email_number
                      ? formik.errors.email_number
                      : null
                  }
                />
              </label>

              <div className="flex justify-center items-center flex-col self-stretch flex-grow-0 flex-shrink-0 gap-4 py-4 mb-4 relative">
                <div className="flex justify-start items-center flex-grow relative gap-2">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    className="form-check border-gray-300 text-[#186ced] rounded shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50 cursor-pointer"
                    value={formik.values.acceptTerms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    checked={formik.values.acceptTerms}
                  />

                  <label htmlFor="acceptTerms" className="form-check-label">
                    <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">
                      {signUpLabel.condition}{' '}
                    </span>
                  </label>
                  <span
                    onClick={openModal}
                    className="text-[#2fa3ff] cursor-pointer"
                  >
                    {signUpLabel.terms}
                  </span>
                  {/* <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left" /> */}
                </div>
                <small className="text-red-500 absolute bottom-[-8px]">
                  {formik.errors.acceptTerms && formik.touched.acceptTerms
                    ? formik.errors.acceptTerms
                    : null}
                </small>
              </div>

              <button
                className="btn-primary self-stretch "
                onClick={formik.handleSubmit}
                type="submit"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? (
                  <>
                    <LoadingOutlined /> Signup
                  </>
                ) : (
                  signUpLabel.button
                )}
              </button>
              {OtpModal && (
                <OTPModal
                  value={formik.values.email_number}
                  setOpenModal={setOpenModalHandler}
                  openModal={OtpModal}
                  isSignup={true}
                />
              )}

              <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2.5 py-4">
                <p className="flex-grow-0 flex-shrink-0 text-center">
                  <span className="flex-grow-0 flex-shrink-0 text-sm text-center text-white/[0.64]">
                    {signUpLabel.account}
                  </span>
                  <Link
                    href="/login"
                    replace={true}
                    className="flex-grow-0 flex-shrink-0 text-base font-medium text-center text-white"
                  >
                    {' '}
                    {signUpLabel.oldAccount}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>

      {/* Modal: Terms & Conditions */}

      <Transition
        show={isOpen}
        as={Fragment}
        className="fixed inset-y-0 max-w-sm min-h-screen mx-auto z-50"
      >
        <Dialog
          as="div"
          className="relative z-10"
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
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
            <div className="flex flex-col justify-start items-start self-stretch flex-grow relative bg-[#202124] min-h-[inherit] pb-14">
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-3 bg-[#202124] sticky top-0 z-50 p-4">
                <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative overflow-hidden">
                  <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-center text-white">
                    Terms of Use
                  </p>
                  <CloseModalIcon closeModal={closeModal} />
                </div>
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4"></div>
              </div>
              <div className="flex flex-col gap-4 p-5 text-white rounded-lg mt-4 text-justify">
                <p className="text-sm ">
                  Welcome to Clickezy By using our services, you agree to abide
                  by these terms and conditions.
                </p>
                <p className="text-sm">
                  You must be at least 14 years old to use our app. By signing
                  up, you confirm that you meet this requirement.When creating
                  an account, you are responsible for keeping your login
                  credentials confidential. Any activity on your account is your
                  responsibility.
                </p>
                <p className="text-sm">
                  To book a studio, follow our booking process. Rates are
                  charged on an hourly basis, and additional fees may apply. We
                  accept payments through UPI and other available methods
                </p>
                <p className="text-sm">
                  Cancellation policies apply, and fees may be charged for
                  cancellations. Rescheduling is subject to
                  availability.Bookings are limited to a maximum of 8 hours.
                  Follow studio rules regarding equipment and
                  cleanliness.Photographs taken in our studios are owned by the
                  respective photographer. Commercial use must be permitted by
                  the photographer.
                </p>
                <p className="text-sm">
                  Refer to our privacy policy for information on data collection
                  and handling.We are not liable for unforeseen events or
                  disputes between users and photographers. Ensure you have the
                  necessary insurance for your activities.We may terminate
                  accounts for violations of these terms.We may update these
                  terms, and you will be notified of any changes.
                </p>
                <p className="text-sm">
                  For support and inquiries, contact us at clickezy@gmail.com.By
                  using our app, you accept these terms and conditions.If any
                  part of these terms is found invalid, the rest remains in
                  effect.These terms constitute the entire agreement between you
                  and Clickezy.
                </p>
              </div>
              <div className="flex justify-end pr-3 w-full">
                <button
                  type="button"
                  className="btn-primary text-sm"
                  onClick={acceptTermsHandler}
                >
                  Accept
                </button>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </SecondaryLayout>
  );
}
