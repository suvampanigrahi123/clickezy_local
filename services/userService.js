import axios from '../config/axiosInstance';
import { COMMON } from '../constants/const';
import { printLog } from '../helper/printLog';
import { getLocalStorage } from '../utils/localStore';

// ***********************************************************************************************************************
//?                                       Home Page Services
// ***********************************************************************************************************************

//? @url: /home
// Info: Get all the photographs list
//@method: GET
export const getCategoryList = async (id) => {
  const query = id ? `?location_id=${id}` : '?location_id=12';
  try {
    // const token = getToken();
    const { data } = await axios.get(
      `/photographs/category-available-for-location${query}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {
    printLog(error);
  }
};

//? @url: /home
// Info: Get all the place list
//@method: GET

export const getPhotographs_Place_List = async (payload) => {
  const query = payload ? `?location_id=${payload}` : '';
  try {
    // const token = getToken();
    const { data } = await axios.get(`/photographs/place-list${query}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

export const getAllPlaces = async () => {
  try {
    // const token = getToken();
    const { data } = await axios.get('/photographs/locations', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data?.data;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

//? @url: /home
// Info: Get all the studio list
//@method: GET
export const getStudioList = async (id) => {
  const query = id ? `location_id=${id}&page=0&size=20` : '';
  try {
    // const token = getToken();
    const { data } = await axios.get(`/photographs/studios?${query}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

//? @url: /studio/studio-details
// Info: Get all the studio list
//@method: GET
export const get_studio_details_ = async (cat, stu, id, user, index) => {
  const userId = user ? `&user_id=${user}` : '';
  try {
    // const token = getToken();

    const { data } = await axios.get(
      `photographs/studio-category-images?category_id=${cat}&studio_id=${stu}${userId}&page=${0}&size=${(index + 1) * 9
      }`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {
    toast.error(error.response.data.message);
    // printLog(error);
  }
};

// ***********************************************************************************************************************
//?                                         Photograph Filter By ID
// ***********************************************************************************************************************

//? @url: /photography/category/{ID}
// Info: Get photographs By ID
//@method: GET
export const getPhotoList_byId = async (catId, location_id, index, user) => {
  try {
    const userId = user ? `&user_id=${user}` : '';
    const { data } = await axios.get(
      `/photographs/places-view-all?location_id=${location_id || 1
      }${userId}&category_id=${catId}&min_price=0&page=${index}&size=500`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

//? @url: /photography/places/{ID}
// Info: Get photographs By ID
//@method: GET
export const get_Place_List_By_ID = async (locationId, user, page = 0) => {
  const userId = user ? `&user_id=${user}` : '';
  try {
    // const token = getToken();
    const { data } = await axios.get(
      `/photographs/places-view-all?location_id=${locationId}${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

// ***********************************************************************************************************************
//?                                        Search Services
// ***********************************************************************************************************************

//? @url: /search
//@Info: Get the studio list by search keyword
//@method: GET
export const getSearchResult = async (payload) => {
  try {
    const place = payload?.location
      ? `location_id=${payload?.location}`
      : 'not selected';
    const equip = payload?.equipment
      ? `&equipment_id=${payload?.equipment}`
      : '';
    const cat = payload?.category ? `&category_id=${payload?.category}` : '';
    const amount = payload?.price ? `&keyword=${payload?.price}` : '';
    const minPrice = payload?.minPrice ? `&min_price=${payload?.minPrice}` : '';
    const maxPrice = payload?.maxPrice ? `&max_price=${payload?.maxPrice}` : '';
    // const token = getToken();
    const search = '.*' + payload?.search?.split(' ').join('.*') + '.*';
    const { data } = await axios.get(
      `/photographs/global-search-photographer?${place}${cat}${equip}${amount}${minPrice}${maxPrice}&search=${search}&page=${payload.page}&size=20`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

export const getEquipments = async () => {
  try {
    // const token = getToken();
    const { data } = await axios.get('/photographs/equipments', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

// Get search result when user search by keyword
export const getSearchResultByKeyword = async (location, keyword) => {
  try {
    let query = '';
    if (location && keyword) {
      query = `location_id=${location}&search=${keyword}`;
    } else if (!location) {
      query = `search=${keyword}`;
    }
    const { data } = await axios.get(
      `/photographs/global-search-photographer?${query}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

// ***********************************************************************************************************************
//?                                         Booking Services
//!                                         Pass the token in header
// ***********************************************************************************************************************

/**
 * @url /booking/save
 * @returns Booking Details
 */
export const saveBooking = async (payload) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.post('/booking/save', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    return data;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

// ***********************************************************************************************************************
//?                                         Package services
//!                                         Pass the token in header
// ***********************************************************************************************************************


//? @url: /package
// Info: Get all the photographs list
//@method: GET
export const GetPackageCategoryList = async (id) => {
  const query = id ? `?location_id=${id}` : '?location_id=12';
  try {
    // const token = getToken();
    const { data } = await axios.get(
      `package-base-categories${query}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {
    printLog(error);
  }
};
/**
 * @url /package/save
 * @returns package detaills
 */
export const savePackage=async(payload)=>{
  try {
    const AUTH_TOKEN= getLocalStorage(COMMON.AUTH_TOKEN);
    const {data}= await axios.post('/save-package-booking', payload,{
      headers:{
        'Content-type' :'multipart/form-data',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      }
    });
    return data ;
  } catch (error) {
    printLog(error)
  }
}
/**
 * @url /package-base-locations
 * @returns package location id 
 */
export const getPackageStudioById = async (payload) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);

    let url = `/get-packages?location_id=${payload?.locationId}&page=0&page_size=50000`;
    if (payload && payload.categoryId) {
      url = url + `&category_id=${payload.categoryId}`;
    }
    url = url + '&size=1000&page=0';

    const { data } = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    return { data };
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

//? @url: /home
// Info: Get all the photographs list
//@method: GET
export const getPackageBaseCategoryList = async (id) => {
  const query = id ? `?location_id=${id}` : '?location_id=12';
  try {
    // const token = getToken();
    const { data } = await axios.get(
      `/package-base-categories${query}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {
    printLog(error);
  }
};

export const getPackageAllPlaces = async () => {
  try {
    // const token = getToken();
    const { data } = await axios.get('/package-base-locations', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data?.location_list;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

/**
 * @url /user/my_booking
 * @returns User Booking Details
 */
export const getUserPackageList = async (
  id
) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN, false);
    const { data } = await axios.get(
      `/get-package-booking?user_id=${id}&page=0&size=50`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return data;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

/**
 * @url /user/package details page
 * @returns User package Details
 */
export const getUserPackageBookingDetailsByID = async (id) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN, false);
    const { data } = await axios.get(
      `/get-package-booking-details?package_booking_id=${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return data?.data?.package_booking_details;
  } catch (error) {
    printLog(error);
  }
};


/**
 * @url /package-base-locations
 * @returns package location id 
 */
export const getHomePackageStudioList = async (payload,cat_id) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
console.log(payload);
    let url = `/get-packages?location_id=${payload}&page=0&page_size=50000`;
    if(cat_id){
      url=`${url}&category_id=${cat_id}`
    }
    const { data } = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    return { data };
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};




export const getPackageCategoryListsPagination = async (location, index) => {
  try {
    // const token = getToken();
    const { data } = await axios.get(
      `/package-base-categories?location_id=${location}&page=${index}&size=5`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {

    printLog(error);
  }
};

//? @url: /home
// Info: Get all the photographs list
//@method: GET
export const getAllPackageCategoryList = async (id) => {
  const query = id ? `?location_id=${id}` : '?location_id=12';
  try {
    // const token = getToken();
    const { data } = await axios.get(
      `/package-base-categories${query}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {
    printLog(error);
  }
};

/**
 * @url /package-base-locations
 * @returns package location id 
 */

/**
 * @url /check available
 * @returns Booking Details
 */
export const checkAvailability = async (studio_id, date) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.get(
      `/booking/booking-availability?studio_id=${studio_id}&booking_date=${date}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return data;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

/**
 *
 * @param {*} location
 * @returns photoshoot location
 */
export const getNearByLocation = async (location) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.get(
      `/photographs/photoshoot-location?location_id=${location}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return data;
  } catch (error) {
    printLog(error);
  }
};
/**
 *
 * @param {*} location
 * @returns no of photo will be taken
 */
export const getPhotosWillTake = async (catId, duration) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.post(
      `/photographs/no_of_photos?category_id=${catId}&duration=${duration}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return data;
  } catch (error) {
    printLog(error);
  }
};

/**
 *
 * @param {*} LId
 * @param {*} Sid
 * @returns
 */
export const getStudioDetails = async (LId, Sid) => {
  try {
    // const token = getToken();
    const { data } = await axios.get(
      `/photographs/studio-details?location_id=${LId}&studio_id=${Sid}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};
export const getStudioReviews = async (Sid, page, page_size) => {
  try {
    const { data } = await axios.get(
      `/reviews?page=${page}&page_size=${page_size}&studio_id=${Sid}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data?.data;
  } catch (error) {
    printLog(error);
  }
};

export const getStudioById = async (payload) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);

    let url = `/photographs/studios-for-booking?location_id=${payload.locationId}`;
    if (payload && payload.categoryId) {
      url = url + `&category_id=${payload.categoryId}`;
    }
    url = url + '&size=1000&page=0';

    const { data } = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    return { data };
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

export const getDefaultEquipments = async (payload) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.get(
      `/get_default_equipments?studio_id=${payload.studio_id}&category_id=${payload.cat_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return { data };
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

export const getPhotographerBreakDays = async (payload) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.get(
      `/photographs/happy-hours?studio_id=${payload.studioId}&from_date=${payload.fromDays}&to_date=${payload.toDays}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return data?.data;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

export const getFolderList = async (studio_id) => {
  try {
    // const token = getToken();
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.get(`/get-folders?studio_id=${studio_id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    return data?.folders;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

// ***********************************************************************************************************************
//?                                         User Services
// ***********************************************************************************************************************
/**
 * @returns generate OTP
 */
export const signInOtpGenerate = async (payload) => {
  try {
    // const token = getToken();
    const { data } = await axios.post('/user/generate/sign-in/otp', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return { data };
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};
/**
 * @returns generate OTP
 */
export const signUpOtpGenerate = async (payload) => {
  try {
    // const token = getToken();
    const { data } = await axios.post('/user/generate/sign-up/otp', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return { data };
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

/**
 * @returns submit OTP
 */
export const submitOTP = async ({ payload, otp, token }) => {
  try {
    // const token = getToken();
    const config = {
      headers: { 'Content-Type': 'application/json', 'X-TOKEN': token },
    };
    const response = await axios.post(
      '/user/signup',
      {
        ...payload,
        otp,
      },
      config
    );
    return response;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

/**
 * @returns save signup Form
 */
export const signIn = async ({ payload, otp, token }) => {
  try {
    // const token = getToken();
    const config = {
      headers: { 'Content-Type': 'application/json', 'X-TOKEN': token },
    };
    const response = await axios.post(
      '/user/signin',
      {
        ...payload,
        otp,
      },
      config
    );
    return response;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

export const googleLogin = async (payload) => {
  try {
    // const token = getToken();
    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${payload.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${payload.access_token}`,
          Accept: 'application/json',
        },
      }
    );
    return { data };
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

// *********************************************************************
//                    user Token Services
// **********************************************************************
/**
 * @returns save signup Form
 */
export const saveSignForm = async (payload) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const response = await axios.post('/user/save', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    return response;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

/**
 * @returns save signup Form
 */
export const saveHeart = async (payload) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.post('/save_is_heart', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    return data;
  } catch (error) {
    printLog(error, 'custom');
  }
};

/**
 * @url /user
 * @returns User Details
 */
export const getUserProfileDetails = async (payload) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.get(
      `/user/get_user_details?user_id=${payload}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return data;
  } catch (err) {
    // toast.error(error.response.data.message);
    printLog(err);
  }
};

/**
 * @url /user/my_booking
 * @returns User Booking Details
 */
export const getUserBookingDetails = async (
  id,
  type = '',
  duration = '',
  index,
  size
) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN, false);
    const { data } = await axios.get(
      `/booking/get_user_bookings?user_id=${id}&type=${type}&duration=${duration}&page=${index}&size=${size}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return data;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

export const getUserBookingDetailsByID = async (id) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN, false);
    const { data } = await axios.get(
      `/booking/get_booking_details?booking_id=${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return data;
  } catch (error) {
    printLog(error);
  }
};

/**
 *
 * @param {*} payload
 * @returns
 */
export const uploadProfilePicture = async (id, image) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN, false);
    const { data } = await axios.post(
      `/user/upload_user_profile?user_id=${id}`,
      image,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          type: 'formData',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return { data };
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

/**
 * @returns save signup Form
 */
export const editProfile = async (payload) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN, false);
    const response = await axios.post('/user/save', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    return response;
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

export const sendViewCount = async (payload) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.post(
      'image_view_count',
      { ...payload },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return data;
  } catch (error) {
    printLog(error);
  }
};

/**
 *
 * @param {*} LId
 * @param {*} Sid
 * @returns
 */
export const setStudioViewCount = async (payload) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.post(
      '/studio_view_count',
      { ...payload },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return data;
  } catch (error) {
    printLog(error);
  }
};

//Send ReTouch Request for a Image

export const sendRetouchRequest = async (payload) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { image_id, booking_id, message } = payload;
    const { data } = await axios.put(
      `/booking/retouch-image?booking_id=${booking_id}&image_id=${image_id}&message=${message}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return data;
  } catch (error) {
    printLog(error);
  }
};

//Accept a Booking
export const acceptBooking = async (booking_id) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.put(
      `/booking/accept?booking_id=${booking_id}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return data;
  } catch (error) {
    printLog(error);
  }
};

//get CancelReasons
export const getCancelReasons = async () => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.get('/booking/cancel-reasons', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    return data.data;
  } catch (error) {
    printLog(error);
  }
};

//cancel a booking
export const cancelBooking = async (payload) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { booking_id, reason } = payload;
    const { data } = await axios.put(
      `/booking/cancel-booking?booking_id=${booking_id}&reason=${reason}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return data;
  } catch (error) {
    printLog(error);
  }
};

//Submit Survey Details
export const submitSurveyDetails = async (
  booking_id,
  age,
  name,
  additional_info,
  gender
) => {
  try {
    const fd = new FormData();
    fd.append('age', age);
    fd.append('additional_info', additional_info);
    fd.append('booking_id', booking_id);
    fd.append('gender', gender);
    fd.append('name', name);
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.post('/save-booking-details', fd, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        type: 'formData',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    return data;
  } catch (error) {
    // printLog(error);
  }
};
//Update Image status
export const updateImageStatus = async (image_id, status) => {
  try {
    const fd = new FormData();
    fd.append('image_id', image_id);
    fd.append('status', status);
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.post('/booking/update-image-status', fd, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        type: 'formData',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    return data;
  } catch (error) {
    // printLog(error);
  }
};

/*Submit Review */
export const submitReview = async (payload) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { studio_id, user_id, rating, booking_id, message } = payload;
    const { data } = await axios.post(
      `/photographs/rating/save?studio_id=${studio_id}&user_id=${user_id}&rating=${rating}&booking_id=${booking_id}&message=${message}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return data;
  } catch (error) {
    printLog(error);
  }
};

//user-->Notifications--->get all notifications
export const getUserNotifications = async (user_id) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN, false);
    const { data } = await axios.get(
      `/user/get/user-notification?user_id=${user_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return data;
  } catch (err) {
    printLog(err);
  }
};

export const changeStatusofNotification = async (
  notification_id,
  is_seen,
  is_active
) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.put(
      `/user/touch/user-notification?notification_id=${notification_id}&is_active=${is_active}&is_seen=${is_seen}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    return { data };
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

export const CallPayment = async (payload) => {
  try {
    const { data } = await axios.post('/api/payment', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

/**
 *
 * @param {*} payload
 * @returns
 */
export const paymentCreate = async (payload) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const data = await axios.post('/create/order', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

/**
 *
 * @param {*} payload
 * @returns
 */
export const savePaymentInfo = async (payload) => {
  try {
    const AUTH_TOKEN = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.post('original/payment/save', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

/**
 * * *************************************************************
 * * ********************* Pagination *************************
 * * *************************************************************
 */

/**
 * Payment
 */
export const getpayment = async (payload) => {
  try {
    // const token = getToken();
    const { data } = await axios.post(
      'http://localhost:3000/api/payment',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return { data };
  } catch (error) {
    // toast.error(error.response.data.message);
    printLog(error);
  }
};

// **************************************************************

export const getStudioListsPagination = async (location, index, size = 100) => {
  try {
    // const token = getToken();
    const { data } = await axios.get(
      `/photographs/global-search-photographer?location_id=${location}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {
    // toast.error(error.response.data.message);
    // window.location.href = '/500';

    printLog(error);
  }
};
export const getCategoryListsPagination = async (location, index) => {
  try {
    // const token = getToken();
    const { data } = await axios.get(
      `/photographs/photographs-tab-by-categories?location_id=${location}&min_price=0&page=${index}&size=5`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {
    // toast.error(error.response.data.message);
    // window.location.href = '/500';

    printLog(error);
  }
};
export const getPlaceListsPagination = async (page) => {
  try {
    // const token = getToken();
    const { data } = await axios.get(
      `/photographs/places-tab-list?page=${page}&size=4`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {
    // toast.error(error.response.data.message);
    // window.location.href = '/500';
    // printLog(error);
  }
};

//HOME SERVICE

export const getRelatePhotos = async (payload) => {
  try {
    const token = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.get(
      `/get_studios_by_category?page=0&pageSize=10000&category_id=${payload?.cat_id}&location_id=${payload?.locationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data?.data?.relate;
  } catch (error) {
    printLog(error);
  }
};

export const getServiceGalleryPhotos = async (payload) => {
  try {
    // const payload=12
    const token = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.get(
      `/get_images_by_category?page=0&pageSize=10000&category_id=${payload}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data?.data;
  } catch (error) {
    printLog(error);
  }
};

export const getFooterCategories = async () => {
  try {
    const { data } = await axios.get('/categories');
    return data?.data?.category_data;
  } catch (error) {
    printLog(error);
  }
};

export const getFolderDetails = async (id, user_id) => {
  try {
    // const token = getToken();
    const token = getLocalStorage(COMMON.AUTH_TOKEN);
    let url = `/get-folders-details?booking_id=${id}`;
    if (user_id) {
      url = `/get-folders-details?booking_id=${id}&user_id=${user_id}`;
    }
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data?.folders;
  } catch (error) {
    // printLog(error);
  }
};

export const checkCouponCode = async (payload) => {
  try {
    const token = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.post(
      `/verify-coupon?coupon_code=${payload.couponCode}&user_id=${payload.user}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get refer details
 * @param {*} userId
 * @returns
 */
export const getReferDetails = async (userId) => {
  try {
    const token = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.get(`/user/refers?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    printLog(error);
  }
};

/**
 * Get Coupon code details
 * @param {*} userId
 * @returns
 */
export const getCouponCode = async (userId) => {
  try {
    const token = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.get(`/refered-coupons?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data?.data;
  } catch (error) {
    printLog(error);
  }
};

export const claimRewards = async (userId) => {
  try {
    const token = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.post(`/twlv-claim?user_id=${userId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getReferDashboard = async (userId) => {
  try {
    const token = getLocalStorage(COMMON.AUTH_TOKEN);
    const { data } = await axios.get(`/refer-dashboard?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data?.data;
  } catch (error) {
    printLog(error);
  }
};
