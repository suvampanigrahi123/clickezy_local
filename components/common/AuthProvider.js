import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isAuth } from '../../utils/isAuth';
const AuthProvider = ({ children }) => {
  const user = isAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user]);

  return <>{children}</>;
};

export default AuthProvider;
