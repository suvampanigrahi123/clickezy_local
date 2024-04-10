import * as api from '../services/storeService';
import { useUser } from '../context/UserContext';
import useSWR from 'swr';
import { useDispatch } from 'react-redux';
import { setCartQuantity } from '../redux/eComSlices/cartSlice';
import { useEffect } from 'react';
const useCart = (callHook) => {
  const dispatch = useDispatch();
  const { userId } = useUser();
  const { data: cart } = useSWR(
    userId && callHook && ['/store/getCart' + userId],
    () => api.getCart(userId)
  );
  const qant = cart?.carts.length;
  useEffect(() => {
    dispatch(setCartQuantity(cart?.carts.length));
  }, [qant]);
};

export default useCart;
