import Link from 'next/link';
import SecondaryLayout from '../../../components/layout/SecondaryLayout';
import Header from '../../../components/common/Header';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import * as api from '../../../services/storeService';
import ProductBanner from '../../../components/eCom/ProductBanner';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useUser } from '../../../context/UserContext';
import { filter } from 'lodash';
import DefaultAttributes from '../../../components/eCom/DefaultAttribute';
import { COMMON } from '../../../constants/const';
import { setCartQuantity } from '../../../redux/eComSlices/cartSlice';
import CartQuantityHeader from '../../../components/eCom/CartQuantityHeader';
// import RelatedFrame from '../../../components/eCom/RelatedFrame';
import AddressModel from '../../../components/eCom/AddressModel';
import UserReview from '../../../components/eCom/UserReview';
import RelatedFrame from '../../../components/eCom/RelatedFrame';
import AIGeneratedFrame from '../../../components/eCom/AIGeneratedFrame';
import useSelectVariants from '../../../hooks/useSelectVariants';
import useBannerImage from '../../../hooks/useBannerImage';

export default function ProductDetails() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userId } = useUser();
  const attr = useSelector((state) => state.attributes);
  const { pid: productId } = router.query;
  const { data } = useSWR(
    productId && '/store/product_details' + productId,
    () => api.getProductDetails({ product: productId })
  );

  const { data: cart, mutate: mutation } = useSWR(
    userId && ['/store/getCart' + userId],
    () => api.getCart(userId)
  );

  const { data: address, mutate } = useSWR(
    userId && ['/store/getAddress' + userId],
    () => api.getAddress(userId)
  );

  const vendorId =
    data && data.product_details && data.product_details?.vendor?.vendor_id;
  const defaultAddress = filter(address, (o) => o.is_default);
  const zipcode = defaultAddress && defaultAddress[0] && defaultAddress[0].zip;

  const { data: isShippingAvialble } = useSWR(
    vendorId && defaultAddress && ['/store/shipping/details' + zipcode],
    () => api.getShippingDetails({ vendorId, zipcode })
  );

  useEffect(() => {
    dispatch(setCartQuantity(cart?.carts.length));
  }, [cart]);

  const product_details = data && data?.product_details;

  /**
   *
   * @param {*} e
   */
  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error('Please login first');
      return;
    } else if (userId) {
      const payload = preparePayload(userId, attr?.defaultAttribute);
      const data = await api.saveToKart(payload);
      if (data?.status === 'success') {
        toast.success('added to cart');
        mutation();
      } else {
        toast.error('failed to add to cart');
      }
    }
  };

  const preparePayload = (userId, attribute) => {
    const payload = {
      ...attribute,
      user_id: userId,
      total_quantity: 1,
      product_id: productId,
    };
    return payload;
  };

  // custom hooks
  const { otherVariants, defaultVariants, generatedImage } =
    useSelectVariants(product_details);
  const { dynamicBannerImage, isLoading, AIFrameImages } = useBannerImage(
    defaultVariants?.variation_id,
    product_details?.template_id,
    product_details?.is_system_generated,
    product_details?.template_sub_category_id
  );
  const isProductInCart = filter(
    cart?.carts,
    (c) => c.variation_id === defaultVariants?.variation_id
  );
  return (
    <SecondaryLayout>
      <Header>
        <div className="flex flex-col justify-start items-start self-stretch bg-[#010201]">
          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-4 py-4">
            <div className="flex Link justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.push({
                    pathname: '/store/products/',
                    query: {
                      category_id: product_details?.category_id,
                      sub_cat_id: product_details?.sub_category_id,
                    },
                  });
                }}
              >
                <ArrowLeftIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex flex-col justify-center items-start flex-grow flex-shrink-0 relative self-stretch gap-1">
              <p className="text-base font-medium text-left text-white truncate overflow-hidden">
                {product_details?.name}
              </p>
            </div>
            <CartQuantityHeader />
          </div>
        </div>
      </Header>

      {/* Page Body */}
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 bg-[#19191c] md:px-44 md:pb-32">
        <div className="hidden md:flex flex-col justify-start items-start self-stretch">
          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 pt-12 pb-8">
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
              <button
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowLeftIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
              <p className="flex-grow-0 flex-shrink-0 text-xl font-medium text-left text-white">
                Products
              </p>
            </div>
          </div>
        </div>
        <div className="w-full lg:flex lg:gap-6">
          <div className="w-full flex flex-col self-stretch lg:overflow-hidden">
            <ProductBanner
              banners={product_details?.images.thumb}
              dynamicImage={dynamicBannerImage}
              isLoading={isLoading}
            />
            <div className="hidden lg:flex justify-start mt-6 items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-4 ">
              <Link
                href={{
                  pathname: '/store/customized',
                  query: { product: productId },
                }}
                className="w-full flex justify-center items-center self-stretch relative gap-2.5 px-4 py-3 rounded-2xl bg-[#1c3b6c] border border-[#186ced] text-base font-semibold text-white"
              >
                Customize
              </Link>
              {isProductInCart && isProductInCart.length > 0 ? (
                <>
                  <Link
                    href={{
                      pathname: '/store/cart',
                    }}
                    className="w-full flex justify-center items-center self-stretch relative gap-2.5 px-4 py-3 rounded-2xl bg-[#186ced] border border-[#186ced] text-base font-semibold text-white"
                  >
                    View Cart
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex justify-center items-center self-stretch relative gap-2.5 px-4 py-3 rounded-2xl bg-[#186CED] border border-[#186ced] text-base font-semibold text-white disabled:opacity-50"
                    disabled={!isShippingAvialble?.is_shipping_available}
                  >
                    Add to Cart
                  </button>
                </>
              )}
            </div>
            {isShippingAvialble?.is_shipping_available === false && userId && (
              <div className="text-red-500 flex justify-end w-full p-2">
                <span className="">
                  The item is not delivered by shipping partners in the area
                </span>
              </div>
            )}
          </div>
          {/*  */}
          <div className="w-full">
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-10 px-6 py-6 pb-8">
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-6">
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-1">
                  {product_details?.product_type && (
                    <p className="flex-grow-0 flex-shrink-0 w-[300px] text-sm text-left uppercase text-gray-400">
                      {product_details?.product_type}
                    </p>
                  )}
                  <p className="self-stretch flex-grow-0 flex-shrink-0  text-2xl font-semibold text-left text-white">
                    {product_details?.name}
                  </p>
                  {/* Price details for default attribute */}
                  {defaultVariants && (
                    <p className="w-full self-stretch flex-grow-0 flex-shrink-0  md:w-full text-base font-medium text-left text-white">
                      <span className="text-xl">
                        {COMMON.RUPEE_SYMBOL +
                          ' ' +
                          Math.round(defaultVariants?.discounted_amount)}
                      </span>
                      {defaultVariants.percentage > 0 && (
                        <span className="ml-2 text-sm line-through text-gray-500 font-normal">
                          {COMMON.RUPEE_SYMBOL +
                            Math.round(defaultVariants.price)}
                        </span>
                      )}
                      {defaultVariants.percentage > 0 && (
                        <span className="ml-2 font-normal text-lg text-blue-500 text-[.85rem]">
                          {defaultVariants.percentage}% off
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
                  {/* Attributes Details */}
                  <h2 className="text-white text-lg font-bold">
                    Top Highlight
                  </h2>
                  {defaultVariants && (
                    <DefaultAttributes attributes={defaultVariants} />
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-10 p-6 border border-white/[0.16] sm:border-transparent">
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
                <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                  <p className="flex-grow-0 flex-shrink-0 text-xl font-semibold text-left text-white">
                    Product Details
                  </p>
                </div>
                <p className="self-stretch flex-grow-0 flex-shrink-0  md:w-full text-sm text-left text-white/[0.64]">
                  {product_details?.description}
                </p>
                <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                  <span className="text-white text-sm">Vendor Name :</span>
                  <span className="text-white/[0.64] text-sm">
                    {product_details?.vendor?.vendor_name}
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden mt-2 lg:block">
              <AddressModel
                address={address}
                userId={userId}
                mutate={mutate}
                isDisplayFullAddress={false}
              />
            </div>
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-10 p-6 border border-white/[0.16] sm:border-transparent">
              <UserReview
                review={product_details?.rating_data}
                productId={product_details?.product_id}
              />
            </div>
          </div>
        </div>

        {/* AI generated frame */}
        <AIGeneratedFrame
          AIFrameImages={AIFrameImages}
          price={defaultVariants?.price}
        />

        {/* Different variations */}
        <RelatedFrame
          relatedFrame={otherVariants}
          generatedImage={generatedImage}
        />

        <div className="flex flex-col sticky lg:hidden bottom-0 w-full mt-3">
          <AddressModel
            address={address}
            userId={userId}
            mutate={mutate}
            isDisplayFullAddress={false}
          />
          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-4 px-[18px] py-[15px] bg-[#1C1D20] hover:bg-[#26282c] md:rounded-b-xl">
            <Link
              href={{
                pathname: '/store/customized',
                query: { product: productId },
              }}
              className="w-full flex justify-center items-center self-stretch relative gap-2.5 px-4 py-3 rounded-2xl bg-[#1c3b6c] border border-[#186ced] text-base font-semibold text-white"
            >
              Customize
            </Link>
            {isProductInCart && isProductInCart.length > 0 ? (
              <>
                <Link
                  href={{
                    pathname: '/store/cart',
                  }}
                  className="w-full flex justify-center items-center self-stretch relative gap-2.5 px-4 py-3 rounded-2xl bg-[#186ced] border border-[#186ced] text-base font-semibold text-white"
                >
                  View Cart
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleAddToCart}
                  className="w-full flex justify-center items-center self-stretch relative gap-2.5 px-4 py-3 rounded-2xl bg-[#186CED] border border-[#186ced] text-base font-semibold text-white disabled:opacity-50"
                  disabled={!isShippingAvialble?.is_shipping_available}
                >
                  Add to Cart
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </SecondaryLayout>
  );
}
