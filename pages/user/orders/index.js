import Link from 'next/link';
import useSWR from 'swr';
import Header from '../../../components/common/Header';
import * as api from '../../../services/storeService';
import ArrowLeftIcon from '../../../components/common/icons/arrowlefticon';
import AuthProvider from '../../../components/common/AuthProvider';
import MyBookingPreLoader from '../../../components/preloader/mybookings';
import { useUser } from '../../../context/UserContext';
import ProfileLayout from '../../../components/layout/ProfileLayout';
import OrderList from '../../../components/eCom/OrderList';
import { CubeIcon } from '@heroicons/react/24/outline';

export default function DashboardMyBooking() {
  const { userId: id } = useUser();
  const { data, isLoading } = useSWR(id && ['/api/get/orders/list'], () =>
    api.getOrders(id)
  );

  const order = data?.data;

  return (
    <ProfileLayout>
      <AuthProvider>
        <header className="flex flex-col justify-start items-start bg-[#010201] md:bg-transparent md:border-b md:border-white/10 min-h-[64px] md:min-h-0">
          <div className="flex flex-col justify-start items-start self-stretch">
            <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 pl-5 md:px-0 py-4 md:pt-0">
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
                <Link href={'/user'} className="flex md:hidden">
                  <ArrowLeftIcon height={24} width={24} />
                </Link>
                <CubeIcon className="hidden md:flex w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
                <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                  My Orders
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4 pb-4 w-screen md:w-full md:pb-28">
          {isLoading || data === null ? (
            <MyBookingPreLoader />
          ) : order?.length > 0 ? (
            <>
              {order?.map((item, index) => (
                <div
                  className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-3 px-6 md:p-0"
                  key={index}
                >
                  <OrderList item={item} />
                </div>
              ))}
            </>
          ) : (
            <div className="flex self-stretch justify-center py-20 text-[#9b9191]">
              No Order found
            </div>
          )}
        </div>
      </AuthProvider>
    </ProfileLayout>
  );
}
