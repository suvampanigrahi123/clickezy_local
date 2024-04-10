import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { getLocalStorage } from '../../utils/localStore';
import useCart from '../../hooks/useEComCart';

const CartQuantityHeader = () => {
  const user = getLocalStorage('auth_token');
  const { quantity } = useSelector((state) => state.cart);
  // call the hook for cart quantity
  useCart(true);
  return (
    <>
      <Link href="/store/cart">
        <div className="relative flex">
          <ShoppingCartIcon className="h-6 w-6 text-white" />
          {quantity && user && (
            <span className="absolute right-0 top-0 rounded-full bg-red-600 w-4 h-4 top right p-0 m-0 text-white font-mono text-sm  leading-tight text-center">
              {quantity || 0}
            </span>
          )}
        </div>
      </Link>
    </>
  );
};

export default CartQuantityHeader;
