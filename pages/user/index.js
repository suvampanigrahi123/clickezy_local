import Link from 'next/link';
import useSWR from 'swr';
import PrimaryLayout from '../../components/layout/PrimaryLayout';
import Header from '../../components/common/Header';
import * as api from '../../services/userService';
import ArrowLeftIcon from '../../components/common/icons/arrowlefticon';
import { useRouter } from 'next/router';
import AuthProvider from '../../components/common/AuthProvider';

import { useUser } from '../../context/UserContext';
import { useEffect } from 'react';
import { profileLabel } from '../../constants/labelText';
import MyProfile from '../../components/common/MyProfile';

export default function Dashboard() {
  const router = useRouter();
  const { userId: id, setLogout, setLogin } = useUser();
  const { data, error } = useSWR(id && ['/api/user/', id], () =>
    api.getUserProfileDetails(id),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  // error handling
  if (error) {
    setLogout();
    router.replace('/login');
  }
  useEffect(() => {
    if (data && data.statusCode === 200) {
      setLogin(data);
    }
  }, [data]);

  return (
    <PrimaryLayout>
      <AuthProvider>
        <Header>
          <div className="flex flex-col justify-start items-start bg-[#010201]">
            <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 pl-5 py-4">
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
                <Link href="/">
                  <ArrowLeftIcon height={24} width={24} />
                </Link>
              </div>
              <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
                <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                  {profileLabel.heading}
                </p>
              </div>
            </div>
          </div>
        </Header>

        {/* Page Body */}
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 bg-[#19191c] w-screen md:max-w-2xl md:m-auto">
          <div className="w-full md:flex">
            <MyProfile />
          </div>
        </div>
      </AuthProvider>
    </PrimaryLayout>
  );
}
