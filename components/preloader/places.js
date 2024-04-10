import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const PlacesPreLoader = () => {
  return (
    <>
      <SkeletonTheme baseColor="#202124" highlightColor="#27292d">
        <div className="w-full flex justify-between">
          <Skeleton width={145} height={32} />
          <Skeleton width={40} height={32} />
        </div>
        {/* Cards */}
        <div className="flex flex-col gap-5 mt-4">
          <div className="flex overflow-auto scroll-smooth gap-3">
            <div className="relative">
              <Skeleton width={288} height={164} />
              <div className="absolute bottom-[12%] left-[5%]">
                <div className="flex gap-[0.5rem] items-center">
                  <Skeleton
                    height={50}
                    width={50}
                    borderRadius={'100%'}
                    baseColor="#48494f"
                    highlightColor="#707277"
                  />
                  <div className="flex flex-col gap-[0.5 rem]">
                    <Skeleton
                      height={16}
                      width={82}
                      baseColor="#48494f"
                      highlightColor="#707277"
                    />
                    <Skeleton
                      height={15}
                      width={59}
                      baseColor="#48494f"
                      highlightColor="#707277"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Skeleton width={288} height={164} />
              <div className="absolute bottom-[12%] left-[5%]">
                <div className="flex gap-[0.5rem] items-center">
                  <Skeleton
                    height={50}
                    width={50}
                    borderRadius={'100%'}
                    baseColor="#48494f"
                    highlightColor="#707277"
                  />
                  <div className="flex flex-col gap-[0.5 rem]">
                    <Skeleton
                      height={16}
                      width={82}
                      baseColor="#48494f"
                      highlightColor="#707277"
                    />
                    <Skeleton
                      height={15}
                      width={59}
                      baseColor="#48494f"
                      highlightColor="#707277"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Skeleton width={288} height={164} />
              <div className="absolute bottom-[12%] left-[5%]">
                <div className="flex gap-[0.5rem] items-center">
                  <Skeleton
                    height={50}
                    width={50}
                    borderRadius={'100%'}
                    baseColor="#48494f"
                    highlightColor="#707277"
                  />
                  <div className="flex flex-col gap-[0.5 rem]">
                    <Skeleton
                      height={16}
                      width={82}
                      baseColor="#48494f"
                      highlightColor="#707277"
                    />
                    <Skeleton
                      height={15}
                      width={59}
                      baseColor="#48494f"
                      highlightColor="#707277"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Skeleton width={288} height={164} />
              <div className="absolute bottom-[12%] left-[5%]">
                <div className="flex gap-[0.5rem] items-center">
                  <Skeleton
                    height={50}
                    width={50}
                    borderRadius={'100%'}
                    baseColor="#48494f"
                    highlightColor="#707277"
                  />
                  <div className="flex flex-col gap-[0.5 rem]">
                    <Skeleton
                      height={16}
                      width={82}
                      baseColor="#48494f"
                      highlightColor="#707277"
                    />
                    <Skeleton
                      height={15}
                      width={59}
                      baseColor="#48494f"
                      highlightColor="#707277"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex overflow-auto gap-3">
            <div className="relative">
              <Skeleton width={288} height={164} />
              <div className="absolute bottom-[12%] left-[5%]">
                <div className="flex gap-[0.5rem] items-center">
                  <Skeleton
                    height={50}
                    width={50}
                    borderRadius={'100%'}
                    baseColor="#48494f"
                    highlightColor="#707277"
                  />
                  <div className="flex flex-col gap-[0.5 rem]">
                    <Skeleton
                      height={16}
                      width={82}
                      baseColor="#48494f"
                      highlightColor="#707277"
                    />
                    <Skeleton
                      height={15}
                      width={59}
                      baseColor="#48494f"
                      highlightColor="#707277"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Skeleton width={288} height={164} />
              <div className="absolute bottom-[12%] left-[5%]">
                <div className="flex gap-[0.5rem] items-center">
                  <Skeleton
                    height={50}
                    width={50}
                    borderRadius={'100%'}
                    baseColor="#48494f"
                    highlightColor="#707277"
                  />
                  <div className="flex flex-col gap-[0.5 rem]">
                    <Skeleton
                      height={16}
                      width={82}
                      baseColor="#48494f"
                      highlightColor="#707277"
                    />
                    <Skeleton
                      height={15}
                      width={59}
                      baseColor="#48494f"
                      highlightColor="#707277"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Skeleton width={288} height={164} />
              <div className="absolute bottom-[12%] left-[5%]">
                <div className="flex gap-[0.5rem] items-center">
                  <Skeleton
                    height={50}
                    width={50}
                    borderRadius={'100%'}
                    baseColor="#48494f"
                    highlightColor="#707277"
                  />
                  <div className="flex flex-col gap-[0.5 rem]">
                    <Skeleton
                      height={16}
                      width={82}
                      baseColor="#48494f"
                      highlightColor="#707277"
                    />
                    <Skeleton
                      height={15}
                      width={59}
                      baseColor="#48494f"
                      highlightColor="#707277"
                    />
                  </div>
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

export default PlacesPreLoader;
