import Image from 'next/image';
import { useState } from 'react';

function CustomImage({ alt, ...props }) {
  const [src, setSrc] = useState(props.src);

  return (
    <Image
      {...props}
      src={src}
      alt={alt} // To fix lint warning
      onError={() => setSrc('/164-164.png')}
      placeholder="blur"
      blurDataURL="/164-164.png"
    />
  );
}
export default CustomImage;
