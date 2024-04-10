import React from 'react';
import MyProfile from '../common/MyProfile';
import WebNavigation from '../common/WebNavigation';

const ProfileLayout = ({ children }) => {
  return (
    <>
      <main className="max-w-full min-h-screen mx-auto bg-[#19191C] shadow-xl">
        <div className="flex flex-col flex-grow relative">
          <WebNavigation />
          <div className="flex md:justify-center relative min-h-screen w-full md:max-w-screen-lg md:m-auto md:py-[72px]">
            <div className="flex w-full self-stretch md:gap-10 md:pt-6">
              <div className="hidden md:flex flex-col self-stretch min-w-[280px] max-w-[280px]">
                <MyProfile />
              </div>
              <div className="flex flex-col self-stretch gap-6 md:gap-4 w-full">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProfileLayout;
