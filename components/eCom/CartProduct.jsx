import * as api from '../../services/storeService';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { COMMON } from '../../constants/const';
import { calculateShippingPrice } from '../../utils/ShippingPrice';

function IncDecCounter({ product, unit, mutate, page }) {
  const [num, setNum] = useState(unit || 0);
  useEffect(() => {
    const editQuantity = async () => {
      const payload = {
        total_quantity: num,
        cart_item_id: product?.cart_item_id,
      };
      try {
        const c = await api.editQuantity(payload);
        if (c?.status === 'success') {
          mutate();
          toast.success('Quantity updated successfully', {
            id: 'cart_item_id',
          });
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Some error occured', {
          id:'error-message'
        })
      }
    };
    if (product && unit !== num) {
      editQuantity();
    }
  }, [num]);

  const incNum = (e) => {
    e.preventDefault();
    if (num < 10) {
      setNum((prev) => Number(prev) + 1);
    }
  };
  const decNum = (e) => {
    e.preventDefault();
    if (num > 1) {
      setNum((prev) => Number(prev) - 1);
    }
  };
  const handleChange = (e) => {
    if (e.target.value <= 10) {
      setNum(e.target.value);
    } else {
      toast.error('We cannot deliver more than 10');
    }
  };
  return (
    <>
      <div className="mt-1">
        <label
          htmlFor="search"
          className="mb-2 text-sm font-medium text-white sr-only "
        ></label>
        {page === 'checkout' && (
          <div className="text-white/60 text-sm">
            Quantity:
            <span>{unit}</span>
          </div>
        )}
        {page === 'cart' && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
              <MinusIcon className="h-4 w-4 text-white" onClick={decNum} />
            </div>
            <input
              type="text"
              className="formInput h-10 w-36 text-center"
              placeholder="0"
              value={unit}
              onChange={handleChange}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3  cursor-pointer">
              <PlusIcon className="h-4 w-4 text-white" onClick={incNum} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const CartProduct = ({ product, mutate, page }) => {
  const unit = product && product.total_quantity;
  const defaultImage = product && product.product_image;
  const name = product && product.product_name;
  const originalPrice = product && product.original_price;
  const discountedPrice = product && product.discounted_price;
  const discountPercentage = product && product.percentage;
  const shippingAvailable = product && product.isShippingAvailable;
  const calShippingPrice = product && product.weight_price;
  const productWeight = product && product.product_weight;
  const shippingPrice = calculateShippingPrice(
    calShippingPrice,
    productWeight,
    unit
  );

  const deleteCart = async (product) => {
    try {
      const d = await api.deleteCart(product.cart_item_id);
      if (d && d?.status === 'success') {
        mutate();
        toast.success('deleted successfully');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div
        className={`flex justify-start items-center p-3 self-stretch flex-grow-0 flex-shrink-0 gap-4 bg-[#25252A] ${
          page === 'checkout' && !shippingAvailable && 'border-2 border-red-500'
        }`}
      >
        <Link
          href={{
            pathname: '/store/product-details',
            query: {
              product_name: product.product_name,
              product: product.product_id,
            },
          }}
          className="w-[120px] h-[150px] aspect-w-9 aspect-h-3 md:aspect-w-16 md:aspect-h-2 overflow-hidden rounded"
        >
          <Image
            src={defaultImage}
            className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
            width={120}
            height={150}
            alt=""
          />
        </Link>
        <div className="flex flex-col justify-between items-start self-stretch flex-grow">
          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
            <div className="flex justify-between w-full pr-3">
              <span className="flex-grow-0 w-[90%] flex-shrink-0 text-xs font-medium text-left uppercase text-white/[0.64]">
                {name}
                {/* {product?.product_type} */}
              </span>
              {page === 'cart' && (
                <button type="button" onClick={() => deleteCart(product)}>
                  <TrashIcon className="h-5 w-5 text-red-400" />
                </button>
              )}
            </div>

            {/* <p className="self-stretch flex-grow-0 flex-shrink-0 w-[222px] text-base font-medium text-left text-white">
            {name}
          </p> */}
            <ul className="self-stretch flex-grow-0 flex-shrink-0 w-[222px] text-sm text-left text-white">
              {Object.values(product.variation_name).map((o, index) => (
                <li key={index}>{o}</li>
              ))}
            </ul>
            <div className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white block">
              <span className="text-lg">
                {COMMON.RUPEE_SYMBOL + Math.round(discountedPrice)}
              </span>
              {discountPercentage > 0 && (
                <>
                  <span className="ml-2 line-through text-gray-500 font-normal">
                    {COMMON.RUPEE_SYMBOL + Math.round(originalPrice)}
                  </span>
                  <span className="ml-2 font-normal text-blue-500 text-[.85rem]">
                    {discountPercentage}% off
                  </span>
                </>
              )}
            </div>
          </div>
          <IncDecCounter
            product={product}
            unit={unit}
            mutate={mutate}
            page={page}
          />
          <div className="mt-2 text-white text-sm">
            {page === 'checkout' && (
              <span>
                {COMMON.RUPEE_SYMBOL + ' ' + shippingPrice} Delivery charge
              </span>
            )}
          </div>
        </div>
      </div>
      <>
        {page === 'checkout' && !shippingAvailable && (
          <span className="text-red-500 text-xs flex justify-end">
            Not deliverable
          </span>
        )}
      </>
    </>
  );
};

export default CartProduct;
