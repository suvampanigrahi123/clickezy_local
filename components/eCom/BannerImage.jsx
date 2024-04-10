import Image from 'next/image';
import { imageOnError } from '../../utils/errorImage';
const BannerImage = ({ image }) => {
  return (
    <>
      <Image
        src={image || '/368-224.png'}
        className="w-full h-full object-center object-cover lg:w-full lg:h-full animate-fadeIn"
        width={164}
        height={164}
        alt="clickEzy-product"
        onError={imageOnError}
      />
      <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
    </>
  );
};

export default BannerImage;
