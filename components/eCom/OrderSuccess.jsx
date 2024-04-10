import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

const OrderSuccess = ({ countdown }) => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-center w-full h-[90vh]">
        <div className="flex flex-col items-center justify-center">
          <div className="w-[20rem] h-[20rem] relative">
            <Image src="/icons/shoppingCart.png" alt="shopping cart" fill />
          </div>
          <div className="text-center my-4">
            <span className="block text-white text-sm">
              Your order has been placed.
            </span>
            <span className="block text-white text-sm">
              You will receives on email receive shortly!
            </span>
          </div>
          <div>
            <button
              onClick={() => router.replace('/user/orders')}
              type="button"
              className="bg-blue-600 text-white font-sm px-6 py-2 rounded-full"
            >
              Go to Order &nbsp;
              <span className="">{countdown}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
