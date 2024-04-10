import Image from 'next/image';
import React from 'react';

export default function TrackOrder() {
  return (
    <>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 md:gap-4 md:mb-12">
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-6 rounded-md md:hidden">
          <div className="flex flex-col justify-start self-stretch pb-2">
            <div className="relative pl-8 py-4 group">
              <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-gray-500 after:bg-blue-500 after:border-blue-500 before:w-[3px] sm:before:ml-[.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2  after:border-4 after:box-content  after:rounded-full sm:after:ml-[.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                <div className="flex gap-3">
                  <Image
                    src="/icons/order-confirm.svg"
                    width={30}
                    height={30}
                    alt="order-confirm"
                  />
                  <div className="text-sm  text-slate-50">
                    <p> Order Confirmed</p>
                    <p>Your order is confirmed.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative pl-8 py-4 group">
              <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-gray-500 after:bg-gray-500 after:border-gray-500 sm:before:ml-[.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2  after:border-4 after:box-content  after:rounded-full sm:after:ml-[.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                <div className="flex gap-3">
                  <Image
                    src="/icons/order-process.svg"
                    width={30}
                    height={30}
                    alt="order-process"
                  />
                  <div className="text-sm  text-slate-50">
                    <p> Order Processed</p>
                    <p>We're getting your order ready</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative pl-8 py-4 group">
              <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-gray-500 after:bg-gray-500 after:border-gray-500 sm:before:ml-[.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2  after:border-4 after:box-content  after:rounded-full sm:after:ml-[.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                <div className="flex gap-3">
                  <Image
                    src="/icons/order-shipping.svg"
                    width={30}
                    height={30}
                    alt="order-shipping"
                  />
                  <div className="text-sm  text-slate-50">
                    <p>On the way</p>
                    <p>Your order is en route</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative pl-8 pt-4 group">
              <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-gray-500 after:bg-gray-500 after:border-gray-500 sm:before:ml-[.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2  after:border-4 after:box-content  after:rounded-full sm:after:ml-[.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                <div className="flex gap-3">
                  <Image
                    src="/icons/order-ready-delivery.svg"
                    width={30}
                    height={30}
                    alt="ready to delivery"
                  />
                  <div className="text-sm  text-slate-50">
                    <p>Ready to pickup</p>
                    <p>Your order is ready for pickup</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*  */}
        <div className="hidden p-4 md:block w-[90%]">
          <div className="pb-6 px-4">
            <div className="flex items-center">
              <div className="flex items-center text-teal-600 relative">
                <div className="rounded-full transition duration-500 ease-in-out h-4 w-4 border-2 border-teal-600"></div>
                <div className="flex flex-col justify-center items-center absolute top-0 -ml-12 text-center mt-7 w-32 text-xs font-medium text-white">
                  <Image
                    src="/icons/order-confirm.svg"
                    width={21}
                    height={21}
                    alt="order-confirm"
                    className="w-[22px] h-[22px]"
                  />
                  <span className="mt-2">Order Confirmed</span>
                  <span className="text-white/60">
                    Your order is confirmed.
                  </span>
                </div>
              </div>
              <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-teal-600"></div>
              <div className="flex items-center text-white relative">
                <div className="rounded-full transition duration-500 ease-in-out h-4 w-4 border-2 bg-teal-600 border-teal-600"></div>
                <div className="flex flex-col justify-center items-center absolute top-0 -ml-12 text-center mt-7 w-32 text-xs font-medium text-white">
                  <Image
                    src="/icons/order-process.svg"
                    width={21}
                    height={21}
                    alt="order-process"
                  />
                  <span className="mt-2">Order Processed</span>
                  <span className="text-white/60">
                    We're getting your order ready
                  </span>
                </div>
              </div>
              <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300"></div>
              <div className="flex items-center text-gray-500 relative">
                <div className="rounded-full transition duration-500 ease-in-out h-4 w-4 border-2 border-gray-300"></div>
                <div className="flex flex-col justify-center items-center absolute top-0 -ml-12 text-center mt-7 w-32 text-xs font-medium text-white">
                  <Image
                    src="/icons/order-shipping.svg"
                    width={21}
                    height={21}
                    alt="order-shipping"
                  />
                  <span className="mt-2">On the way</span>
                  <span className="text-white/60">Your order is en route</span>
                </div>
              </div>
              <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300"></div>
              <div className="flex items-center text-gray-500 relative">
                <div className="rounded-full transition duration-500 ease-in-out h-4 w-4 border-2 border-gray-300"></div>
                <div className="flex flex-col justify-center items-center absolute top-0 -ml-12 text-center mt-7 w-32 text-xs font-medium text-white">
                  <Image
                    src="/icons/order-ready-delivery.svg"
                    width={21}
                    height={21}
                    alt="ready to delivery"
                  />
                  <span className="mt-2">Ready to pickup</span>
                  <span className="text-white/60">
                    Your order is ready for pickup
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*  */}
      </div>
    </>
  );
}
