import { useEffect, useState } from 'react';
import * as api from '../../services/userService';

// import { format } from 'date-fns';
import { TimePicker } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetBookingTime,
  setBookingTimeFrom,
  setError,
} from '../../redux/slices/bookingSlice';
import { toast } from 'react-hot-toast';
import { printLog } from '../../helper/printLog';
import { COMMON } from '../../constants/const';

export default function CustomTimePicker({ studio, date, sendTimeFrom }) {
  const dispatch = useDispatch();
  const selectedDate = moment(date, 'DD-MM-YYYY').format('DD/MM/YYYY');
  const [disabled, setDisabled] = useState(true);
  const [disabledTimeRanges, setDisabledTimeRanges] = useState([]);
  const { numberOfBookingTime, error } = useSelector((state) => state.booking);
  const [time, setTime] = useState(null);
  useEffect(() => {
    setTime(null);
    const fetchTime = async (studio, date1) => {
      try {
        const { data } = await api.checkAvailability(studio, date1);
        setDisabledTimeRanges(data.booking_slot);
      } catch (error) {
        printLog(error);
      }
    };
    if (
      studio &&
      studio.studio_id !== 0 &&
      date &&
      numberOfBookingTime !== ''
    ) {
      setDisabled(false);
      fetchTime(studio, selectedDate);
    } else {
      setDisabled(true);
    }
  }, [studio, selectedDate, numberOfBookingTime]);

  // disabledRangeStart and disabledRangeEnd are the times that you want to disable

  const disabledHours = () => {
    const disabledHoursSet = new Set();
    const currentHour = moment().hour();
    const disabledHours = [];
    disabledTimeRanges.forEach((timeRange) => {
      const { from, to } = timeRange;
      const disabledFrom = moment(from, 'HH:mm').hour();
      const disabledTo = moment(to, 'HH:mm').hour();
      for (let i = disabledFrom; i <= disabledTo + 1; i++) {
        disabledHoursSet.add(i);
      }
    });
    //disable future time
    const today = moment();
    if (today.format('DD/MM/YYYY') === selectedDate) {
      for (let i = 0; i < currentHour + 3; i++) {
        disabledHours.push(i);
      }
    }

    const startTime = moment(COMMON.BOOKING_TIME_RANGE[1], 'hh:mm a'); // 10 PM
    const endTime = moment(COMMON.BOOKING_TIME_RANGE[0], 'hh:mm a').add(
      1,
      'day'
    );
    const timeArray = [];
    while (startTime.isBefore(endTime)) {
      const timeAsInteger = parseInt(startTime.format('HH:mm'));
      timeArray.push(timeAsInteger);
      startTime.add(1, 'hour');
    }
    const disabledHoursSetArray = [
      ...disabledHoursSet,
      ...disabledHours,
      ...timeArray,
      0,
    ];
    var unique = [...new Set(disabledHoursSetArray)];
    return Array.from(unique);
  };

  const disabledMinutes = (selectedHour) => {
    const selectedTime = moment().hour(selectedHour).minute(0);
    let disabledMinutesArray = [];

    disabledTimeRanges.forEach((timeRange) => {
      const { from, to } = timeRange;
      const disabledFrom = moment(from, 'HH:mm');
      const disabledTo = moment(to, 'HH:mm');

      if (selectedTime.isBetween(disabledFrom, disabledTo, null, '[]')) {
        disabledMinutesArray = [0, 15, 30, 45];
      }
    });

    return disabledMinutesArray;
  };
  //   set time

  const handleTimeChange = (time, timeString) => {
    if (time) {
      const t = moment(timeString, 'hh:mm a');
      const selectedTime = moment(t);
      const selectedTimePlus2Hours = selectedTime
        .clone()
        .add(numberOfBookingTime, 'hours');
      const SIXAM = moment(COMMON.BOOKING_TIME_RANGE[0], 'hh:mm a');
      const TENPM = moment(COMMON.BOOKING_TIME_RANGE[1], 'hh:mm a');
      if (t.isBefore(SIXAM) || selectedTimePlus2Hours.isAfter(TENPM)) {
        toast.error('Please select time between 6 AM to 10 PM', {
          position: 'bottom-center',
        });
        setTime(null);
        dispatch(resetBookingTime());
        dispatch(setError('bookingTimeFrom'));
        return;
      }

      // should not take past time from now
      const now = moment();
      if (now.isAfter(t) && now.format('DD/MM/YYYY') === selectedDate) {
        toast.error('Please select future time', {
          position: 'bottom-center',
        });
        setTime(null);
        dispatch(resetBookingTime());
        dispatch(setError('bookingTimeFrom'));
        return;
      }

      setTime(time);
      const formattedTime = moment(timeString, 'hh:mm a').format('HH:mm');
      dispatch(setBookingTimeFrom(formattedTime));
      if (numberOfBookingTime !== '') {
        sendTimeFrom(formattedTime);
      }
      if (timeString === '') {
        dispatch(setError('bookingTimeFrom'));
      } else {
        dispatch(setError(null));
      }
    }
  };
  const checkDisabled = () => {
    if (disabled) {
      toast.error('Please select all fields', {
        position: 'bottom-center',
        id: 'timepicker',
      });
      return;
    }
  };
  return (
    <TimePicker
      disabledTime={() => ({
        disabledHours: disabledHours,
        disabledMinutes: disabledMinutes,
      })}
      format="hh:mm a"
      className={`formInput text-gray-200 w-full ${
        error === 'bookingTimeFrom'
          ? 'border-red-500 border-2 border-solid'
          : ''
      }}`}
      onChange={handleTimeChange}
      onClick={checkDisabled}
      allowClear={false}
      style={{
        background: '#27292d',
      }}
      value={time}
      use12Hours={true}
      inputReadOnly={true}
      disabled={disabled}
      minuteStep={5}
      showNow={false}
      id="timepicker"
      
      // onSelect={handleTimeChange}
    />
  );
}
