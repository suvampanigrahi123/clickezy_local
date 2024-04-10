// import Image from 'next/image';
// import Link from 'next/link';
import { EyeIcon, ShareIcon, XMarkIcon } from '@heroicons/react/24/solid';
import StudioRating from '../StudioRating';
import SaveHeart from '../photos/SaveHeart';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { imageOnError } from '../../utils/errorImage';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import * as api from '../../services/userService';
import { useUser } from '../../context/UserContext';
import ShareContainer from '../common/ShareContainer';

const PhotoSwipeContent = ({
  image = '',
  studioName = '',
  studioRating = null,
  heartCount = null,
  viewCount = null,
  camera = '',
  studioImage = '',
  isLiked = '',
  studioId = null,
  imageId = null,
  mutate,
}) => {
  const { userId } = useUser();
  useEffect(() => {
    const ViewCount = async (payload) => {
      await api.sendViewCount(payload);
    };
    if (!userId) {
      return;
    }
    if (userId) {
      const payload = {
        user_id: userId,
        image_id: imageId,
      };
      ViewCount(payload);
    }
  }, []);
  const [share, setShare] = useState(false);
  const handleShare = (e) => {
    e.preventDefault();
    setShare(true);
  };
  return (
    <div className="max-w-full mx-auto md:max-w-full min-h-screen max-h-screen flex flex-col">
      <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-6 px-6 py-4">
        <div className="flex justify-start items-center self-stretch flex-grow relative gap-2">
          <Link href={`/photography/studios/${studioId}`}>
            <div className="flex justify-start items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <LazyLoadImage
                  src={studioImage}
                  className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
                  width={32}
                  height={32}
                  alt=""
                  onError={imageOnError}
                />
              </div>
              <div className="flex flex-col justify-start items-start flex-grow relative">
                <p className="self-stretch flex-grow-0 flex-shrink-0 text-sm font-medium text-left capitalize text-white">
                  {studioName || 'Photos'}
                </p>
                <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1">
                  <StudioRating studio_rating={studioRating} />
                </div>
              </div>
            </div>
          </Link>
        </div>
        <XMarkIcon className="w-6 h-6 text-white" />
      </div>
      {share ? (
        <ShareContainer title={studioName} />
      ) : (
        <div className="flex flex-col  justify-center items-center self-stretch flex-grow flex-shrink-0 gap-2 px-2 md:px-44 max-h-[75vh] overflow-hidden">
          <div className="w-full  md:w-1/2 overflow-hidden rounded">
            <LazyLoadImage
              src={image}
              width={1024}
              height={500}
              alt=""
              className="w-full max-h-[80vh] object-contain bg-black lg:w-full "
            />
          </div>
        </div>
      )}
      <div className="md:w-1/4 md:m-auto h-[15vh]">
        <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 gap-6 px-6">
          <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
            <p className="flex-grow-0 flex-shrink-0 text-xs text-left capitalize text-white/[0.64]">
              {camera || ''}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative px-7 py-10">
          <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
            <SaveHeart
              heartCount={heartCount}
              studioId={studioId}
              isLiked={isLiked}
              imageId={imageId}
              mutate={mutate}
              key={imageId}
            />
          </div>
          <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
            <EyeIcon className="w-5 h-5 text-white" />
            <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">
              {viewCount}
            </p>
          </div>
          <button onClick={handleShare}>
            <ShareIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoSwipeContent;
