import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const DefaultEquipmentLoader = () => {
  return (
    <>
      <SkeletonTheme baseColor="#202124" highlightColor="#27292d">
        {new Array(3).fill(0).map((_, i) => (
          <div className="w-full flex" key={i}>
            <Skeleton height={20} width={20} borderRadius={'100%'} />
            <div className="ml-3 w-[70%]">
              <Skeleton height={20} />
            </div>
          </div>
        ))}
      </SkeletonTheme>
    </>
  );
};

export default DefaultEquipmentLoader;
