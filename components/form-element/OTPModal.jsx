import { Dialog, Transition } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import CloseModal from '../common/icons/CloseModal';
import * as api from '../../services/userService';
import { toast } from 'react-hot-toast';
import { COMMON } from '../../constants/const';
import { printLog } from '../../helper/printLog';
import { isPhoneValid } from '../../utils/validation';
import { useRouter } from 'next/router';
import { setUser } from '../../redux/slices/signInSlice';
import { getLocalStorage } from '../../utils/localStore';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { otpLabel } from '../../constants/labelText';
import {
  setEmail,
  setIsEmailVerified,
  setIsPhoneVerified,
  setMobile,
  setUserId,
} from '../../redux/slices/signupSlice';
import { useUser } from '../../context/UserContext';

export const OTPModal = ({
  value,
  setOpenModal,
  openModal,
  isSignin,
  isSignup,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [confirmLoading] = useState(false);
  const [isPhone] = useState(() => isPhoneValid(value));
  const { setLogin, setLoginToken } = useUser();
  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft >= 0 && openModal) {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timeLeft]);

  useEffect(() => {
    if (openModal) {
      setTimeLeft(60);
    }
  }, [openModal]);

  const handleChange = (e, index) => {
    if (e.target.value) {
      e.target.style.border = 'none';
    } else {
      e.target.style.border = '1px solid red';
    }
    const value = e.target.value;
    if (isNaN(value)) {
      return;
    }

    const newOtp = [...otp];
    // allow only one input
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if current field is filled
    if (value && index < 4 - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);

    // // optional
    if (index > 0 && !otp[index - 1]) {
       inputRefs.current[otp.indexOf('')].focus();
     }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === 'Backspace' &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      // Move focus to the previous input field on backspace
      inputRefs.current[index - 1].focus();
    }
  };
  /**
   * @description: Resend OTP
   */
  const handleResendOtp = async () => {
    try {
      let payload = {};
      if (isPhoneValid(value)) {
        payload = {
          phone: value,
        };
      } else {
        payload = {
          email: value,
        };
      }
      setResendLoading(true);
      if (isSignin) {
        const { data } = await api.signInOtpGenerate(payload);
        if (data && data.status_code === 200) {
          setResendLoading(false);
          toast.success(data.message);
          setTimeLeft(60);
        } else {
          setResendLoading(false);
          toast.error(data.message);
        }
      }
      if (isSignup) {
        const { data } = await api.signUpOtpGenerate(payload);
        if (data && data.status_code === 200) {
          setResendLoading(false);
          toast.success(data.message);
          setTimeLeft(60);
        } else {
          setResendLoading(false);
          toast.error(data.message);
        }
      }
    } catch (error) {
      setResendLoading(false);
      printLog(error);
    }
  };

  /**
   * @description: Confirm OTP
   */
  const ConfirmHandler = async () => {
    try {
      const OTP = otp.join('');
      if (OTP.length < 4) {
        const otpArr = document.querySelectorAll('#otp');
        otpArr.forEach((element) => {
          if (!element.value) {
            element.style.border = '1px solid red';
          }
        });
      } else {
        toast.loading('Please wait...');
        let payload = {};
        if (isPhoneValid(value)) {
          payload = {
            phone: value,
          };
        } else {
          payload = {
            email: value,
          };
        }
        const token = getLocalStorage(COMMON.FIREBASE_TOKEN)
          ? getLocalStorage(COMMON.FIREBASE_TOKEN)
          : 'token';
        /**
         * @description: Sign In API
         */
        if (isSignin) {
          const res = await api.signIn({
            otp: OTP,
            payload,
            token,
          });
          if (res.data.statusCode === 200 && res.data.is_logged_in === 1) {
            toast.dismiss();
            const authToken = res?.headers?.['x-auth-token'];
            toast.success(res.data.message || COMMON.LOGIN_SUCCESS);
            dispatch(setUser(res.data));
            setLogin(res.data);
            setLoginToken(authToken);
            const prevRoute = getLocalStorage('prevRoute');
            if (
              prevRoute &&
              prevRoute !== '/login' &&
              prevRoute !== '/signup'
            ) {
              router.replace(prevRoute);
            } else {
              router.replace('/');
            }
          }
          // if sign-up form not filled
          else if (res.data.statusCode === 200 && res.data.is_logged_in === 0) {
            const authToken = res?.headers?.['x-auth-token'];
            setLoginToken(authToken);
            toast.dismiss();

            dispatch(setUserId(res.data.user_id));
            if (res.data && res.data.email) {
              dispatch(setEmail(res.data.email));
              dispatch(setIsEmailVerified(true));
            }
            if (res.data && res.data.phone) {
              dispatch(setMobile(res.data.phone));
              dispatch(setIsPhoneVerified(true));
            }
            router.replace('/signup-form');
          } else {
            toast.dismiss();
            toast.error(res.data.message || COMMON.LOGIN_FAILED);
            setOtp(['', '', '', '']);
          }
        }
        /**
         * @description: Sign Up API
         */
        if (isSignup) {
          const res = await api.submitOTP({
            otp: OTP,
            payload,
            token,
          });
          if (res.data.status_code === 200 && res.data.status === 'SUCCESS') {
            toast.dismiss();
            const authToken = res?.headers?.['x-auth-token'];
            setLoginToken(authToken);
            toast.success(res.data.message || 'Signup Successfull');
            dispatch(setUserId(res.data.user_id));
            router.replace('/signup-form');
            if (isPhoneValid(value)) {
              dispatch(setIsPhoneVerified(true));
            } else {
              dispatch(setIsEmailVerified(true));
            }
          } else {
            toast.dismiss();
            toast.error(res.data.message || 'Signup Failed');
            setOtp(['', '', '', '']);
          }
        }
      }
    } catch (error) {
      printLog(error);
    }
  };
  function closeModal() {
    setOpenModal(false);
  }

  return (
    <Transition
      show={openModal}
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
          className="fixed inset-y-0 inset-x-0 m-auto min-w-full sm:max-w-sm bg-[#00000084] backdrop-blur-sm z-40"
          onClick={closeModal}
        >
          <div className="flex justify-center p-28">
            {/* <button type="button" onClick={closeModal}>
              <CloseModal />
              <XCircleIcon className='w-6 h-6' />
            </button> */}
          </div>
        </Transition.Child>
        <Transition.Child
          enter="transition ease-in-out duration-300 transform"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
          className="fixed bottom-0 md:bottom-auto md:inset-y-24 inset-x-0 m-auto max-w-full md:max-w-sm min-h-[600px] max-h-[600px] rounded-t-xl md:rounded-xl text-base shadow-lg overflow-auto ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50"
        >
          <div className="flex flex-col justify-start items-start self-stretch flex-grow relative bg-[#202124] min-h-[inherit]">
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0  bg-[#202124] sticky top-0 z-50 p-4 px-6 gap-8">
              <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                <p className="flex-grow-0 flex-shrink-0 text-lg text-center text-white">
                  {/* Confirm your {isPhone ? 'phone' : 'email'} */}
                </p>
                <button type="button" onClick={closeModal}>
                  <CloseModal />
                </button>
              </div>
              <div className="flex flex-col w-full gap-10">
                <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                  <p className="flex-grow-0 flex-shrink-0 text-2xl font-semibold text-center text-white">
                    {otpLabel.heading} {isPhone ? 'phone' : 'email'}
                  </p>
                  <p className="flex-grow-0 flex-shrink-0 text-sm text-center text-white/[0.64]">
                    {otpLabel.message}
                  </p>
                </div>
                <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
                  <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-10">
                    <FormGroup
                      type="text"
                      title="Phone number"
                      value={`${isPhone ? `+91 ${value}` : `${value}`}`}
                      status="disabled"
                    />
                    <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-6 px-10">
                      <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 self-stretch gap-4">
                        {otp.map((_, index) => {
                          return (
                            <input
                              type="tel"
                              name="otp"
                              id="otp"
                              ref={(input) => (inputRefs.current[index] = input)}
                        onClick={() => handleClick(index)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                              // className="formInput text-center"
                              className="block w-full mt-1 px-4 py-2 h-12 bg-[#27292d] border-0 rounded-lg shadow-md 
                        text-base font-medium text-center text-white placeholder-[#ffffff67] placeholder:font-normal 
                        focus:outline-none focus:ring-sky-500 focus:ring-1
                        disabled:text-[#ffffff64] disabled:border-transparent disabled:shadow-none
                        invalid:border-pink-500 invalid:text-pink-600
                        focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                              value={otp[index]}
                              onChange={(e) => handleChange(e, index)}
                              key={index}
                              pattern="\d{1}"
                              autoComplete="off"
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-center items-center self-stretch flex-grow flex-shrink-0 relative gap-6 pt-2">
                        <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#7b8794]">
                          {otpLabel.otp}
                        </p>
                        {timeLeft && timeLeft >= 0 ? (
                          <p className="flex items-center flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#2c6ecb] gap-1">
                            <ArrowPathIcon className="w-4 h-4 text-[#2c6ecb]" />
                            {`Resend in ${
                              timeLeft < 10 ? `0${timeLeft}` : timeLeft
                            } sec`}{' '}
                          </p>
                        ) : (
                          <button
                            onClick={handleResendOtp}
                            disabled={resendLoading ? 'disable' : ''}
                            className="flex items-center flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#2c6ecb] gap-1"
                          >
                            {otpLabel.resend}
                          </button>
                        )}
                      </div>
                    </div>
                    <button
                      className="btn-primary self-stretch w-full m-auto"
                      onClick={ConfirmHandler}
                      disabled={
                        otp.includes('') || confirmLoading ? 'disabled' : ''
                      }
                      style={
                        otp.includes('') ? { backgroundColor: 'grey' } : {}
                      }
                    >
                      {otpLabel.button}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

function FormGroup(prop) {
  return (
    <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2 m-auto w-full">
      <div className="sr-only after:content-['*'] after:ml-0.5 after:text-red-500 flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white/[0.64]">
        {prop.title}
      </div>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
        <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
          <input
            type={prop.type}
            name={prop.type}
            className="formInput w-[90%]"
            placeholder={prop.placeholder}
            value={prop.value}
            disabled={prop.status}
            readOnly
            autoComplete="off"
          />
        </div>
      </div>
    </label>
  );
}
