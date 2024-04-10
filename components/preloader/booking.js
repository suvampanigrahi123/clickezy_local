import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const BookingPreLoader = () => {
  return (
    <SkeletonTheme baseColor="#202124" highlightColor="#27292d">
      <div className="flex flex-col gap-[2rem]">
        <div>
          <Skeleton height={20} width={80} />
          <Skeleton height={40} width={330} />
        </div>
        <div>
          <Skeleton height={20} width={80} />
          <Skeleton height={40} width={330} />
        </div>
        <div>
          <Skeleton height={20} width={80} />
          <Skeleton height={40} width={330} />
        </div>
        <div className="flex items-center w-full justify-between">
          <div className="">
            <Skeleton height={20} width={60} />
            <Skeleton height={40} width={160} />
          </div>
          <div className="">
            <Skeleton height={20} width={60} />
            <Skeleton height={40} width={160} />
          </div>
        </div>
        <div>
          <Skeleton height={20} width={80} />
          <Skeleton height={40} width={330} />
        </div>
        <div className="flex items-center w-full justify-between">
          <div className="">
            <Skeleton height={20} width={60} />
            <Skeleton height={40} width={160} />
          </div>
          <div className="">
            <Skeleton height={20} width={60} />
            <Skeleton height={40} width={160} />
          </div>
        </div>
        <div>
          <Skeleton height={200} width={320} />
        </div>
        <div className="flex justify-center items-center">
          <Skeleton height={40} width={280} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default BookingPreLoader;
