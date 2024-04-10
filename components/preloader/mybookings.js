import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const MyBookingPreLoader = () => {
  return (
    <SkeletonTheme baseColor="#202124" highlightColor="#27292d">
      <div className=" flex flex-col gap-[1rem] w-full">
        <div className='md:flex md:flex-wrap w-full gap-2'>
            <BookingSkeletonCard />
            <BookingSkeletonCard />
            <BookingSkeletonCard />
            <BookingSkeletonCard />
            <BookingSkeletonCard />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default MyBookingPreLoader;
const BookingSkeletonCard=()=>{
  return (
    <div className="relative w-[48%] max-md:w-[90%]">
          <Skeleton height={245}></Skeleton>
          <div className="absolute top-[3%] left-[2%] w-full p-4">
            <div className="flex flex-col  w-full gap-2 ">
              <div className='flex w-full justify-between'>
                <div className='w-[60%]'>
              <Skeleton height={20}   baseColor="#48494f"
                highlightColor="#707277"/>
                </div>
                <div className='w-[20%]'>
              <Skeleton height={20}   baseColor="#48494f"
                highlightColor="#707277"/>
                </div>
              </div>
              <div className='flex gap-5 w-full'>
                <div className='w-[35%]'>
                  <Skeleton 
                    height={112}
                     baseColor="#48494f"
                highlightColor="#707277"
                  />
                </div>
                <div className='flex flex-col gap-1 w-[70%]'>
                  <div className='w-[40%]'>
                  <Skeleton 
                    height={15}
                     baseColor="#48494f"
                highlightColor="#707277"
                  />
                  </div>
                  <div className='w-[80%]'>
                  <Skeleton 
                    height={15}
                     baseColor="#48494f"
                highlightColor="#707277"
                  />
                  </div>
                  <div className='w-[60%]'>
                  <Skeleton 
                    height={15}
                     baseColor="#48494f"
                highlightColor="#707277"
                  />
                  </div>
                  <div className='w-[40%]'>
                  <Skeleton 
                    height={15}
                     baseColor="#48494f"
                highlightColor="#707277"
                  />
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-1 w-full'>
                <div className='flex justify-between w-full'>
                  <div className='w-[15%]'>
                  <Skeleton 
                    height={15}
                     baseColor="#48494f"
                highlightColor="#707277"
                  />
                  </div>
                  <div className='w-[35%]'>
                  <Skeleton 
                    height={15}
                     baseColor="#48494f"
                highlightColor="#707277"
                  />
                  </div>
                  <div className='w-[35%]'>
                  <Skeleton 
                    height={15}
                     baseColor="#48494f"
                highlightColor="#707277"
                  />
                  </div>
                </div>
                <div className='flex justify-between w-full'>
                  <div className='w-[15%]'>
                  <Skeleton 
                    height={15}
                     baseColor="#48494f"
                highlightColor="#707277"
                  />
                  </div>
                  <div className='w-[35%]'>
                  <Skeleton 
                    height={15}
                     baseColor="#48494f"
                highlightColor="#707277"
                  />
                  </div>
                  <div className='w-[35%]'>
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
    </div>
  )
}

export const MyOrdersPreLoader = () => {
  return (
    <SkeletonTheme baseColor="#202124" highlightColor="#27292d">
      <div className=" flex flex-col gap-[1rem] w-full">
        <OrderItemSkeleton />
        <OrderItemSkeleton />
        <OrderItemSkeleton />
      </div>
    </SkeletonTheme>
  );
};

const OrderItemSkeleton = () => {
  return (
    <div className="relative w-full">
          <Skeleton height={144}></Skeleton>
          <div className="absolute top-[0%] left-[2%] w-full">
            <div className="flex gap-4 w-full h-[144px] items-center  max-md:gap-6">
              <div className='w-[20%] max-md:w-[25%]'>
              <Skeleton
                height={96}
                baseColor="#48494f"
                highlightColor="#707277"
              />
              </div>
              <div className='flex w-full max-md:flex-col max-md:gap-1 md:gap-5'>
              <div className='flex flex-col w-[25%] justify-between max-md:hidden'>
                <Skeleton height={25} baseColor="#48494f"
                highlightColor="#707277"  />
                <Skeleton height={25}  baseColor="#48494f"
                highlightColor="#707277" />
              </div>
              <div className='flex flex-col w-[75%] justify-between md:hidden'>
                <Skeleton height={12} baseColor="#48494f"
                highlightColor="#707277"  />
                <Skeleton height={12}  baseColor="#48494f"
                highlightColor="#707277" />
              </div>
              <div className='flex flex-col w-[25%] max-md:hidden'>
                <Skeleton height={25} baseColor="#48494f"
                highlightColor="#707277"  />
                <Skeleton height={25} baseColor="#48494f"
                highlightColor="#707277"  />
              </div>
              <div className='flex flex-col w-[75%] md:hidden'>
                <Skeleton height={12} baseColor="#48494f"
                highlightColor="#707277"  />
              </div>
              <div className='flex flex-col w-[25%] justify-between max-md:hidden'>
                <Skeleton height={25} baseColor="#48494f"
                highlightColor="#707277"  />
                <Skeleton height={25}  baseColor="#48494f"
                highlightColor="#707277" />
              </div>
              <div className='flex flex-col w-[75%] justify-between md:hidden'>
                <Skeleton height={12} baseColor="#48494f"
                highlightColor="#707277"  />
                <Skeleton height={12}  baseColor="#48494f"
                highlightColor="#707277" />
              </div>
              </div>
            </div>
          </div>
        </div>
  )
}