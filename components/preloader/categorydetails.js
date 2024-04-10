import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export const CategoryDetailsSkeleton = () => {
  return (
    <div className="max-h-[100vh] h-[90vh] overflow-hidden max-w-full">
      <SkeletonTheme baseColor="#202124" highlightColor="#27292d">
        <div className="flex justify-around gap-4 overflow-auto">
          <div className="flex flex-col justify-center items-center">
            <Skeleton
              height={96}
              width={96}
              borderRadius={'100%'}
              baseColor="#48494f"
              highlightColor="#707277"
            />
            <Skeleton
              width={80}
              height={15}
              baseColor="#48494f"
              highlightColor="#707277"
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <Skeleton
              height={96}
              width={96}
              borderRadius={'100%'}
              baseColor="#48494f"
              highlightColor="#707277"
            />
            <Skeleton
              width={80}
              height={15}
              baseColor="#48494f"
              highlightColor="#707277"
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <Skeleton
              height={96}
              width={96}
              borderRadius={'100%'}
              baseColor="#48494f"
              highlightColor="#707277"
            />
            <Skeleton
              width={80}
              height={15}
              baseColor="#48494f"
              highlightColor="#707277"
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <Skeleton
              height={96}
              width={96}
              borderRadius={'100%'}
              baseColor="#48494f"
              highlightColor="#707277"
            />
            <Skeleton
              width={80}
              height={15}
              baseColor="#48494f"
              highlightColor="#707277"
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <Skeleton
              height={96}
              width={96}
              borderRadius={'100%'}
              baseColor="#48494f"
              highlightColor="#707277"
            />
            <Skeleton
              width={80}
              height={15}
              baseColor="#48494f"
              highlightColor="#707277"
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <Skeleton
              height={96}
              width={96}
              borderRadius={'100%'}
              baseColor="#48494f"
              highlightColor="#707277"
            />
            <Skeleton
              width={80}
              height={15}
              baseColor="#48494f"
              highlightColor="#707277"
            />
          </div>
        </div>
        <CategoryBoxSkeleton />
      </SkeletonTheme>
    </div>
  );
};

export default CategoryDetailsSkeleton;

export const CategoryBoxSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-[352px] m-auto">
        <Skeleton
          width={352}
          height={224}
          baseColor="#48494f"
          highlightColor="#707277"
          className="m-auto"
        />
        <div className="w-full justify-between items-center flex">
          <Skeleton
            width={60}
            height={15}
            baseColor="#48494f"
            highlightColor="#707277"
          />
          <Skeleton
            width={60}
            height={15}
            baseColor="#48494f"
            highlightColor="#707277"
          />
        </div>
      </div>
      <div className="w-[352px] m-auto">
        <Skeleton
          width={352}
          height={224}
          baseColor="#48494f"
          highlightColor="#707277"
          className="m-auto"
        />
        <div className="w-full justify-between items-center flex">
          <Skeleton
            width={60}
            height={15}
            baseColor="#48494f"
            highlightColor="#707277"
          />
          <Skeleton
            width={60}
            height={15}
            baseColor="#48494f"
            highlightColor="#707277"
          />
        </div>
      </div>
    </div>
  );
};
