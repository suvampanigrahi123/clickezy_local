const CONST = {
  TYPE_WRITER: [
    'Anniversary',
    'Automotive',
    'Baby',
    'Birthday',
    'Engagement',
    'Weeding',
    'Travel',
    'Food',
  ],
  APP_NAME: 'Wedding App',
  CATEGORY: 'Category',
  RES_SUCCESS: 'success',
  LOGIN_SUCCESS: 'Login Successfull',
  LOGIN_FAILED: 'Login Failed',
  SIGNUP_SUCCESS: 'Signup Successfull',
  SIGNUP_FAILED: 'Signup Failed',
  OTP_SENT: 'OTP Sent',
  OTP_VERIFIED: 'OTP Verified',
  OTP_FAILED: 'OTP Failed',
  OTP_RESEND: 'OTP Resend',
  OTP_RESEND_FAILED: 'OTP Resend Failed',
  USER_KEY: 'USER_KEY',
  UNAUTHORIZED: 'You are not authorized to like this post',
  LOCATION_KEY: 'location',
  FIREBASE_TOKEN: 'firebase_token',
  AUTH_TOKEN: 'auth_token',
  BOOKING_TIME_RANGE: ['06:00 AM', '10:00 PM'],
  USER: 'user',
  MOBILE_WINDOW: 768,
  RUPEE_SYMBOL: '₹',
  STAR_RATING_KEYWORD: {
    1: ['terrible', 'awful', 'poor quality', 'disappointing', 'bad experience'],
    2: [
      'below average',
      'not satisfied',
      'mediocre',
      'lacking',
      'needs improvement',
    ],
    3: ['average', 'okay', 'satisfactory', 'acceptable', 'neutral'],
    4: ['good', 'great', 'impressive', 'high quality', 'satisfied'],
    5: [
      'excellent',
      'outstanding',
      'superb',
      'top-notch',
      'highly recommended',
    ],
  },


  REFER_CASE1: {
    INVITED_USER: 5,
    BOOKING: 3
  },
  REFER_CASE2: {
    INVITED_USER: 12,
    BOOKING: 0
  }

};

export const COMMON = Object.freeze(CONST);
