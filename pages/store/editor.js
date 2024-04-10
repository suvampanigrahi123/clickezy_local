import SecondaryLayout from '../../components/layout/SecondaryLayout';
import * as api from '../../services/storeService';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
// import { useUser } from '../../context/UserContext';
import { isEmpty, isEqual } from 'lodash';
import { setAvailableProduct } from '../../redux/eComSlices/attributeSlice';
import useCart from '../../hooks/useEComCart';

// function ThumbnailSmall() {
//   return (
//     <div className="flex flex-col justify-start items-start flex-grow relative gap-2.5">
//       <Link
//         href="product-details"
//         className="w-[164px] h-[164px] aspect-w-16 aspect-h-16 overflow-hidden rounded"
//       >
//         <Image
//           src="/164-164.png"
//           className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
//           width={164}
//           height={164}
//           alt=""
//         />
//       </Link>
//       <div className="flex flex-col justify-start items-start self-stretch relative gap-2">
//         <p className=" text-xs font-medium text-left uppercase text-white">
//           ₹ 1200
//         </p>
//         <p className="self-stretch w-[163px] text-base font-medium text-left text-white">
//           Family Memories Frames
//         </p>
//       </div>
//     </div>
//   );
// }

export default function ProductDetails() {
  const router = useRouter();
  const dispatch = useDispatch();
  // const { userId } = useUser();
  // const products = useSelector((state) => state.cart);
  const attr = useSelector((state) => state.attributes);
  // const [switcthButton, setSwitchButton] = useState('add');
  const [callHook, setCallHook] = useState(false);
  const { product } = router.query;
  const { data } = useSWR(product && '/store/product_details' + product, () =>
    api.getProductDetails({ product: product })
  );
  const product_details = data && data?.product_details;
  // call the hooks when product added to cart
  useCart(callHook);

  useEffect(() => {
    setCallHook(false);
  }, []);

  useEffect(() => {
    function getProductDetails() {
      if (typeof attr?.attribute === 'object' && !isEmpty(attr.attribute)) {
        const obj = {};
        Object.entries(attr?.attribute).forEach(
          ([key, value]) => (obj[key] = value?.attr_value)
        );
        const availableProduct = checkAttributes(
          obj,
          product_details?.variation
        );
        if (isEmpty(availableProduct)) {
          //toast.error('This variant is not available');
          console.log('not available');
        } else {
          dispatch(setAvailableProduct(availableProduct));
        }
      }
    }
    getProductDetails();
  }, [attr?.attribute]);

  /**
   *
   * @param {*} e
   */
  // const handleAddToCart = async (e) => {
  //   e.preventDefault();
  //   if (!userId) {
  //     toast.error('Please login first');
  //     return;
  //   }
  //   if (typeof attr?.attribute === 'object') {
  //     const obj = {};
  //     Object.entries(attr?.attribute).forEach(
  //       ([key, value]) => (obj[key] = value?.attr_value)
  //     );
  //     const payload = preparePayload(obj, product_details);
  //     const data = await api.saveToKart(payload);
  //     if (data?.status === 'success') {
  //       toast.success('added to cart');
  //       setCallHook(true);
  //       setSwitchButton('go');
  //     } else {
  //       toast.error('failed to add to cart');
  //     }
  //   } else {
  //     toast('Select Variants', {
  //       icon: '⚠️',
  //     });
  //   }
  // };

  /*
  const preparePayload = (attr, product) => {
    const att = checkAttributes(attr, product?.variation);
    if (isEmpty(att)) {
      toast.error('This variant is not available');
      return false;
    }
    const payload = {
      product_id: product?.product_id,
      price: att?.price,
      total_quantity: 1,
      user_id: userId,
      attributes_data: attr,
      variation_id: att.id,
    };
    return payload;
  };
   */

  const checkAttributes = (attributes, product) => {
    const obj = {};
    product.forEach((v) => {
      const propertiesMatch = isEqual(attributes, v.attribute_value);
      if (propertiesMatch) {
        obj.id = v.variation_id;
        obj.price = v.price;
        obj.quantity = v.qnty;
        return;
      }
    });
    return obj;
  };
  /*
  const handleGotoCart = () => {
    router.push('/store/cart');
  };
  */

  return (
    <SecondaryLayout>
      {/* <Header>
        <div className="flex flex-col justify-start items-start self-stretch bg-[#010201]">
          <div className="flex justify-start items-center self-stretch gap-2 px-4 py-4">
            <div className="flex Linkjustify-start items-center relative py-1">
              <button onClick={() => router.back()}>
                <ArrowLeftIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex flex-col justify-center items-start flex-grow flex-shrink-0 relative self-stretch gap-1">
              <p className="text-base font-medium text-left text-white truncate overflow-hidden">
                {product_details?.name}
              </p>
            </div>
            <div className="flex justify-start items-center gap-4">
              <Link href="/store/cart">
                <ShoppingCartIcon className="h-6 w-6 text-white relative" />
                <span className="absolute  top-2 right-4 w-4 h-4 rounded-full bg-blue-500 text-white text-[0.6rem] flex justify-center items-center">
                  {products?.quantity || 0}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </Header> */}

      {/* Page Body */}
      <div className="flex flex-col min-h-screen relative">
        <div className="flex self-stretch md:overflow-hidden md:max-h-96 md:rounded-2xl sticky top-0">
          <img
            src="https://assets.staging.clickezy.com//product/16940/thumb_download (6).png"
            className="w-full h-full object-center object-cover lg:w-full lg:h-full animate-fadeIn"
            alt="editor_image"
          />
        </div>
        <div className="flex flex-col self-stretch grow bg-black relative">
          <Tab.Group>
            <Tab.List className="flex p-4 bg-[#1f1f1f] gap-6 sticky top-0">
              <Tab className="text-white ui-selected:bg-blue-500 ui-selected:text-white ui-not-selected:bg-white ui-not-selected:text-black">
                Frame
              </Tab>
              <Tab className="text-white">Templates</Tab>
              <Tab className="text-white">Image</Tab>
              <Tab className="text-white">Text</Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <div className="flex flex-col justify-start items-start self-stretch gap-4 p-4 bg-black">
                  <div className="flex flex-col justify-start items-start self-stretch gap-4">
                    <div className="flex flex-col justify-start items-start self-stretch relative gap-2">
                      <p className=" text-xs font-medium text-left capitalize text-white/[0.64]">
                        Size
                      </p>
                      <div className="flex justify-start items-start self-stretch gap-2">
                        <div className="flex justify-center items-center relative gap-2.5 px-4 py-3 rounded-2xl bg-[#3b7259]">
                          <p className=" text-sm font-semibold text-center text-white">
                            16x20
                          </p>
                        </div>
                        <div className="flex justify-center items-center relative gap-2.5 px-4 py-3 rounded-2xl bg-[#393b40]">
                          <p className=" text-sm font-semibold text-center text-white">
                            8x8
                          </p>
                        </div>
                        <div className="flex justify-center items-center relative gap-2.5 px-4 py-3 rounded-2xl bg-[#393b40]">
                          <p className=" text-sm font-semibold text-center text-white">
                            8x10
                          </p>
                        </div>
                        <div className="flex justify-center items-center relative gap-2.5 px-4 py-3 rounded-2xl bg-[#393b40]">
                          <p className=" text-sm font-semibold text-center text-white">
                            12x15
                          </p>
                        </div>
                        <div className="flex justify-center items-center relative gap-2.5 px-4 py-3 rounded-2xl bg-[#393b40]">
                          <p className=" text-sm font-semibold text-center text-white">
                            12x18
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-start self-stretch relative gap-2">
                      <p className=" text-xs font-medium text-left capitalize text-white/[0.64]">
                        Frame Color
                      </p>
                      <div className="flex justify-center items-center self-stretch h-12 relative gap-2.5 pl-4 pr-2 py-2 rounded-lg bg-[#27292d]">
                        <p className="flex-grow w-[292px] text-base font-medium text-left text-white">
                          White
                        </p>
                        <svg
                          width={32}
                          height={32}
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className=" w-8 h-8 relative"
                          preserveAspectRatio="none"
                        >
                          <rect width={32} height={32} rx={8} fill="white" />
                          <path
                            d="M21.9679 10.0316C21.5206 9.58431 20.9139 9.33301 20.2812 9.33301C19.6486 9.33301 19.0419 9.58431 18.5946 10.0316L10.6266 17.9996C10.3558 18.2705 10.1654 18.6111 10.0766 18.9836L9.34658 22.0516C9.32681 22.1347 9.32867 22.2215 9.35196 22.3037C9.37526 22.3859 9.41922 22.4607 9.47965 22.5211C9.54008 22.5815 9.61497 22.6253 9.69718 22.6485C9.77939 22.6717 9.86617 22.6735 9.94924 22.6536L13.0166 21.923C13.3894 21.8343 13.7302 21.6439 14.0012 21.373L21.9679 13.4063C22.4152 12.959 22.6665 12.3523 22.6665 11.7196C22.6665 11.087 22.4152 10.4803 21.9679 10.033V10.0316ZM19.3012 10.7383C19.4299 10.6096 19.5827 10.5075 19.7509 10.4379C19.919 10.3682 20.0992 10.3324 20.2812 10.3324C20.4632 10.3324 20.6435 10.3682 20.8116 10.4379C20.9798 10.5075 21.1325 10.6096 21.2612 10.7383C21.3899 10.867 21.492 11.0198 21.5617 11.1879C21.6313 11.3561 21.6672 11.5363 21.6672 11.7183C21.6672 11.9003 21.6313 12.0805 21.5617 12.2487C21.492 12.4168 21.3899 12.5696 21.2612 12.6983L20.6666 13.2923L18.7066 11.333L19.3012 10.739V10.7383ZM17.9999 12.041L19.9599 13.9996L13.2932 20.6663C13.1532 20.8063 12.9772 20.9043 12.7846 20.9503L10.5072 21.493L11.0492 19.2156C11.0952 19.0223 11.1939 18.8463 11.3339 18.7063L17.9999 12.0396V12.041Z"
                            fill="#19191C"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-start self-stretch relative gap-2">
                      <p className=" text-xs font-medium text-left capitalize text-white/[0.64]">
                        Canvas Color
                      </p>
                      <div className="flex justify-center items-center self-stretch h-12 relative gap-2.5 pl-4 pr-2 py-2 rounded-lg bg-[#27292d]">
                        <p className="flex-grow w-[292px] text-base font-medium text-left text-white">
                          Pink
                        </p>
                        <div className=" w-8 h-8 relative" />
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="flex flex-col justify-start items-start self-stretch  gap-4 p-4 bg-black">
                  <div className="flex flex-col justify-start items-start self-stretch  gap-4">
                    <div className="flex justify-start items-start self-stretch flex-wrap gap-2">
                      <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[83.5px] h-[83.5px] gap-2.5 p-2.5 rounded bg-white" />
                      <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[83.5px] h-[83.5px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-white" />
                      <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[83.5px] h-[83.5px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-white" />
                      <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[83.5px] h-[83.5px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-white" />
                      <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[83.5px] h-[83.5px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-white" />
                      <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[83.5px] h-[83.5px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-white" />
                      <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[83.5px] h-[83.5px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-white" />
                      <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[83.5px] h-[83.5px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-white" />
                      <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[83.5px] h-[83.5px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-white" />
                      <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[83.5px] h-[83.5px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-white" />
                      <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[83.5px] h-[83.5px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-white" />
                      <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[83.5px] h-[83.5px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-white" />
                      <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[83.5px] h-[83.5px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-white" />
                      <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[83.5px] h-[83.5px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-white" />
                      <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[83.5px] h-[83.5px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-white" />
                    </div>
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 h-[218px] w-[390px] overflow-hidden gap-4 p-4 bg-black">
                  <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
                    <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
                      <div className="flex justify-center items-center flex-grow relative gap-2.5 px-4 py-3 rounded-2xl bg-[#202124]">
                        <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-center text-white">
                          Edit image
                        </p>
                      </div>
                      <div className="flex justify-center items-center flex-grow relative gap-2.5 px-4 py-3 rounded-2xl bg-[#202124]">
                        <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-center text-white">
                          Upload image
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                      <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white/[0.64]">
                        Filter
                      </p>
                      <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 h-[94px] gap-2">
                        <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1">
                          <p className="flex-grow-0 flex-shrink-0 text-[11px] font-medium text-left text-white">
                            Normal
                          </p>
                          <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[72px] h-[72px] gap-2.5 p-2.5 rounded bg-[#202124]" />
                        </div>
                        <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1">
                          <p className="flex-grow-0 flex-shrink-0 text-[11px] font-medium text-left text-white">
                            Normal
                          </p>
                          <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[72px] h-[72px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-[#202124]" />
                        </div>
                        <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1">
                          <p className="flex-grow-0 flex-shrink-0 text-[11px] font-medium text-left text-white">
                            Normal
                          </p>
                          <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[72px] h-[72px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-[#202124]" />
                        </div>
                        <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1">
                          <p className="flex-grow-0 flex-shrink-0 text-[11px] font-medium text-left text-white">
                            Normal
                          </p>
                          <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[72px] h-[72px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-[#202124]" />
                        </div>
                        <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1">
                          <p className="flex-grow-0 flex-shrink-0 text-[11px] font-medium text-left text-white">
                            Normal
                          </p>
                          <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[72px] h-[72px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-[#202124]" />
                        </div>
                        <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1">
                          <p className="flex-grow-0 flex-shrink-0 text-[11px] font-medium text-left text-white">
                            Normal
                          </p>
                          <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[72px] h-[72px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-[#202124]" />
                        </div>
                        <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1">
                          <p className="flex-grow-0 flex-shrink-0 text-[11px] font-medium text-left text-white">
                            Normal
                          </p>
                          <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[72px] h-[72px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-[#202124]" />
                        </div>
                        <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1">
                          <p className="flex-grow-0 flex-shrink-0 text-[11px] font-medium text-left text-white">
                            Normal
                          </p>
                          <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[72px] h-[72px] opacity-[0.48] gap-2.5 p-2.5 rounded bg-[#202124]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="flex flex-col justify-start items-start self-stretch  gap-4 p-4 bg-black">
                  <div className="flex flex-col justify-start items-start self-stretch  gap-4">
                    <div className="flex flex-col justify-start items-start self-stretch  relative gap-2">
                      <p className=" text-xs font-medium text-left capitalize text-white/[0.64]">
                        Text
                      </p>
                      <div className="flex justify-start items-start self-stretch  h-[88px] relative gap-2.5 p-4 rounded-lg bg-[#27292d]">
                        <p className="flex-grow w-[326px] text-base font-medium text-left text-white">
                          This is a dummy text.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-start self-stretch  relative gap-2">
                      <p className=" text-xs font-medium text-left capitalize text-white/[0.64]">
                        Font Size
                      </p>
                      <div className="flex justify-start items-start self-stretch  gap-2">
                        <div className="flex justify-center items-center  relative gap-2.5 px-4 py-3 rounded-2xl bg-[#3b7259]">
                          <p className=" text-sm font-semibold text-center text-white">
                            16px
                          </p>
                        </div>
                        <div className="flex justify-center items-center  relative gap-2.5 px-4 py-3 rounded-2xl bg-[#393b40]">
                          <p className=" text-sm font-semibold text-center text-white">
                            18px
                          </p>
                        </div>
                        <div className="flex justify-center items-center  relative gap-2.5 px-4 py-3 rounded-2xl bg-[#393b40]">
                          <p className=" text-sm font-semibold text-center text-white">
                            24px
                          </p>
                        </div>
                        <div className="flex justify-center items-center  relative gap-2.5 px-4 py-3 rounded-2xl bg-[#393b40]">
                          <p className=" text-sm font-semibold text-center text-white">
                            32px
                          </p>
                        </div>
                        <div className="flex justify-center items-center  relative gap-2.5 px-4 py-3 rounded-2xl bg-[#393b40]">
                          <p className=" text-sm font-semibold text-center text-white">
                            40px
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-start self-stretch  relative gap-2">
                      <p className=" text-xs font-medium text-left capitalize text-white/[0.64]">
                        Font Family
                      </p>
                      <div className="flex justify-center items-center self-stretch  h-12 relative gap-2.5 pl-[18px] pr-3 rounded-lg bg-[#27292d]">
                        <p className="flex-grow w-[294px] text-base font-medium text-left text-white">
                          Inter
                        </p>
                        <div className=" w-6 h-6 relative" />
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-start self-stretch  relative gap-2">
                      <p className=" text-xs font-medium text-left capitalize text-white/[0.64]">
                        Font Color
                      </p>
                      <div className="flex justify-center items-center self-stretch  h-12 relative gap-2.5 pl-4 pr-2 py-2 rounded-lg bg-[#27292d]">
                        <p className="flex-grow w-[292px] text-base font-medium text-left text-white">
                          Pink
                        </p>
                        <div className=" w-8 h-8 relative" />
                      </div>
                    </div>
                    <div className="flex justify-start items-start self-stretch  gap-4">
                      <div className="flex flex-col justify-start items-start flex-grow relative gap-2">
                        <p className=" text-xs font-medium text-left capitalize text-white/[0.64]">
                          Border Width
                        </p>
                        <div className="flex justify-center items-center self-stretch  h-12 relative gap-2.5 pl-[18px] pr-3 rounded-lg bg-[#27292d]">
                          <p className="flex-grow w-[107px] text-base font-medium text-left text-white">
                            1px
                          </p>
                          <div className=" w-6 h-6 relative" />
                        </div>
                      </div>
                      <div className="flex flex-col justify-start items-start flex-grow relative gap-2">
                        <p className=" text-xs font-medium text-left capitalize text-white/[0.64]">
                          Border Color
                        </p>
                        <div className="flex justify-center items-center self-stretch  h-12 relative gap-2.5 pl-4 pr-2 py-2 rounded-lg bg-[#27292d]">
                          <p className="flex-grow w-[105px] text-base font-medium text-left text-white">
                            Pink
                          </p>
                          <div className=" w-8 h-8 relative" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
        <div className="flex flex-col justify-start items-start self-stretch w-screen gap-4 p-4 bg-[#010201] sticky bottom-0">
          <div className="flex justify-start items-center self-stretch gap-4">
            <div className="flex justify-center items-center flex-grow relative gap-2.5 px-4 py-3 rounded-2xl bg-[#3d3f44]">
              <p className=" text-base font-semibold text-center text-white">
                Cancel
              </p>
            </div>
            <div className="flex justify-center items-center flex-grow relative gap-2.5 px-4 py-3 rounded-2xl bg-[#186ced]">
              <p className=" text-base font-semibold text-center text-white">
                Next
              </p>
            </div>
          </div>
        </div>
      </div>
    </SecondaryLayout>
  );
}
