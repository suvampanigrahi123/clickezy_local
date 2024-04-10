import React from 'react';
import { COMMON } from '../../constants/const';

const ProductPriceDetails = ({
  item,
  discountPrice,
  totalPrice,
  shippingPrice,
  page,
  coupon,
}) => {
  const originalPrice = Math.round(totalPrice);
  const discount = Math.round(discountPrice);
  const discountedPrice = Math.round(originalPrice) - Math.round(discount);
  const total =
    Math.round(discount) + Math.round(shippingPrice) - Math.round(coupon);
  return (
    <>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-6 pt-6 pb-3">
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2 px-6">
          <p className="self-stretch flex-grow-0 flex-shrink-0 w-[342px] text-xl font-medium text-left text-white">
            Product Details
          </p>
        </div>
        <div className="flex text-gray-300 flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 overflow-x-auto">
          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              <span>
                Price Details <span>({item?.length} item)</span>{' '}
              </span>
              <span>{COMMON.RUPEE_SYMBOL + originalPrice}</span>
            </div>
            {discountedPrice > 0 && (
              <div className="flex items-center justify-between w-full mt-1">
                <span>Discount Should be </span>
                <span className="text-blue-500">
                  {'-' +
                    COMMON.RUPEE_SYMBOL +
                    (discountedPrice > 0 ? discount : 0)}
                </span>
              </div>
            )}

            {page === 'checkout' && (
              <>
                <div className="flex items-center justify-between w-full mt-1">
                  <span>Delivery</span>
                  <span>
                    {COMMON.RUPEE_SYMBOL} {shippingPrice}
                  </span>
                </div>
                {coupon > 0 && (
                  <div className="flex items-center justify-between w-full mt-1 text-blue-500">
                    <span>Applied Coupon</span>
                    <span>
                      {COMMON.RUPEE_SYMBOL} {coupon}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
          <hr className="w-full my-2 h-[0.2px] bg-[#4F4F4F] border-0 dark:bg-gray-700" />
          <div className="flex items-center justify-between w-full mt-1">
            <span>Total Amount</span>
            {page === 'checkout' ? (
              <span>
                {COMMON.RUPEE_SYMBOL} {total}
              </span>
            ) : (
              <span>
                {COMMON.RUPEE_SYMBOL} {Number(discount)}
              </span>
            )}
          </div>
          <hr className="w-full my-2 h-[0.2px] bg-[#4F4F4F] border-0 dark:bg-gray-700" />
          {discountedPrice > 0 && (
            <span className="text-blue-500 text-sm">
              You will achieve a savings of ₹ {discountedPrice} with this order.
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductPriceDetails;
