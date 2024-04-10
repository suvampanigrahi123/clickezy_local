import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonItem = () => {
  return (
    <>
      <SkeletonTheme baseColor="#202124" highlightColor="#27292d">
        <section className="flex flex-col gap-4 max-md:w-[90%] m-auto">
          <h2 className="section-title max-md:w-[50%] md:w-[300px]">
            <Skeleton height={32} />
          </h2>
          <div className="flex gap-2 flex-wrap max-md:flex-col max-md:w-full">
            {Array(5)
              .fill()
              .map((item, index) => (
                <div className="max-md:w-full w-[288px] relative" key={index}>
                  <div
                    key={index}
                    className="max-md:w-full w-[288px] max-md:hidden"
                  >
                    <Skeleton height={164} />
                  </div>
                  <div
                    key={index + 1 * 7}
                    className="max-md:w-full w-[288px] md:hidden"
                  >
                    <Skeleton height={200} />
                  </div>
                </div>
              ))}
          </div>
        </section>
      </SkeletonTheme>
    </>
  );
};

const SkeletonCard = () => {
  return (
    <div className="flex flex-col gap-12 w-full">
      <SkeletonItem />
    </div>
  );
};

export default SkeletonCard;
