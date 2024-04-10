import moment from 'moment';
import { useEffect, useId, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSWR from 'swr';
import * as api from '../../../services/userService';
import Select from 'react-select';
import { DatePicker } from 'antd';
import {
  resetBookingTime,
  setBookingDate,
  setBookingTime,
  setBookingTimeTo,
  setError,
  setNumberOfBookingTime,
} from '../../../redux/slices/bookingSlice';
import CustomTimePicker from '../../form-element/TimePicker';
import { toast } from 'react-hot-toast';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
const timelist = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'day', label: 'Day' },
];
export const BookingDateTime = (prop) => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.booking.error);
  const { numberOfBookingTime, studio, bookingTimeFrom } = useSelector(
    (state) => state.booking
  );
  const [selected, setSelected] = useState(timelist[0]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isHalfHourPriceEnabled, setIsHalfHourPriceEnabled] = useState(false);
  const [duration, setDuration] = useState('00:00');
  const [toTime, setToTime] = useState('');
  const isDuationMounted = useRef(null);
  const [brakeDays, setBrakeDays] = useState({
    fromDays: '',
    toDays: '',
    studioId: null,
  });

  // console.log(brakeDays);

  const { data: dates } = useSWR(
    brakeDays?.studioId && ['/photographs/happy-hours', brakeDays?.studioId],
    () => api.getPhotographerBreakDays(brakeDays)
  );

  const disDate = dates && dates?.day_offs;

  /**
   * Set Default duration as per studio price details
   */
  useEffect(() => {
    if (studio && studio.details && studio?.details[0]?.price_details) {
      const isHalf = studio?.details[0]?.price_details?.is_half_hour_shoot;
      setIsHalfHourPriceEnabled(isHalf);
      setDuration(isHalf === 0 ? '01:00' : '00:30');
    }
    dispatch(setBookingTime('hourly'));
    setSelected(timelist[0]);

    // set brake days
    const today = moment();
    const endDate = moment().add(30, 'days');
    setBrakeDays({
      fromDays: today.format('DD/MM/YYYY'),
      toDays: endDate.format('DD/MM/YYYY'),
      studioId: studio?.studio_id,
    });
  }, [studio]);
  /**
   * Set Default duration when time slot is changed
   *  @param {*} e
   */
  useEffect(() => {
    dispatch(setBookingTime(selected.value));
  }, [selected.value]);

  /**
   * Custom style  for react select
   */
  const customStyles = {
    option: (provided) => ({
      ...provided,
      color: 'black',
    }),
    control: (provided) => ({
      ...provided,
      color: 'black',
      backgroundColor: '#27292d',
      borderWidth: '2px',
      borderColor: error === 'bookingTime' ? '#f87171' : '#27292d',
      height: '2.8rem !important',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff',
      heigh: '2.8rem',
    }),
  };

  /**
   *  handle duration change[hourly,day]
   * @param {*} e
   */
  const onChangeBookingTime = (e) => {
    setSelected(e);
    dispatch(setBookingTime(e.value));
    if (e.value === 'day') {
      dispatch(setNumberOfBookingTime('08:00'));
      setDuration('08:00');
    } else {
      toast.success('Booking mode changed to Hourly', {
        position: 'bottom-center',
        duration: 3000,
        id: 'booking-mode-change-duration-hour',
      });
      dispatch(setNumberOfBookingTime('00:00'));
      setDuration('01:00');
    }
  };

  /**
   * Duration of booking
   * reset booking time
   * reset to time
   * @param {*} e
   */
  useEffect(() => {
    setDuration(duration);
    dispatch(setNumberOfBookingTime(duration));

    if (parseInt(duration) === parseInt('08:00')) {
      toast.success('Booking mode changed to day', {
        position: 'bottom-center',
        duration: 3000,
        id: 'booking-mode-change-duration-day',
      });
      setSelected(timelist[1]);
      return;
    }
    dispatch(setError(null));
  }, [duration]);

  useEffect(() => {
    dispatch(resetBookingTime(''));
    setToTime('');
  }, [selectedDate]);

  /**
   *
   * @returns increase and decrease time
   */
  const increaseTime = () => {
    if (isHalfHourPriceEnabled && duration === '00:30') {
      setDuration((prevTime) => addMinutes(prevTime, 30));
      return;
    }
    setDuration((prevTime) => addMinutes(prevTime, 60));
    setToTime('');
  };
  const decreaseTime = () => {
    if (!isHalfHourPriceEnabled && duration === '01:00') {
      toast.error('Half hour booking is not allowed for this studio', {
        position: 'bottom-center',
        id: 'decreaseTime',
      });
      return;
    }
    if (isHalfHourPriceEnabled && duration === '00:30') {
      toast.error('Time cannot be set to 00:00', {
        position: 'bottom-center',
        id: 'cannot-set-half-hour-price',
      });
      return;
    }
    if (isHalfHourPriceEnabled && duration === '01:00') {
      setDuration((prevTime) => subtractMinutes(prevTime, 30));
      return;
    }
    setDuration((prevTime) => subtractMinutes(prevTime, 60));
    setToTime('');
  };

  const addMinutes = (time, minutes) => {
    const timeParts = time.split(':');
    const hours = parseInt(timeParts[0]);
    const mins = parseInt(timeParts[1]);

    let totalMinutes = hours * 60 + mins;
    totalMinutes += minutes;

    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;

    return pad(newHours, 2) + ':' + pad(newMins, 2);
  };

  const subtractMinutes = (time, minutes) => {
    const timeParts = time.split(':');
    const hours = parseInt(timeParts[0]);
    const mins = parseInt(timeParts[1]);

    let totalMinutes = hours * 60 + mins;
    totalMinutes -= minutes;

    if (totalMinutes < 0) {
      totalMinutes = 0;
    }

    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;

    return pad(newHours, 2) + ':' + pad(newMins, 2);
  };

  const pad = (num, size) => {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  };

  /**
   * Booking date
   * @param {*} date
   */
  const handleBookingDate = (date) => {
    const dateFrom = moment(date?.$d).format('DD-MM-YYYY');
    setSelectedDate(dateFrom);
    dispatch(setBookingDate(dateFrom));
    if (date === '') {
      dispatch(setError('bookingDate'));
    } else {
      dispatch(setError(null));
    }
  };

  /**
   *
   * @description pass time to TimePicker component
   */
  const sendTimeFrom = (time) => {
    if (numberOfBookingTime !== '') {
      setTimeTo(time);
    }
  };
  /**
   * @description reset from time
   * */
  useEffect(() => {
    if (bookingTimeFrom === '') {
      setToTime('');
    }
  }, [bookingTimeFrom]);

  const setTimeTo = (time) => {
    const timeFrom = moment(time, 'HH:mm');
    const timeTo = timeFrom.add(numberOfBookingTime, 'hours');
    const format24hours = moment(timeTo).format('HH:mm');
    const format12hours = moment(timeTo).format('hh:mm a');
    dispatch(setBookingTimeTo(format24hours));
    setToTime(format12hours);
  };

  const disabledDate = (current) => {
    if (current && current < Date.now()) {
      return current && current.isBefore(moment().subtract(1, 'day'));
    }
    return disDate?.includes(current.format('DD/MM/YYYY'));
  };

  return (
    <>
      <label className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white/[0.64]">
          {prop.title}
        </span>

        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
          <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
            {/*Booing Type  */}
            <div className="w-1/2 ">
              <Select
                options={timelist}
                onChange={onChangeBookingTime}
                isSearchable={false}
                value={selected}
                styles={customStyles}
                instanceId={useId()}
              />
            </div>
            {/* Booking Duration */}
            <div className="w-1/2">
              <div className="flex rounded-md shadow-sm relative" role="group">
                <button
                  type="button"
                  className={`px-4 pb-2 text-lg font-medium text-gray-200 rounded-l-lg absolute left-0 top-0 h-full ${
                    selected.value !== 'day' ? 'text-gray-200' : 'text-gray-500'
                  }`}
                  onClick={decreaseTime}
                  disabled={selected.value === 'day'}
                >
                  <MinusOutlined />
                </button>
                <input
                  type="text"
                  name="numberOfDH"
                  className={`formInput w-full text-gray-200 text-center ${
                    error === 'numberOfBookingTime'
                      ? 'border-red-500 border-2 border-solid'
                      : ''
                  }}`}
                  ref={isDuationMounted}
                  placeholder="00:00"
                  value={duration}
                  disabled={selected.value === 'day'}
                  readOnly
                />
                <button
                  type="button"
                  className={`px-4 pb-2 text-lg font-medium  rounded-l-lg absolute right-0 top-0 h-full ${
                    selected.value !== 'day' ? 'text-gray-200' : 'text-gray-500'
                  }`}
                  onClick={increaseTime} // increaseTime function
                  disabled={selected.value === 'day'}
                >
                  <PlusOutlined />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0">
            <div className="customDatePickerWidth">
              <DatePicker
                className={`formInput focus:bg-[#27292d] w-full text-gray-200 ${
                  error === 'bookingDate'
                    ? 'border-red-500 border-2 border-solid'
                    : ''
                }`}
                disabledDate={disabledDate}
                format="DD-MM-YYYY"
                onChange={handleBookingDate}
                allowClear={false}
                inputReadOnly={true}
                showToday={false}
                popupClassName="popup-datepicker"
              />
            </div>
          </div>

          <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
            <div className="w-1/2">
              <CustomTimePicker
                studio={studio.studio_id}
                date={selectedDate}
                sendTimeFrom={sendTimeFrom}
              />
            </div>
            <div className="w-1/2">
              <input
                type="text"
                name="timeTo"
                className={`formInput date text-gray-200 w-full ${
                  error === 'bookingTimeTo'
                    ? 'border-red-500 border-2 border-solid'
                    : ''
                }}`}
                placeholder="00:00"
                value={toTime}
                disabled
              />
            </div>
          </div>
        </div>
      </label>
    </>
  );
};
