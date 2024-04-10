import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const SearchPreloader = () => {
  return (
    <>
      <SkeletonTheme baseColor="#202124" highlightColor="#27292d">
        {/* Cards */}
        <div className="flex flex-col gap-5 mt-4">
                  {/* <div className="flex overflow-auto scroll-smooth gap-3 flex-wrap"> */}
                     <SearchContainer />
                     <SearchContainer />
          {/* </div> */}
          {/*  */}
        </div>
      </SkeletonTheme>
    </>
  );
};

export default SearchPreloader;

const SearchContainer = () => {
    return (
        <div className='flex-col flex gap-4'>
        <div className="w-full flex justify-between">
<Skeleton width={145} height={32} />
<Skeleton width={40} height={32} />
            </div>
            <div className='w-full overflow-auto flex gap-4'>
     <SearchBox />
     <SearchBox />
     <SearchBox />
     <SearchBox />
     <SearchBox />
            </div>
        </div>
    )
}

const SearchBox = () => {
    return (
        <div className="relative w-[142px]">
        <div className='w-full '>
<Skeleton  height={164} width={142} />
        </div>
</div>
    )
}