import { EyeIcon } from '@heroicons/react/24/solid';
// import Image from 'next/image';
import Link from 'next/link';
import { Item } from 'react-photoswipe-gallery';
import { imageOnError } from '../../utils/errorImage';
import SaveHeart from './SaveHeart';
// Gallery PhotoSwipe CSS
import 'photoswipe/dist/photoswipe.css';
import PhotoSwipeContent from './PhotoSwipeContent';
import Image from 'next/image';
import { setSelectedIndex } from '../../redux/slices/studioslice';
import { useDispatch } from 'react-redux';
function StudioName({ title }) {
  return (
    <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left capitalize text-white">
      {title ? `${title}` : 'Studio Name'}
    </p>
  );
}

function ImageCard(props) {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative">
      {/* Check it is a studio-info components */}
      {props?.isStudioInfo === true ? (
        <>
          <div className="w-full h-56 md:h-40 aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
            <Item
              width="1024"
              height="768"
              content={
                <PhotoSwipeContent
                  image={props?.image}
                  studioName={props?.studio_name}
                  studioRating={props?.rating}
                  studioImage={props.studio_image}
                  heartCount={props?.heart_count}
                  viewCount={props?.view}
                  camera={props?.used_cam}
                  isLiked={props?.is_heart}
                  studioId={props?.studio_id}
                  imageId={props?.image_id}
                  mutate={props?.mutate}
                />
              }
            >
              {({ ref, open }) => (
                <Image
                  ref={ref}
                  onClick={open}
                  src={
                    props.thumb || props.image
                      ? props.thumb || props.image
                      : '/368-224.png'
                  }
                  className="w-full h-full object-contain bg-black lg:w-full lg:h-full"
                  width={368}
                  height={224}
                  alt=""
                  effect="blur"
                  unoptimized="true"
                  onError={imageOnError}
                />
              )}
            </Item>
          </div>
          <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 px-2 py-3">
            {!props.dontShowStudio && (
              <Link
                href={`/photography/studios/${props.studio_id}`}
                onClick={() => dispatch(setSelectedIndex(0))}
              >
                <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={
                        props.studio_image ? props.studio_image : '/164-164.png'
                      }
                      className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
                      width={32}
                      height={32}
                      alt="image"
                      effect="blur"
                      unoptimized="true"
                      onError={imageOnError}
                    />
                  </div>
                  <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-0.5">
                    <StudioName
                      title={props.studio_name ? props.studio_name : 'Name'}
                    />
                  </div>
                </div>
              </Link>
            )}
            <div className="flex justify-end w-full items-center flex-grow-0 flex-shrink-0 gap-4">
              <SaveHeart
                heartCount={props.heart_count}
                studioId={props.studio_id}
                isLiked={props.is_heart}
                imageId={props.image_id}
                mutate={props?.mutate}
                key={props.image_id}
              />
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1 cursor-default">
                <EyeIcon className="w-4 h-4 text-white" />
                <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-white">
                  {props.view ? props.view : '0'}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : props?.isLocation === true ? (
        <>
          <div className="w-full h-56 aspect-w-16 aspect-h-9  rounded-lg overflow-hidden">
            <Link
              href={`/photography/studios/studio-info?cat=${
                props.category_id
              }&stu=${props.studio_id}&location_id=${props.id}${
                props.location_name
                  ? `&location_name=${props.location_name}`
                  : ''
              }`}
            >
              <Image
                src={props.thumb ? props.thumb : '/368-224.png'}
                className="w-full h-full object-contain bg-black lg:w-full lg:h-full"
                width={368}
                height={224}
                alt=""
                effect="blur"
                unoptimized="true"
                onError={imageOnError}
              />
            </Link>
          </div>
          <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 px-2 py-3">
            <Link
              href={`/photography/studios/${props.studio_id}`}
              onClick={() => dispatch(setSelectedIndex(0))}
            >
              <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={
                      props.studio_image ? props.studio_image : '/164-164.png'
                    }
                    className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
                    width={32}
                    height={32}
                    alt="image"
                    effect="blur"
                    unoptimized="true"
                    onError={imageOnError}
                  />
                </div>
                <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-0.5">
                  <StudioName
                    title={props.studio_name ? props.studio_name : 'Name'}
                  />
                  {/* <LocationName
              title={props.location ? props.location : 'Location'}
            /> */}
                </div>
              </div>
            </Link>
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-4">
              <SaveHeart
                heartCount={props.heart_count}
                studioId={props.studio_id}
                isLiked={props.is_heart}
                imageId={props.image_id}
                mutate={props?.mutate}
                key={props.image_id}
              />
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1 cursor-pointer">
                <EyeIcon className="w-4 h-4 text-white" />
                <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-white">
                  {props.view ? props.view : '0'}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full h-56 aspect-w-16 aspect-h-9  rounded-lg overflow-hidden">
            <Link
              href={`/photography/studios/studio-info?cat=${props.id}&stu=${props.studio_id}`}
            >
              <Image
                src={props.thumb ? props.thumb : '/368-224.png'}
                className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
                width={368}
                height={224}
                alt=""
                effect="blur"
                unoptimized="true"
                onError={imageOnError}
              />
            </Link>
          </div>
          <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 px-2 py-3">
            <Link
              href={`/photography/studios/${props.studio_id}`}
              onClick={() => dispatch(setSelectedIndex(0))}
            >
              <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={
                      props.studio_image ? props.studio_image : '/164-164.png'
                    }
                    className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
                    width={32}
                    height={32}
                    alt="image"
                    effect="blur"
                    unoptimized="true"
                    onError={imageOnError}
                  />
                </div>
                <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-0.5">
                  <StudioName
                    title={props.studio_name ? props.studio_name : 'Name'}
                  />
                  {/* <LocationName
              title={props.location ? props.location : 'Location'}
            /> */}
                </div>
              </div>
            </Link>
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-4">
              <SaveHeart
                heartCount={props.heart_count}
                studioId={props.studio_id}
                isLiked={props.is_heart}
                imageId={props.image_id}
                mutate={props?.mutate}
                key={props.image_id}
              />
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1 cursor-pointer">
                <EyeIcon className="w-4 h-4 text-white" />
                <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-left text-white">
                  {props.view ? props.view : '0'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ImageCard;
