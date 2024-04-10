import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SecondaryLayout from '../components/layout/SecondaryLayout';
import Header from '../components/common/Header';
import InputField from '../components/form-element/InputField';
import * as api from '../services/userService';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setEmail_phone } from '../redux/slices/signInSlice';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { isEmailValid, isPhoneValid } from '../utils/validation';
import { LoadingOutlined } from '@ant-design/icons';
import { printLog } from '../helper/printLog';
import { OTPModal } from '../components/form-element/OTPModal';
import { LoginLabel } from '../constants/labelText';
// import {
//   fbLogin,
//   getFacebookLoginStatus,
//   initFacebookSdk,
//   initializeFbSDK,
// } from '../utils/FacebookSDK';
// import FLogin from '../components/FLogin';
export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [setUser] = useState(null);

  // useEffect(() => {
  //   console.log('Started use effect');
  //   initFacebookSdk().then(() => {
  //     getFacebookLoginStatus().then((response) => {
  //       console.log('inside', response);
  //       if (response == null) {
  //         console.log('No login status for the person');
  //       } else {
  //         console.log(response);
  //       }
  //     });
  //   });
  // }, []);

  // async function login() {
  //   const res = await initializeFbSDK();
  //   if (!res) {
  //     alert('Razorpay SDK Failed to load');
  //     return;
  //   }
  //   console.log('reached log in button');
  //   fbLogin().then((response) => {
  //     console.log(response);
  //     if (response.status === 'connected') {
  //       console.log('Person is connected');
  //       console.log(response);
  //     } else {
  //       console.log('not connected');
  //     }
  //   });
  // }

  const formik = useFormik({
    initialValues: {
      email_number: '',
    },
    validationSchema: Yup.object({
      email_number: Yup.string()
        .required('Email or phone is required')
        .test('email_or_phone', 'Email / Phone is invalid', (value) => {
          return isEmailValid(value) || isPhoneValid(parseInt(value ?? '0'));
        }),
    }),
    onSubmit: async (values) => {
      if (values) {
        try {
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

          const { data } = await api.signInOtpGenerate(payload);
          if (data.status_code === 409) {
            toast.dismiss(t);
            toast.error(data.message);
            return;
          }

          if (data?.status_code === 200) {
            toast.dismiss(t);
            toast.success(data?.message);
            dispatch(setEmail_phone(email_number));
            setOpenModal(true);
            // router.replace('/signIn-otp');
          } else {
            toast.dismiss(t);
            toast.info(data.status);
          }
        } catch (error) {
          toast.dismiss();
          toast.error('Something went wrong, please try again later');
          printLog(error);
        }
      }
    },
  });

  const [shouldFetch, setShouldFetch] = useState(false);
  const [token, setToken] = useState([]);
  // const G_login = useGoogleLogin({
  //   onSuccess: async (response) => {
  //     setToken(response);
  //     if (response) {
  //       setShouldFetch(true);
  //     }
  //   },
  //   onError: (error) => {
  //     toast.error('Something went wrong, please try again later');
  //     printLog('Login Failed:', error);
  //   },
  // });
  const { data: googleProfile } = useSWR(
    shouldFetch ? '/google/login' : null,
    () => api.googleLogin(token)
  );
  if (googleProfile) {
    const { email, name, picture, id } = googleProfile.data;
    dispatch(
      setUser({
        email,
        name,
        picture,
        user_id: id,
      })
    );
    router.push('/user');
  }
  /**
   * Callback function to set open modal
   * @param {*} value
   */
  const setOpenModalHandler = (value) => {
    setOpenModal(value);
  };
  return (
    <SecondaryLayout>
      <Header>
        <div className="flex justify-start items-center self-stretch flex-grow gap-2 px-6 py-4 md:px-44">
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
                {LoginLabel.heading}
              </p>
              <p className="flex-grow-0 flex-shrink-0 text-sm text-center text-white/[0.64]">
                {LoginLabel.des}
              </p>
            </div>
            <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
              {/* <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-3">
                <button
                  onClick={() => G_login()}
                  className="btn-primary flex justify-center items-center relative w-full bg-[#27292d] gap-3 h-12"
                >
                  <GoogleIcon />
                  <p className="flex-grow-0 flex-shrink-0 text-sm font-normal text-center text-white">
                    {LoginLabel.google}
                  </p>
                </button>
              </div> */}
              {/* <div>
                <button onClick={login}>login With FB</button>
                <FLogin />
              </div> */}
              {/* <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2.5 py-4">
                <HalfLine />
                <p className="flex-grow-0 flex-shrink-0 text-xs font-semibold text-center text-[#7b8794]">
                  OR
                </p>
                <HalfLine />
              </div> */}
              <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                <span className="sr-only after:content-['*'] after:ml-0.5 after:text-red-500 flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white/[0.64]">
                  Email
                </span>
                <InputField
                  type="text"
                  placeholder={LoginLabel.placeHolder}
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
                  autoComplete="on"
                />
              </label>
              <button
                type="button"
                className="btn-primary self-stretch "
                onClick={formik.handleSubmit}
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? (
                  <>
                    <LoadingOutlined /> Login
                  </>
                ) : (
                  LoginLabel.button
                )}
              </button>
              {openModal && (
                <OTPModal
                  value={formik.values.email_number}
                  setOpenModal={setOpenModalHandler}
                  openModal={openModal}
                  isSignin={true}
                />
              )}

              <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2.5 py-4">
                <p className="flex-grow-0 flex-shrink-0 text-center">
                  <span className="flex-grow-0 flex-shrink-0 text-sm text-center text-white/[0.64]">
                    {LoginLabel.account}
                  </span>
                  <Link
                    href="/signup"
                    replace={true}
                    className="flex-grow-0 flex-shrink-0 text-base font-medium text-center text-white"
                  >
                    {' '}
                    {LoginLabel.newAccount}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </SecondaryLayout>
  );
}
