import moment from 'moment';

export const getDuration = (targetDateTime) => {
  const now = moment();
  const target = moment(targetDateTime);
  const diff = target.diff(now);
  if (diff > 0) {
    const duration = moment.duration(diff);
    const days = Math.floor(duration.asDays());

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} left`;
    }
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    return `${hours}:${minutes}:${seconds}`;
  }
  return 'Expired';
};

export const getBookingDuration = (booking_date, to_time, from_time) => {
  booking_date = `${booking_date?.split('/')[2]}-${
    booking_date?.split('/')[1]
  }-${booking_date?.split('/')[0]}`;
  var then = moment(`${booking_date} ${to_time}`, 'YYYY-MM-DD HH:mm:ss');
  var now = moment(`${booking_date} ${from_time}`, 'YYYY-MM-DD HH:mm:ss');
  const timeLeft = moment
    .utc(moment.duration(moment(then).diff(moment(now))).asMilliseconds())
    .format('HH:mm');
  return `${timeLeft.split(':')[0]} hr ${timeLeft.split(':')[1]} min`;
};

export function getDifference(date, time) {
  date = `${date?.split('/')[2]}-${date?.split('/')[1]}-${date?.split('/')[0]}`;
  const then = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm:ss');
  const now = moment(new Date(), 'YYYY-MM-DD HH:ss:ss');

  const duration = moment.duration(then.diff(now));

  const day = parseInt(duration.asDays());
  const timeLeft = moment
    .utc(moment.duration(moment(then).diff(moment(now))).asMilliseconds())
    .format('HH:mm:ss');
  const hour = timeLeft.split(':')[0];
  const minute = timeLeft.split(':')[1];
  const second = timeLeft.split(':')[2];
  if (duration._milliseconds < 0) {
    return {
      day,
      hour,
      minute,
      second,
      timeLeft: 0,
      milliseconds: duration._milliseconds,
    };
  }
  return {
    day,
    hour,
    minute,
    second,
    timeLeft,
    milliseconds: duration._milliseconds,
  };
}

//get the Decline time Difference  :Fix Me :- This Function is only made for 30min count down if u want to change the ist line and give minute in miliseconds
export function getDeclineTimeRemaing(booking_date, time) {
  const difftime = moment(`${booking_date} ${time}`)
    .add(1800000, 'ms')
    .format('YYYY-MM-DD HH:mm:ss');
  const startDate = moment(moment().format('YYYY-MM-DD HH:mm:ss'));
  const endDate = moment(`${difftime}`);

  // Get the difference in milliseconds
  const milisecond = endDate.diff(startDate);

  // Get the difference in seconds
  const second = endDate.diff(startDate, 'second');

  // Get the difference in minutes
  const minute = endDate.diff(startDate, 'minutes');
  let timeLeft = '';
  if (minute > 0) {
    timeLeft = `${minute?.toString().padStart(2, '0')}m:${(second % 60)
      ?.toString()
      .padStart(2, '0')}sec`;
  } else {
    timeLeft = `${(second % 60)?.toString().padStart(2, '0')}sec`;
  }
  return { milisecond, timeLeft, minute };
}
