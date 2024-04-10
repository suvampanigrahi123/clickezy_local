import { LazyLoadImage } from 'react-lazy-load-image-component';
import { imageOnError } from '../../utils/errorImage';

const ProductImage = ({ image }) => {
  return (
    <>
      <LazyLoadImage
        src={image || '/164-164.png'}
        className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
        width={164}
        height={164}
        alt="clickEzy-product"
        onError={imageOnError}
      />
    </>
  );
};

export default ProductImage;
