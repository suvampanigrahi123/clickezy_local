import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export const BookingDetailsSkeleton = () => {
  return (
    <div className="max-h-[100vh] h-[90vh] overflow-hidden max-w-full">
      <SkeletonTheme baseColor="#202124" highlightColor="#27292d">
        <div className="relative max-md:w-[90%] md:max-w-2xl md:m-auto md:pb-28 h-[177px] m-auto">
          <Skeleton height={177}  />
          <div className="flex flex-col w-full absolute top-0 left-0 h-[177px] p-5">
            <div className='flex gap-5'>
              <div className='w-16 '>
              <Skeleton
            height={64}
            baseColor="#48494f"
                  highlightColor="#707277"
                  borderRadius={'100%'}
          />
              </div>
              <div className='flex flex-col w-full'>
                <div className='w-[20%]'>
                <Skeleton
            height={15}
            baseColor="#48494f"
            highlightColor="#707277"
          />
                </div>
                <div className='w-[50%]'>
                <Skeleton
            height={15}
            baseColor="#48494f"
            highlightColor="#707277"
          />
                </div>
                <div className='w-[20%]'>
                <Skeleton
            height={15}
            baseColor="#48494f"
            highlightColor="#707277"
          />
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-1 w-full'>
            <div className='flex gap-5 w-full'>
                  <div className='w-[5%]'>
                  <Skeleton 
                    height={15}
                     baseColor="#48494f"
                highlightColor="#707277"
                  />
                  </div>
                  <div className='w-[15%] max-md:w-[25%]'>
                  <Skeleton 
                    height={15}
                     baseColor="#48494f"
                highlightColor="#707277"
                  />
                  </div>
                  <div className='w-[15%] max-md:w-[25%]'>
                  <Skeleton 
                    height={15}
                     baseColor="#48494f"
                highlightColor="#707277"
                  />
                  </div>
                </div>
                <div className='flex gap-5 w-full'>
                  <div className='w-[5%]'>
                  <Skeleton 
                    height={15}
                     baseColor="#48494f"
                highlightColor="#707277"
                  />
                  </div>
                  <div className='w-[15%] max-md:w-[25%]'>
                  <Skeleton 
                    height={15}
                     baseColor="#48494f"
                highlightColor="#707277"
                  />
                  </div>
                  <div className='w-[15%] max-md:w-[25%]'>
                  <Skeleton 
                    height={15}
                     baseColor="#48494f"
                highlightColor="#707277"
                  />
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div className="m-auto max-md:w-[90%] md:md:max-w-2xl mt-4">
          <Skeleton
            height={40}
            baseColor="#48494f"
            highlightColor="#707277"
          />
        </div>
        <div className="flex flex-col m-auto max-md:w-[90%] md:md:max-w-2xl mt-8">
          <div className='w-full pl-4 mb-2'>
          <div className='w-[25%]'>
          <Skeleton
            height={20}
            baseColor="#48494f"
            highlightColor="#707277"
          />
        </div>
        </div>
          <div className="flex flex-col gap-4 w-full">
            <InformationCard />
            <InformationCard />
            <InformationCard />
            <InformationCard />
            <InformationCard />
            <InformationCard />
            <InformationCard />
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default BookingDetailsSkeleton;

const InformationCard = () => {
  return (
    <div className="w-full max-md:w-[90%] relative m-auto">
              <Skeleton height={50}  className="m-auto" />
              <div className="w-full flex justify-between absolute top-0 left-0 items-center h-[50px] px-4 ">
                <div className='w-[25%]'>
                <Skeleton
            height={20}
            baseColor="#48494f"
            highlightColor="#707277"
          />
                </div>
                <div className='w-[25%]'>
                <Skeleton
            height={20}
            baseColor="#48494f"
            highlightColor="#707277"
          />
                </div>
              
              </div>
            </div>
  )
}