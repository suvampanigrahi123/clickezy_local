import moment from 'moment';
export const Format12HourTime = (value) => {
  const time = moment(value, 'HH:mm:ss').format('hh:mm A');
  return time;
};
