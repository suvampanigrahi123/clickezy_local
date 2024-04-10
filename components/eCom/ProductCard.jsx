import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { COMMON } from '../../constants/const';
const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
function ProductCard({
  id,
  name,
  price,
  images,
  discount,
  originalPrice,
  index,
}) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{
        delay: index * 0.25,
        ease: 'easeInOut',
        duration: 0.5,
      }}
      className="flex flex-col justify-start items-start flex-grow relative gap-2.5 transform translate-y-2 hover:translate-y-0 duration-500 ease-in-out"
    >
      <Link
        href={{
          pathname: '/store/product-details/' + name,
          query: { name: name, pid: id },
        }}
        className="w-[164px] md:w-full h-[164px] aspect-w-16 aspect-h-16 overflow-hidden rounded"
      >
        <Image
          src={images}
          className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
          width={164}
          height={164}
          alt=""
        />
      </Link>
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative">
        <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left uppercase text-white">
          {name}
        </p>
        <p className="self-stretch flex-grow-0 flex-shrink-0 w-[163px] md:w-full text-base font-medium text-left text-white">
          <span>{COMMON.RUPEE_SYMBOL + Math.round(price)}</span>
          {discount > 0 && (
            <span className="ml-2 line-through text-gray-500 font-normal">
              {COMMON.RUPEE_SYMBOL + originalPrice}
            </span>
          )}
          {discount > 0 && (
            <span className="ml-2 font-normal text-blue-500 text-[.85rem]">
              {discount}% off
            </span>
          )}
        </p>
      </div>
    </motion.div>
  );
}

export default ProductCard;
