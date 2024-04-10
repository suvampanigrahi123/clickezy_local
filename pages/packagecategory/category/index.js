import Link from 'next/link';
import useSwr from 'swr';
import { useRouter } from 'next/router';
import PrimaryLayout from '../../../components/layout/PrimaryLayout';
import Header from '../../../components/common/Header';
import * as api from '../../../services/userService';
import SearchIcon from '../../../components/common/icons/search';
import { setFilterName } from '../../../redux/slices/filterTabSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment, useEffect, useState } from 'react';
import CurrentLocation from '../../../components/common/CurrentLocation';
// import { Gallery } from 'react-photoswipe-gallery';
import { getLocalStorage } from '../../../utils/localStore';

import { useUser } from '../../../context/UserContext';
import useLocationModal from '../../../hooks/useLocationModal';
import PackageFilterCategory from '../../../components/common/FilterPackageBaseCategory';
import StudioRating from '../../../components/StudioRating';
import PackageSlider from '../../../components/packageBase/PackageSlider';

export default function AllPackageBookingList() {
  const [index] = useState(0);
  const [category, setCategory] = useState([]);
  const { userId } = useUser();
  useLocationModal({ willPopupVisible: true });
  /**
   * @todo
   * 1. Add location to the query
   *
   */

  const selectedLocation = getLocalStorage('location');
  const loc =
    useSelector((state) => state.locationModal.location) || selectedLocation;

  useEffect(() => {
    window.addEventListener('storage', () => {
      setCategory([]);
    });
  }, [loc]);

  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  const { data: filterList } = useSwr(
    loc?.id && ['/package-base-categories', loc?.id],
    () => api.getAllPackageCategoryList(loc?.id)
  );

  console.log('filterlist..', filterList);

  const items = filterList?.category_data;

  useEffect(() => {
    if (items?.length > 0) {
      setCategory((prev) => [prev, ...items]);
    }
  }, [items]);

  /**
   * 1. Reset the category when filter changes
   */
  const { packagefilters } = useSelector((state) => state.packagefilter);

  useEffect(() => {
    window.addEventListener('filterChange', () => {
      setCategory([]);
    });
  }, [packagefilters]);

  /**
   * @returns
   * Set the filter name
   */
  useEffect(() => {
    if (items) {
      items[0]?.category_name &&
        dispatch(setFilterName(items[0]?.category_name));
    }
  }, [items]);

  const { studio_id } = router.query;

  const [selected, setSelected] = useState({
    studio_name: 'Select',
    studio_id: 0,
  });
  const location =
    useSelector((state) => state.locationModal.location) || selectedLocation;
  const { packageFor, packageLocation } = useSelector((state) => state.package);
  const [dependent, setDependent] = useState({
    locationId: null,
    categoryId: null,
  });
  console.log(dependent);
  const { data: studioList, isLoading } = useSwr(
    location && ['getHomePackageStudioList', location],
    () => api.getHomePackageStudioList(location?.id)
  );
  console.log('studiolist', studioList);
  console.log(location);

  const allStudioList = studioList?.data?.data?.package_data;
  console.log(allStudioList);

  return (
    <PrimaryLayout>
      <Header>
        <div className="flex flex-col justify-start items-start self-stretch relative bg-black">
          <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 px-6 pt-6 pb-4">
            <CurrentLocation />
            <Link
              href="/search"
              className="flex justify-start items-center relative gap-2.5"
            >
              <SearchIcon />
            </Link>
          </div>
        </div>
      </Header>

      {/* Page Body */}
      <div className=" flex flex-col flex-grow self-stretch">
        <PackageFilterCategory
          category={filterList}
          url="/packagecategory/category"
        />
      </div>
      <div   className='grid gap-4 grid-cols-3 w-full p-4 max-md:grid-cols-1'>
          {allStudioList?.map((studio, index) => (
              <div key={index} className="flex flex-col p-4 bg-white rounded-xl">
                <PackageSlider bannersList={studio?.images?.map((img)=>{
                  return {image:img}
                })} />
                <Link href={`/photography/studios/${studio?.studio_id}`} className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <img
                      src={studio.studio_image}
                      className="h-10 w-10 rounded-full"
                      alt={studio.studio_name}
                    />
                    <div className="flex gap-0.5 flex-col">
                      <span>{studio.photo_price}</span>
                      <span>{studio.studio_name}</span>
                    </div>
                  </div>
                  <div>
                    <StudioRating
                      rating={parseFloat(studio.rating)}
                      starDimension="15"
                      starSpacing="5px"
                      numberOfStars={5}
                      starRatedColor="orange"
                    />
                  </div>
                </Link>
              </div>
            ))}
      </div>
    </PrimaryLayout>
  );
}
