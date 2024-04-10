import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import SecondaryLayout from '../../components/layout/SecondaryLayout';
import Header from '../../components/common/Header';
import { useRouter } from 'next/router';
import AuthProvider from '../../components/common/AuthProvider';
import { useUser } from '../../context/UserContext';
import useSWR from 'swr';
import * as api from '../../services/storeService';
import CartProduct from '../../components/eCom/CartProduct';
import { useDispatch } from 'react-redux';
import { setCartQuantity } from '../../redux/eComSlices/cartSlice';
import ProductPriceDetails from '../../components/eCom/ProductPriceDetails';
import { COMMON } from '../../constants/const';
import Image from 'next/image';

export default function DashboardMyBooking() {
  const router = useRouter();
  const { userId } = useUser();
  const dispatch = useDispatch();
  const { data: cart, mutate: mutation } = useSWR(
    userId && ['/store/getCart' + userId],
    () => api.getCart(userId),
    [] // initial data set to empty
  );
  useEffect(() => {
    dispatch(setCartQuantity(cart?.carts?.length));
  }, [cart]);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SecondaryLayout>
      <AuthProvider>
        <Header>
          <div className="flex flex-col justify-start items-center self-stretch bg-[#010201]">
            <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 py-5">
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative">
                <button onClick={handleGoBack}>
                  <ArrowLeftIcon className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex flex-col justify-center items-start flex-grow flex-shrink-0 relative self-stretch gap-1">
                <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                  Cart
                </p>
              </div>
            </div>
          </div>
        </Header>
        {/* Page Body */}

        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 md:px-44 md:pb-28 lg:px-33">
          <div className="hidden md:flex flex-col justify-start items-start self-stretch">
            <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 pt-12 pb-8">
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
                <button onClick={handleGoBack}>
                  <ArrowLeftIcon className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
                <p className="flex-grow-0 flex-shrink-0 text-xl font-medium text-left text-white">
                  Cart
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 w-full">
            {/* cart details */}
            <div className="flex w-full flex-col md:flex-row justify-between">
              {cart && cart.carts.length > 0 ? (
                <>
                  <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-8 px-4 py-6">
                    <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-3">
                      {cart.carts.map((pro, i) => (
                        <div className="w-full" key={i}>
                          <CartProduct
                            product={pro}
                            mutate={mutation}
                            page="cart"
                          />
                          <hr className="w-full border-white/5" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <ProductPriceDetails
                      item={cart?.carts}
                      discountPrice={cart?.total_discounted_amount}
                      totalPrice={cart?.total_original_amount}
                    />
                    <div className="flex justify-center bg-[#1D1D21] md:bg-transparent p-2 md:p-0">
                      <div className="flex justify-between w-full items-center px-3 lg:justify-end">
                        <div className="text-white text-xl font-bold lg:hidden">
                          {COMMON.RUPEE_SYMBOL +
                            ' ' +
                            cart?.total_discounted_amount}
                        </div>
                        <Link
                          href="/store/checkout"
                          className="flex w-1/2 justify-center items-center p-1 rounded-md gap-[5px]  bg-blue-700 hover:bg-blue-800"
                        >
                          <p className="flex-grow-0 flex-shrink-0 text-lg  text-left text-white">
                            Checkout
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center w-full h-[60vh]">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-[15rem] h-[10rem] relative">
                        <Image
                          src="/icons/empty_cart.svg"
                          alt="empty cart"
                          fill
                        />
                      </div>
                      <div className="text-center my-4">
                        <span className="block text-white text-sm">
                          Your Cart is Empty
                        </span>
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
              )}
            </div>
            {/* related frame */}
            {/* <RelatedFrame /> */}
          </div>
        </div>
      </AuthProvider>
    </SecondaryLayout>
  );
}
