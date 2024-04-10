import Link from 'next/link';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ArrowLeftIcon from '../../components/common/icons/arrowlefticon';
import GridLayout from '../../components/layout/GridLayout';
import { imageOnError } from '../../utils/errorImage';
import { useRouter } from 'next/router';
import * as api from '../../services/userService';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { saveAs } from 'file-saver';
import { find } from 'lodash';
export default function Customisation() {
  const router = useRouter();
  const [image, setImage] = useState(null);
  const { image_id, booking_id } = router.query;
  const { data } = useSWR(
    booking_id && [('/api/bookingdetails/id', booking_id)],
    () => api.getUserBookingDetailsByID(booking_id)
  );
  useEffect(() => {
    if (
      data?.images?.photographs?.length ||
      data?.images?.edited?.length ||
      data?.images?.retouch_request?.length
    ) {
      const imageArray = [
        ...(data?.images?.photographs || []),
        ...(data?.images?.edited || []),
        ...(data?.images?.retouch_request || []),
      ];
      const image = find(imageArray, { id: image_id });
      setImage(image);
    }
  }, [data]);
  const handleNavigate = () => {
    if (booking_id || image_id & (data?.left > 0)) {
      if (
        data?.images?.retouch_request?.find((image) => image.id === image_id)
      ) {
        toast.error('This image is already sent for retouch request');
      } else {
        router.push(
          `customisation_request?booking_id=${booking_id}&image_id=${image_id}`
        );
      }
    } else {
      toast.error('something went wrong');
    }
  };
  const downloadMyFile = async (source) => {
    saveAs(source, source?.split('/').pop());
  };
  return (
    <GridLayout>
      {/* Page Header */}
      <header className="flex flex-col justify-start items-start self-start min-h-[64px] max-h-[64px]">
        <div className="flex flex-col justify-start items-start self-stretch">
          <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 pl-5 py-4">
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
              <Link href={`/user/my_booking/${booking_id}`}>
                <ArrowLeftIcon width={24} height={24} />
              </Link>
            </div>

            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-4">
              {(data?.status === 'review' || data?.status === 'customize') && (
                <div
                  onClick={handleNavigate}
                  className="btn-primary self-stretch text-xs rounded-xl font-medium px-4 py-2 cursor-pointer"
                >
                  Retouch
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Page Body */}
      <main className="">
        <div className="p-2 h-48 w-96">
          <div className="object-fill rounded-md overflow-hidden">
            <LazyLoadImage
              src={image ? image?.thumb : '/164-164.png'}
              alt="..."
              className="w-full h-full object-center object-contain bg-black lg:w-full lg:h-full"
              onError={imageOnError}
            />
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="flex flex-col justify-start items-start self-start flex-grow-0 flex-shrink-0 gap-2 p-4">
        <div className="cursor-pointer flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
          {image ? (
            <button
              onClick={() => downloadMyFile(image?.url)}
              download
              className="w-full btn-primary bg-[#27292D]"
            >
              Download
            </button>
          ) : null}
          <Link
            href={`photo_edit?booking_id=${booking_id}&image_id=${image_id}`}
            className="w-full btn-primary cursor-pointer"
          >
            Edit
          </Link>
        </div>
      </footer>
    </GridLayout>
  );
}
