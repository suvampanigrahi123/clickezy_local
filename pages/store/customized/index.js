import SecondaryLayout from '../../../components/layout/SecondaryLayout';
import * as api from '../../../services/storeService';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useState } from 'react';
import { Tab } from '@headlessui/react';

import useCart from '../../../hooks/useEComCart';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';
import Image from 'next/image';

export default function ProductDetails() {
  const router = useRouter();
  const [callHook] = useState(false);
  const { product } = router.query;
  const { data } = useSWR(product && '/store/product_details' + product, () =>
    api.getProductDetails({ product: product })
  );
  const attribute = data && data?.product_details?.variation;

  // call the hooks when product added to cart
  // TODO: update product list in carts
  useCart(callHook);

  const attri = {};

  if (attribute) {
    const keys = Object.keys(attribute[0].attribute_value);
    keys.forEach((key) => {
      attri[key] = [];
    });

    Object.entries(attri).forEach(([key]) => {
      attri[key] = Array.from(
        new Set(attribute.map((variation) => variation.attribute_value[key]))
      );
    });
  }

  // useEffect(() => {
  //   function getProductDetails() {
  //     if (typeof attr?.attribute === 'object' && !isEmpty(attr.attribute)) {
  //       const obj = {};
  //       Object.entries(attr?.attribute).forEach(
  //         ([key, value]) => (obj[key] = value?.attr_value)
  //       );
  //       const availableProduct = checkAttributes(
  //         obj,
  //         product_details?.variation
  //       );
  //       if (isEmpty(availableProduct)) {
  //         //toast.error('This variant is not available');
  //         console.log('not available');
  //       } else {
  //         dispatch(setAvailableProduct(availableProduct));
  //       }
  //     }
  //   }
  //   getProductDetails();
  // }, [attr?.attribute]);

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

  // const preparePayload = (attr, product) => {
  //   const att = checkAttributes(attr, product?.variation);
  //   if (isEmpty(att)) {
  //     toast.error('This variant is not available');
  //     return false;
  //   }
  //   const payload = {
  //     product_id: product?.product_id,
  //     price: att?.price,
  //     total_quantity: 1,
  //     user_id: userId,
  //     attributes_data: attr,
  //     variation_id: att.id,
  //   };
  //   return payload;
  // };

  // const checkAttributes = (attributes, product) => {
  //   const obj = {};
  //   product.forEach((v) => {
  //     const propertiesMatch = isEqual(attributes, v.attribute_value);
  //     if (propertiesMatch) {
  //       obj.id = v.variation_id;
  //       obj.price = v.price;
  //       obj.quantity = v.qnty;
  //       return;
  //     }
  //   });
  //   return obj;
  // };

  // const handleGotoCart = () => {
  //   router.push('/store/cart');
  // };

  return (
    <SecondaryLayout>
      {/* Page Body */}
      <div className="flex flex-col min-h-screen relative">
        <div className="flex self-stretch md:overflow-hidden md:max-h-96 md:rounded-2xl sticky top-0">
          <Image
            fill
            src="https://assets.staging.clickezy.com//product/16940/thumb_download (6).png"
            className="w-full h-full object-center object-cover lg:w-full lg:h-full animate-fadeIn"
            alt='Product Image'
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
                    {Object.entries(attri).map(([key, value], i) => (
                      <div
                        className="flex flex-col justify-start items-start self-stretch relative gap-2"
                        key={i}
                      >
                        <p className=" text-xs font-medium text-left capitalize text-white/[0.64]">
                          {key}
                        </p>
                        <Swiper
                          slidesPerView="auto"
                          spaceBetween={10}
                          freeMode={true}
                          modules={[FreeMode]}
                          className="mySwiper"
                        >
                          <div className="flex justify-start items-start  gap-2 overflow-x-auto">
                            {value?.map((v, i) => (
                              <SwiperSlide key={i} className="filterSlider">
                                <div className="relative gap-2.5 px-4 py-3 min-w-max rounded-2xl bg-[#393b40]">
                                  <p className="text-sm font-semibold text-center text-white">
                                    {v}
                                  </p>
                                </div>
                              </SwiperSlide>
                            ))}
                          </div>
                        </Swiper>
                      </div>
                    ))}
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
