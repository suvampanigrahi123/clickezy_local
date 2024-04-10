import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

const EmptyCart = () => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-center w-full h-[60vh]">
        <div className="flex flex-col items-center justify-center">
          <div className="w-[15rem] h-[10rem] relative">
            <Image src="/icons/empty_cart.svg" alt="empty cart" fill />
          </div>
          <div className="text-center my-4">
            <span className="block text-white text-sm">Your Cart is Empty</span>
            <span className="block text-white text-sm">
              Add something to make me happy!
            </span>
          </div>
          <div>
            <button
              onClick={() => router.replace('/store')}
              type="button"
              className="bg-blue-600 text-white font-sm p-2 rounded-md"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmptyCart;
