import { COMMON } from '../constants/const';
import { getLocalStorage } from './localStore';

export const isAuth = () => {
  if (typeof window !== 'undefined') {
    const user = getLocalStorage(COMMON.USER);
    const authToken = getLocalStorage(COMMON.AUTH_TOKEN);
    if (!user || !authToken) {
      return false;
    }

    if (user && authToken) {
      return {
        isAuth: true,
        user,
      };
    }
  }
  return false;
};
