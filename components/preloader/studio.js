import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export const StudioPreLoader = () => {
  return (
    <>
      <SkeletonTheme baseColor="#202124" highlightColor="#27292d">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-[0.5rem]">
            <Skeleton height={48} width={48} borderRadius={'100%'} />
            <div className="flex flex-col  gap-[0.3rem]">
              <Skeleton width={140} height={28} />
              <Skeleton width={84} height={16} />
            </div>
          </div>
          <Skeleton width={60} height={25} />
        </div>
        {/* Cards */}
        <div className="flex flex-col gap-5 mt-4">
          <div className="flex overflow-auto scroll-smooth gap-3">
            <div className="relative">
              <Skeleton width={288} height={164} />
              <div className="absolute bottom-[12%] left-[5%]">
                <div className="flex  items-center">
                  <Skeleton
                    height={16}
                    width={80}
                    baseColor="#48494f"
                    highlightColor="#707277"
                  />
                </div>
              </div>
            </div>
            <div className="relative">
              <Skeleton width={288} height={164} />
              <div className="absolute bottom-[12%] left-[5%]">
                <div className="flex  items-center">
                  <Skeleton
                    height={16}
                    width={80}
                    baseColor="#48494f"
                    highlightColor="#707277"
                  />
                </div>
              </div>
            </div>
            <div className="relative">
              <Skeleton width={288} height={164} />
              <div className="absolute bottom-[12%] left-[5%]">
                <div className="flex  items-center">
                  <Skeleton
                    height={16}
                    width={80}
                    baseColor="#48494f"
                    highlightColor="#707277"
                  />
                </div>
              </div>
            </div>
            <div className="relative">
              <Skeleton width={288} height={164} />
              <div className="absolute bottom-[12%] left-[5%]">
                <div className="flex  items-center">
                  <Skeleton
                    height={16}
                    width={80}
                    baseColor="#48494f"
                    highlightColor="#707277"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex overflow-auto gap-3">
            <div className="relative">
              <Skeleton width={288} height={164} />
              <div className="absolute bottom-[12%] left-[5%]">
                <div className="flex  items-center">
                  <Skeleton
                    height={16}
                    width={80}
                    baseColor="#48494f"
                    highlightColor="#707277"
                  />
                </div>
              </div>
            </div>
            <div className="relative">
              <Skeleton width={288} height={164} />
              <div className="absolute bottom-[12%] left-[5%]">
                <div className="flex  items-center">
                  <Skeleton
                    height={16}
                    width={80}
                    baseColor="#48494f"
                    highlightColor="#707277"
                  />
                </div>
              </div>
            </div>
            <div className="relative">
              <Skeleton width={288} height={164} />
              <div className="absolute bottom-[12%] left-[5%]">
                <div className="flex  items-center">
                  <Skeleton
                    height={16}
                    width={80}
                    baseColor="#48494f"
                    highlightColor="#707277"
                  />
                </div>
              </div>
            </div>
          </div>
          {/*  */}
        </div>
      </SkeletonTheme>
    </>
  );
};

export const StudioDetailsPreLoader = () => {
  return (
    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 bg-[#19191C] min-h-[inherit]">
      <SkeletonTheme baseColor="#202124" highlightColor="#27292d">
        <div className="flex gap-[1rem] items-center m-6 ">
          <Skeleton width={64} height={64} borderRadius={'100%'} />
          <div className="flex flex-col">
            <Skeleton height={20} width={83} />
            <Skeleton height={25} width={109} />
            <Skeleton height={16} width={91} />
          </div>
        </div>
        <Skeleton height={48} width={358} />
        <div className="w-full gap-4 mt-4 flex">
          <div className='w-[20%] md:w-[100px]'>
          <Skeleton height={25} />
          </div>
          <div className='w-[20%]  md:w-[100px]'>
          <Skeleton height={25} />
          </div>
          <div className='w-[20%] md:w-[100px] '>
          <Skeleton height={25} />
          </div>
          <div className='w-[20%]  md:w-[100px]'>
          <Skeleton height={25} />
          </div>
          
        </div>
        <div className="flex  flex-wrap gap-4 w-full justify-between items-center">
          <div className="flex flex-col items-center gap-[0.3rem] mt-5">
            <Skeleton width={90} height={90} borderRadius={10} />
            <Skeleton width={60} height={15} />
          </div>
          <div className="flex flex-col items-center gap-[0.3rem]">
            <Skeleton width={90} height={90} borderRadius={10} />
            <Skeleton width={60} height={15} />
          </div>
          <div className="flex flex-col items-center gap-[0.3rem]">
            <Skeleton width={90} height={90} borderRadius={10} />
            <Skeleton width={60} height={15} />
          </div>
          <div className="flex flex-col items-center gap-[0.3rem]">
            <Skeleton width={90} height={90} borderRadius={10} />
            <Skeleton width={60} height={15} />
          </div>
          <div className="flex flex-col items-center gap-[0.3rem]">
            <Skeleton width={90} height={90} borderRadius={10} />
            <Skeleton width={60} height={15} />
          </div>
          <div className="flex flex-col items-center gap-[0.3rem]">
            <Skeleton width={90} height={90} borderRadius={10} />
            <Skeleton width={60} height={15} />
          </div>
          <div className="flex flex-col items-center gap-[0.3rem]">
            <Skeleton width={90} height={90} borderRadius={10} />
            <Skeleton width={60} height={15} />
          </div>
          <div className="flex flex-col items-center gap-[0.3rem]">
            <Skeleton width={90} height={90} borderRadius={10} />
            <Skeleton width={60} height={15} />
          </div>
          <div className="flex flex-col items-center gap-[0.3rem]">
            <Skeleton width={90} height={90} borderRadius={10} />
            <Skeleton width={60} height={15} />
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};
