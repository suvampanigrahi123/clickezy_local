import LocationPopup from '../common/LocationPopup';
import { memo } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import useWindowSize from '../../hooks/useWindowSize';
const PrimaryLayout = memo(({ children }) => {
  const router = useRouter();
  const windowSize = useWindowSize();
  const DynamicFooter = dynamic(() => import('../common/Footer'));
  const DynamicMobileNav = dynamic(() => import('../common/Navigation'));
  const WebNavigation = dynamic(() => import('../common/WebNavigation'));
  return (
    <>
      <main className="max-w-sm- mx-auto md:max-w-full min-h-screen bg-[#19191C] shadow-xl">
        <div className="flex flex-col flex-grow relative pb-16 md:p-0 md:pt-[72px]">
          {windowSize?.innerWidth > 768 && <WebNavigation />}
          {windowSize?.innerWidth < 768 && <DynamicMobileNav />}
          <section>{children}</section>
          <div
            className={`${
              router.pathname === '/' || router.pathname === '/store'
                ? 'block'
                : 'hidden'
            } md:flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0`}
          >
            <DynamicFooter />
          </div>
        </div>
      </main>
      <LocationPopup />
    </>
  );
});

export default PrimaryLayout;
