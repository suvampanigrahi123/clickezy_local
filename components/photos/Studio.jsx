import Link from 'next/link';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { imageOnError } from '../../utils/errorImage';
import { setSelectedIndex } from '../../redux/slices/studioslice';
import { useDispatch } from 'react-redux';
function StudioName({ title }) {
  return (
    <div className="flex justify-center relative w-full">
      <p className="text-xs text-center text-white capitalize break-words truncate">
        {title || 'Name'}
      </p>
      {/* <p className="flex-grow-0 flex-shrink-0 text-xs text-center text-white/[0.48]">
                Studio
            </p> */}
    </div>
  );
}

function Studio(props) {
  const dispatch = useDispatch();
  return (
    <>
      {props.isPlace ? (
        <Link
          href={`/photography/studios/${props.studio_id}`}
        onClick={()=>dispatch(setSelectedIndex(0))}
          className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-24 relative gap-2"
        >
          <div className="w-24 h-24 aspect-w-1 aspect-h-1 rounded-full overflow-hidden">
            <LazyLoadImage
              src={props.studio_image || '/164-164.png'}
              className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
              width={96}
              height={96}
              alt=""
              effect="blur"
              onError={imageOnError}
            />
          </div>
          <StudioName title={props.studio_name} />
        </Link>
      ) : (
        <>
          <Link
            href={`/photography/studios/studio-info?cat=${props.cp_id}&stu=${props.studio_id}`}
            className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-24 relative gap-2"
          >
            <div className="w-24 h-24 aspect-w-1 aspect-h-1 rounded-full overflow-hidden">
              <LazyLoadImage
                src={props.studio_image || '/164-164.png'}
                className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
                width={96}
                height={96}
                alt=""
                effect="blur"
                onError={imageOnError}
              />
            </div>
            <StudioName title={props.studio_name} />
          </Link>
        </>
      )}
    </>
  );
}

export default Studio;
