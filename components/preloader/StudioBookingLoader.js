import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const StudioBookingLoader = () => {
  return (
    <>
      <SkeletonTheme baseColor="#202124" highlightColor="#27292d">
        <div className="w-full flex">
          <div className="ml-3 w-[90%]">
            <Skeleton height={40} />
          </div>
        </div>
      </SkeletonTheme>
    </>
  );
};

export default StudioBookingLoader;
