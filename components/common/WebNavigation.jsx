'use client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CurrentLocation from '../../components/common/CurrentLocation';
import { useUser } from '../../context/UserContext';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { getLocalStorage } from '../../utils/localStore';
import CartQuantityHeader from '../eCom/CartQuantityHeader';
import { memo } from 'react';
import Image from 'next/image';
function WebNavigation() {
  const router = useRouter();
  const { user, userId } = useUser();
  const localUser = getLocalStorage('auth_token');

  return (
    <>
      <header className="w-full min-h-[64px] hidden md:flex flex-col justify-start items-start py-4 px-16 bg-[#010201] shadow-md fixed top-0 z-50">
        <div className="flex justify-start items-center self-stretch flex-grow gap-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex justify-start items-center relative gap-12"
          >
            <p className="flex-grow-0 flex-shrink-0 text-xl font-medium capitalize">
              <span className="flex-grow-0 flex-shrink-0 text-xl font-medium capitalize text-[#1185e0]">
                Click
              </span>
              <span className="flex-grow-0 flex-shrink-0 text-xl font-medium capitalize text-white">
                ezy
              </span>
            </p>
          </Link>
          {/* Menu */}
          <div className="flex justify-start items-center self-stretch flex-grow-0 gap-4">
            <Link
              href="/"
              className={`px-2 text-sm ${
                router.pathname === '/'
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-300 transition-colors'
              }`}
            >
              Home
            </Link>
            <Link
              href="/photography/category"
              className={`px-2 text-sm ${
                router.pathname === '/photography/category'
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-300 transition-colors'
              }`}
            >
              Photos
            </Link>
            <Link
              href="/store"
              className={`px-2 text-sm ${
                router.pathname === '/store'
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-300 transition-colors'
              }`}
            >
              Store
            </Link>
          </div>
          {/* Search Input */}

          <label className="relative flex justify-end items-center self-stretch flex-grow flex-shrink-0 gap-2">
            {router.pathname !== '/search' && (
              <Link
                href="/search"
                className="flex items-center gap-2 text-white/40 text-sm md:bg-[#19191c] self-stretch flex-grow border border-transparent rounded-md h-10 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:ring-1"
              >
                {/* <SearchIcon /> */}
                <MagnifyingGlassIcon className="w-4 h-4 text-white" />
                Search
              </Link>
            )}
          </label>
          {/* Others */}
          <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-5">
            <CurrentLocation />
            <Link
              href={user && userId ? '/booking' : '/login'}
              className="btn-primary self-stretch text-sm rounded-xl font-medium px-4 py-2"
            >
              Book Now
            </Link>
            {/* show the cart icon for all /store */}
            {router.pathname.startsWith('/store') && <CartQuantityHeader />}

            <Link
              href={user && userId && localUser ? '/user/my_booking' : '/login'}
            >
              {localUser && user && user.user_image ? (
                <div className="relative">
                  <Image
                    className="w-8 h-8 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                    src={user.user_image}
                    alt="Bordered avatar"
                    width={100}
                    height={100}
                  />
                </div>
              ) : (
                <div className="relative w-8 h-8 overflow-hidden bg-gray-500 rounded-full dark:bg-gray-600">
                  <svg
                    className="absolute w-12 h-12 text-gray-400 -left-1"
                    fill="currentColor"
                    viewBox="0 0 24 25"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              )}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
export default memo(WebNavigation);
