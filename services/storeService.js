// ***********************************************************************************************************************
// ***********************************************************************************************************************
// TODO:                                        Store Service
// ***********************************************************************************************************************
// ***********************************************************************************************************************

import axios from 'axios';
import { printLog } from '../helper/printLog';
import toast from 'react-hot-toast';
import { environment, dev } from '../www/http';
const storeUrl = dev.store;

//? @url: /store
// Info: Get Banners
//@method: GET
export const getBanners = async () => {
  try {
    // const token = getToken();
    const { data } = await axios.get(`${storeUrl}/store/banner`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const banners = data && data.data;
    return banners;
  } catch (error) {
    printLog(error);
  }
};

//? @url: /store
// Info: Get ecom categories
//@method: GET
export const getCategories = async () => {
  try {
    // const token = getToken();
    const { data } = await axios.get(`${storeUrl}/store/categories`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const categories = data && data.data;
    return categories;
  } catch (error) {
    printLog(error);
  }
};

/**
 *
 * @param {*} param0
 * @returns
 */
export const getProducts = async ({ catId, subCatId, index }) => {
  try {
    // const token = getToken();
    const { data } = await axios.get(
      `${storeUrl}/store/products?category_id=${catId}&sub_cat_id=${subCatId}&page=${index}&page_size=10`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const categories = data && data.data;
    return categories;
  } catch (error) {
    printLog(error);
  }
};

/**
 *
 * @param {*} param0
 * @returns
 */
export const getProductDetails = async ({ product }) => {
  try {
    // const token = getToken();
    const { data } = await axios.get(
      `${storeUrl}/store/product-details?product_id=${product}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const categories = data && data.data;
    return categories;
  } catch (error) {
    printLog(error);
  }
};

export const getAddress = async (userId) => {
  try {
    // const token = getToken();
    const { data } = await axios.get(
      `${storeUrl}/store/get_user_address?user_id=${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const address = data && data.data;
    return address;
  } catch (error) {
    printLog(error);
  }
};
export const saveAddress = async (payload) => {
  try {
    // const token = getToken();
    const { data } = await axios.post(
      `${storeUrl}/store/add_address`,
      payload,
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
export const updateAddress = async (payload) => {
  try {
    // const token = getToken();
    const { data } = await axios.put(
      `${storeUrl}/store/update_user_address`,
      payload,
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

export const deleteAddress = async (id) => {
  try {
    // const token = getToken();
    const { data } = await axios.delete(
      `${storeUrl}/store/delete_address?address_id=${id}`,
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

export const saveDefaultAddress = async (id) => {
  try {
    const { data } = await axios.put(
      `${storeUrl}/store/set_default_address?address_id=${id}`,
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
 *
 * @param {*} payload
 * @returns
 */
export const saveToKart = async (payload) => {
  try {
    // const token = getToken();
    const { data } = await axios.post(
      `${storeUrl}/store/add/to/cart`,
      payload,
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
 *
 * @param {*} cartId
 * @returns
 */
export const getCart = async (cartId) => {
  try {
    const { data } = await axios.get(
      `${storeUrl}/store/get/cart?user_id=${cartId}`,
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
 *
 * @param {*} cartId
 * @returns
 */
export const deleteCart = async (cartId) => {
  try {
    // const token = getToken();
    const { data } = await axios.delete(
      `${storeUrl}/store/delete/cart/item?cart_item_id=${cartId}`,
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
 *
 * @param {*} cartId
 * @returns
 */
export const editQuantity = async (payload) => {
  try {
    // const token = getToken();
    const { data } = await axios.post(
      `${storeUrl}/store/edit/add/to/cart`,
      payload,
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

export const createOrder = async (payload, totalPaymentPrice) => {
  const filterPayload = {
    payable_amount: totalPaymentPrice,
    total_amount: payload.price,
    user_id: payload.user_id,
  };
  if (payload.coupon_code) {
    filterPayload.coupon = payload.coupon_code;
  }
  try {
    // const token = getToken();
    const data = await axios.post(
      `${storeUrl}/create/order`,
      null,
      { params: filterPayload },
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
 *
 * @param {*} cartId
 * @returns
 */
export const placeOrder = async (payload) => {
  try {
    // const token = getToken();
    const { data } = await axios.post(
      `${storeUrl}/store/place/order`,
      payload,
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
 *
 * @param {*} cartId
 * @returns
 */
export const getOrders = async (payload) => {
  try {
    // const token = getToken();
    const { data } = await axios.get(
      `${storeUrl}/store/get/order/list?user_id=${payload}`,
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
 *
 * @param {*} payload
 * @returns
 */
export const getOrdersDetails = async (id) => {
  try {
    // const token = getToken();
    const { data } = await axios.get(
      `${storeUrl}/store/get/order/details?order_item_id=${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data.data;
  } catch (error) {
    printLog(error);
  }
};

export const getShippingDetails = async (payload) => {
  try {
    const { data } = await axios.post(
      `${storeUrl}/store/get/shipping/details?vendor_id=${payload.vendorId}&pincode=${payload.zipcode}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data.data;
  } catch (error) {
    printLog(error);
  }
};

export const saveRating = async (payload) => {
  try {
    // const token = getToken();
    const { data } = await axios.post(
      'https://store.staging.clickezy.com/api/v1/user/rating',
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  } catch (error) {
    printLog(error);
  }
};

export const getProductReview = async (productId) => {
  try {
    const { data } = await axios.get(
      `${storeUrl}/product/reviews?product_id=${productId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data.data;
  } catch (error) {
    printLog(error);
  }
};
export const applyPromoCode = async (payload) => {
  try {
    const { data } = await axios.post(
      `${storeUrl}/coupon/details?coupon_code=${payload.promoCode}&user_id=${payload.userId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data.data;
  } catch (error) {
    printLog(error);
  }
};

export const generateVariationBannerImage = async (payload) => {
  try {
    const { data } = await axios.get(
      `${storeUrl}/store/generate-image-for-variation?product_variation_id=${payload.selectedVariantId}&template_id=${payload.templateId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data.data;
  } catch (error) {
    printLog(error);
  }
};

export const generateUserBannerImage = async (payload) => {
  try {
    const { data } = await axios.get(
      `${storeUrl}/store/generate-image-for-variation?product_variation_id=${payload.defaultVariantId}&template_id=${payload.templateId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data.data;
  } catch (error) {
    printLog(error);
  }
};

/**
 *
 * @param {*} payload
 * @returns
 */
export const AiGeneratedVariationImage = async (payload) => {
  try {
    const { data } = await axios.get(
      `${storeUrl}/store/generate-multiple-images-for-variation?page=0&page_size=5&product_variation_id=${payload.selectedVariantId}&template_sub_category=${payload.templateSubCategoryId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data.data;
  } catch (error) {
    printLog(error);
  }
};
