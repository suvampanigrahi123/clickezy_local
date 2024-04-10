import React, { useEffect, useState } from 'react'
import PackageSlider from './PackageSlider'
import StarRatings from 'react-star-ratings'
import * as api from '../../services/userService';
import { useDispatch, useSelector } from 'react-redux';
import useSwr from 'swr';
import { useRouter } from 'next/router';
import {  setStudio } from '../../redux/slices/PackageSlice';
import { getLocalStorage } from '../../utils/localStore';
import Link from 'next/link';
const PackageBase = () => {
  const dispatch = useDispatch();
  const router=useRouter()
  const {  studio_id } = router.query;

  const [selected, setSelected] = useState({
    studio_name: 'Select',
    studio_id: 0,
  });
  const selectedLocation = getLocalStorage('location');
  const location =
    useSelector((state) => state.locationModal.location) || selectedLocation;
  const { packageFor, packageLocation } = useSelector((state) => state.package);
  const [items, setItems] = useState([]);
  const [dependent, setDependent] = useState({
    locationId: null,
    categoryId: null,
  });
console.log(dependent);
  const { data: studioList, isLoading } = useSwr(
   location&& ['getHomePackageStudioList', location],
    () => api.getHomePackageStudioList(location?.id)
  );
  console.log('studiolist', studioList)
  console.log(location);

  const allStudioList=studioList?.data?.data?.package_data;
  console.log(allStudioList);

 

  return (
    <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 ">
    <div className="md:px-44 flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 overflow-hidden gap-28 px-6 py-16 md:py-20">
      <div className="flex flex-col justify-start items-start flex-grow gap-8">
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
        <div className="flex justify-between w-full items-center">
        <div>
          <h1 className="self-stretch flex-grow-0 flex-shrink-0 text-3xl font-medium text-white">
            Wedding Photography Packages
          </h1>
          <p className="flex-grow-0 flex-shrink-0 text-base text-white/[0.80]">
            Capture your perfect moments with our exclusive wedding photography packages.
          </p>
        </div>
        <Link href={'/packagecategory/category'} className="flex items-center self-stretch flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.48]">View all</Link>
      </div>
          
        </div>
<div className='grid gap-4 grid-cols-3 w-full max-md:grid-cols-1'>
          {allStudioList?.map((studio, index) => (
            index<3&&
              <div key={index} className="flex flex-col p-4 bg-white rounded-xl">
                <PackageSlider bannersList={studio?.images?.map((img)=>{
                  return {image:img}
                })} />
                <div className="flex justify-between">
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
                    <StarRatings
                      rating={parseFloat(studio.rating)}
                      starDimension="15"
                      starSpacing="5px"
                      numberOfStars={5}
                      starRatedColor="orange"
                    />
                  </div>
                </div>
              </div>
            ))}
      </div>
      </div>
    </div>
  </div>
  )
}

export default PackageBase