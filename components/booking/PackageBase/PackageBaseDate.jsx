import moment from 'moment';
import { useEffect, useId, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from 'antd';
import { setError } from '../../../redux/slices/PackageSlice';
import { setPackageDate } from '../../../redux/slices/PackageSlice';
const timelist = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'day', label: 'Day' },
];
export const PackageBookingDate = (prop) => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.booking.error);
  const { studio } = useSelector((state) => state.package);
  const [selectedDate, setSelectedDate] = useState(null);
  const [brakeDays, setBrakeDays] = useState({
    fromDays: '',
    toDays: '',
    studioId: null,
  });

  useEffect(() => {
    const today = moment();
    const endDate = moment().add(30, 'days');
    setBrakeDays({
      fromDays: today.format('DD/MM/YYYY'),
      toDays: endDate.format('DD/MM/YYYY'),
      studioId: studio?.studio_id,
    });
  }, [studio]);

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
   * package date
   * @param {*} date
   */
  const handleBookingDate = (date) => {
    const dateFrom = moment(date?.$d).format('DD-MM-YYYY');
    setSelectedDate(dateFrom);
    dispatch(setPackageDate(dateFrom));
    if (date === '') {
      dispatch(setError('bookingDate'));
    } else {
      dispatch(setError(null));
    }
  };

  const disabledDate = (current) => {
    if (current && current < Date.now()) {
      return current && current.isBefore(moment().subtract(1, 'day'));
    }
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
        </div>
      </label>
    </>
  );
};
