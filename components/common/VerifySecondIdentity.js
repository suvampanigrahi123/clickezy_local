import { Dialog, Transition } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIsEmailVerified,
  setIsPhoneVerified,
  setShowVerificationModal,
} from '../../redux/slices/signupSlice';
import LeftRotation from './icons/leftrotation';
import CloseModal from './icons/CloseModal';
import * as api from '../../services/userService';
import { toast } from 'react-hot-toast';
import { COMMON } from '../../constants/const';
import { printLog } from '../../helper/printLog';
import { getLocalStorage } from '../../utils/localStore';

export const VerifySecondIdentiy = ({ value, type }) => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs=useRef([])
  const { showVerificationModal, user_id } = useSelector(
    (state) => state.signup
  );
  const [timeleft, setTimeLeft] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      if (timeleft >= 0) {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timeleft]);

  useEffect(() => {
    if (showVerificationModal) {
      setTimeLeft(60);
    }
  }, [showVerificationModal]);

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

  const handleresend = async () => {
    let payload = {};
    if (type === 'phone') {
      payload = { phone: value };
    } else {
      payload = { email: value };
    }
    try {
      setResendLoading(true);
      const { data } = await api.signUpOtpGenerate(payload);
      if (data && data.status_code === 200) {
        setResendLoading(false);
        toast.success(data.message);
        setTimeLeft(60);
      } else {
        setResendLoading(false);
        toast.error(data.message);
        setOtp(['', '', '', '']);
      }
    } catch (error) {
      setResendLoading(false);
      printLog(error);
    }
  };
  const ConfirmHandler = async () => {
    const OTP = otp.join('');
    if (OTP.length < 4) {
      const otpArr = document.querySelectorAll('#otp');
      otpArr.forEach((element) => {
        if (!element.value) {
          element.style.border = '1px solid red';
        }
      });
    } else {
      let payload = { user_id };
      if (type === 'phone') {
        payload = { ...payload, phone: value };
      } else {
        payload = { ...payload, email: value };
      }
      try {
        setConfirmLoading(true);
        const token = getLocalStorage(COMMON.FIREBASE_TOKEN)
          ? getLocalStorage(COMMON.FIREBASE_TOKEN)
          : 'token';
        const { data } = await api.submitOTP({
          otp: OTP,
          payload,
          token,
        });
        if (data.status === 'SUCCESS') {
          setConfirmLoading(false);
          toast.success(COMMON.OTP_VERIFIED);
          if (type === 'phone') {
            dispatch(setIsPhoneVerified(true));
          } else {
            dispatch(setIsEmailVerified(true));
          }
          dispatch(setShowVerificationModal(false));
        } else {
          setConfirmLoading(false);
          toast.error(data.message || COMMON.LOGIN_FAILED);
          setOtp(['', '', '', '']);
        }
      } catch (error) {
        setConfirmLoading(false);
      }
    }
  };
  return (
    <Transition
      show={showVerificationModal}
      className="fixed inset-y-0 max-w-sm min-h-screen mx-auto z-50"
    >
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => dispatch(setShowVerificationModal(false))}
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
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0  bg-[#202124] sticky top-0 z-50 p-4 gap-[5rem]">
              <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                <p className="flex-grow-0 flex-shrink-0 text-lg text-center text-white">
                  Confirm your {type === 'phone' ? 'phone' : 'email'}
                </p>
                <button
                  type="button"
                  onClick={() => dispatch(setShowVerificationModal(false))}
                >
                  <CloseModal />
                </button>
              </div>
              <div className="flex flex-col w-full gap-[0.7rem]">
                <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
                  <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-10">
                    <FormGroup
                      type="text"
                      title="Phone number"
                      value={`${
                        type === 'phone' ? `+91 ${value}` : `${value}`
                      }`}
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
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-6 pt-2">
                        <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#7b8794]">
                          Didn&apos;t receive OTP ?
                        </p>
                        <button className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1">
                          <LeftRotation />
                          <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#2c6ecb]">
                            {timeleft && timeleft >= 0 ? (
                              <span>
                                {`resend in ${
                                  timeleft < 10 ? `0${timeleft}` : timeleft
                                } sec`}{' '}
                              </span>
                            ) : (
                              <button
                                onClick={handleresend}
                                disabled={resendLoading ? 'disable' : ''}
                              >
                                resend
                              </button>
                            )}
                          </p>
                        </button>
                      </div>
                    </div>
                    <button
                      className="btn-primary self-stretch w-[90%] m-auto"
                      onClick={ConfirmHandler}
                      disabled={
                        otp.includes('') || confirmLoading ? 'disabled' : ''
                      }
                      style={
                        otp.includes('') ? { backgroundColor: 'grey' } : {}
                      }
                    >
                      Confirm
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
    <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2 w-[93%] m-auto">
      <span className="sr-only after:content-['*'] after:ml-0.5 after:text-red-500 flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white/[0.64]">
        {prop.title}
      </span>
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
