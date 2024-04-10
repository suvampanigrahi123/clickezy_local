import dynamic from 'next/dynamic';
import WebNavigation from '../common/WebNavigation';
const SecondaryLayout = ({ children }) => {
  const DynamicFooter = dynamic(() => import('../common/Footer'), {
    loading: () => 'Loading...',
  });

  return (
    <>
      <main className="max-w-sm- mx-auto md:max-w-full min-h-screen bg-[#19191C] shadow-xl">
        <div className="flex flex-col flex-grow relative md:p-0 md:pt-[72px]">
          <WebNavigation />
          <div className="relative min-h-screen">{children}</div>
          <div className="hidden md:flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0">
            <DynamicFooter />
          </div>
        </div>
      </main>
    </>
  );
};

export default SecondaryLayout;
