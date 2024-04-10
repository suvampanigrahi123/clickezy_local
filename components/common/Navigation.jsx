import Link from 'next/link';

import { useRouter } from 'next/router';
import {
  CalendarDaysIcon,
  HomeIcon,
  PhotoIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import { useUser } from '../../context/UserContext';
import { getLocalStorage } from '../../utils/localStore';
export default function Navigation() {
  const router = useRouter();
  const { user, userId } = useUser();
  const localUser = getLocalStorage('auth_token');
  return (
    <>
      {/* Page Header */}
      <header className="md:hidden flex flex-col justify-start items-start bg-[#010201] fixed bottom-0 z-50 w-96- w-full shadow-md">
        <div className="flex justify-start items-center self-stretch gap-2 px-2">
          <Link
            href="/"
            className="flex flex-col justify-center items-center self-stretch flex-grow relative py-3 gap-1 w-1/5"
          >
            <HomeIcon
              className={`w-6 ${
                router.pathname === '/' ? 'text-blue-500' : 'text-white'
              }`}
            />
            <p
              className={`text-sm ${
                router.pathname === '/' ? 'text-white/50' : 'text-white/50'
              }`}
            >
              Home
            </p>
          </Link>

          <Link
            href="/photography/category"
            className="flex flex-col justify-center items-center self-stretch flex-grow relative py-3 gap-1 w-1/5"
          >
            <PhotoIcon
              className={`w-6 ${
                router.asPath.split('/')[1] === 'photography'
                  ? 'text-blue-500'
                  : 'text-white'
              }`}
            />
            <p
              className={`text-sm ${
                router.asPath.split('/')[1] === 'photography'
                  ? 'text-white/50'
                  : 'text-white/50'
              }`}
            >
              Photos
            </p>
          </Link>

          <Link
            href={user && userId ? '/booking' : '/login'}
            className="flex flex-col justify-center items-center self-stretch flex-grow relative py-3 gap-1 w-1/5"
          >
            <CalendarDaysIcon
              className={`w-6 ${
                router.asPath.split('/')[1] === 'booking'
                  ? 'text-blue-500'
                  : 'text-white'
              }`}
            />
            <p
              className={`text-sm truncate ${
                router.asPath.split('/')[1] === 'booking'
                  ? 'text-white/50'
                  : 'text-white/50'
              }`}
            >
              Book Now
            </p>
          </Link>
          <Link
            href="/store"
            className="flex flex-col justify-center items-center self-stretch flex-grow relative py-3 gap-1 w-1/5"
          >
            <ShoppingBagIcon
              className={`w-6 ${
                router.asPath.split('/')[1] === 'store'
                  ? 'text-blue-500'
                  : 'text-white'
              }`}
            />
            <p
              className={`text-sm ${
                router.asPath.split('/')[1] === 'store'
                  ? 'text-white/50'
                  : 'text-white/50'
              }`}
            >
              Store
            </p>
          </Link>
          <Link
            href={user && userId ? '/user' : '/login'}
            className="flex flex-col justify-center items-center self-stretch flex-grow relative py-3 gap-1 w-1/5"
          >
            <UserCircleIcon
              className={`w-6 ${
                router.asPath.split('/')[1] === 'user'
                  ? 'text-blue-500'
                  : 'text-white'
              }`}
            />
            <p
              className={`text-sm ${
                router.asPath.split('/')[1] === 'user'
                  ? 'text-white/50'
                  : 'text-white/50'
              }`}
            >
              {user && userId && localUser ? 'Me' : 'User'}
            </p>
          </Link>
        </div>
      </header>
    </>
  );
}
