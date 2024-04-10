// import Image from 'next/image';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { imageOnError } from '../../utils/errorImage';

const TitleBox = ({ children }) => {
  return (
    <>
      <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 h-[164px] w-72 relative space-y-[-56px]">
        <LazyLoadImage
          className="self-stretch flex-grow-0 flex-shrink-0 h-[164px] rounded bg-black"
          src="assets/images/Img-0.png"
          alt="Title"
          onError={imageOnError}
        />
        {children}
      </div>
    </>
  );
};

export default TitleBox;
