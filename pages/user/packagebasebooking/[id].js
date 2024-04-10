import { LazyLoadImage } from 'react-lazy-load-image-component';
import AuthProvider from '../../../components/common/AuthProvider';
import Header from '../../../components/common/Header';
import ArrowLeftIcon from '../../../components/common/icons/arrowlefticon';
import SecondaryLayout from '../../../components/layout/SecondaryLayout';
import BookingDetailsSkeleton from '../../../components/preloader/bookingdetails';
import CalenderIcon from '../../../components/common/icons/calendericon';
import LocationSymbol from '../../../components/common/icons/location';
import StarRatings from 'react-star-ratings';
import { getDifference } from '../../../utils/CountdownTimer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as api from '../../../services/userService';
import useSWR from 'swr';
import { imageOnError } from '../../../utils/errorImage';
import { useEffect, useState } from 'react';
import { mybookingLabel } from '../../../constants/labelText';
import moment from 'moment';

export default function PackageBaseDetailsPage() {
    const router = useRouter();
  
    const { id } = router.query;
  
    const [isLoadings, setIsLoading]=useState(false)

    const formatDates = (date) => {
      const d = date?.split('/')[0];
      const m = date?.split('/')[1];
      const y = date?.split('/')[2];
      const newDate = `${m}-${d}-${y}`;
      return moment(newDate, 'MM-DD-YYYY').format('MMMM DD, YYYY');
    };
    
  const { data, isLoading } = useSWR(
    id && [('/api/get-package-details/id', id)],
    () => api.getUserPackageBookingDetailsByID(id),
  
  );
    return (
      <SecondaryLayout>
        <AuthProvider>
          <Header>
            <div className="flex flex-col justify-start items-start self-stretch bg-[#19191C]">
              <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 pl-5 py-4">
                <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
                  <Link href="/user/my_booking">
                    <ArrowLeftIcon height={24} width={24} />
                  </Link>
                </div>
                <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
                  <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                    {mybookingLabel.header}
                  </p>
                </div>
                
              </div>
            </div>
          </Header>
  
          {/* Page Body */}
          {isLoadings || !data ? (
            <BookingDetailsSkeleton />
          ) : (
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 pb-12 gap-2 md:max-w-2xl md:m-auto md:pb-28">
              <div className="hidden md:flex flex-col justify-start items-start self-stretch">
                <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 pt-12 pb-8">
                  <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
                    <Link href="/user/my_booking">
                      <ArrowLeftIcon className="h-6 w-6 text-white" />
                    </Link>
                  </div>
                  <div className="flex flex-col justify-center items-start flex-grow relative overflow-hidden gap-1">
                    <p className="flex-grow-0 flex-shrink-0 text-xl font-medium text-left text-white">
                      Package Details
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-6 px-6 md:px-0">
                {/*  */}
                <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 bg-white rounded-md">
                  <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 p-4 gap-4">
                    <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
                      <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
                       <LazyLoadImage
                          src={
                            data?.studio?.studio_image
                              ? data?.studio?.studio_image
                              : '/164-164.png'
                          }
                          className="w-16 h-16 object-cover rounded-full"
                          alt=""
                          width={51}
                          height={51}
                          onError={imageOnError}
                        /> 
                        <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-0.5">
                          <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-[#202124]">
                         {data?.studio_name} 
                          </p>
                          <p className="flex-grow-0 flex-shrink-0 text-sm font-normal text-left capitalize text-[#202124]">
                           {data?.category_name} 
                            
                          </p>
                   
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 pt-4 gap-4 border-t border-black/10">
                      <div className="flex flex-col justify-start items-start flex-grow gap-2">
                        <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
                          <CalenderIcon />
                          <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1">
                            <p className="flex-grow-0 flex-shrink-0 text-xs font-normal text-left text-[#202124]">
                               {formatDates(data?.booking_date)} 
                             
                            </p>
                            <p className="flex-grow-0 flex-shrink-0 text-xs font-normal text-left text-[#202124]">
                              •
                            </p>
                       
                          </div>
                        </div>
                        <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
                          <LocationSymbol />
                          <p className="flex-grow-0 flex-shrink-0 text-xs font-normal text-left text-[#202124] break-all max-w-full md:pr-2">
                              
                               {data?.location_name}
                            
                          </p>
                        </div>
                      </div>
                      {/* Booking Status  */}
  
                      {/* Showing End Otp while Status is Progress */}
                     
                      {/* Showing Start Otp while Status is Started Otp */}
                
                    </div>
                  </div>
                </div>
  
                {/* Accept Confirmational Modal */}
              
          
           
                {/*DETAILS  */}
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4">
                  <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2.5">
                    <p className="flex-grow text-xs font-medium text-left uppercase text-white/[0.64]">
                      Details
                    </p>
                  </div>
                  <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-6 px-4 py-5 bg-black rounded-md">
                    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative">
                    <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-3 first:pt-0 last:pb-0 border-b border-white/10 last:border-0">
                        <p className="flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.64]">
                          {mybookingLabel.details.date}
                        </p>
                        <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-white">
                   
                                                        {formatDates(data?.created_at)} 

                        </p>
                      </div>
                      <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-3 first:pt-0 last:pb-0 border-b border-white/10 last:border-0">
                        <p className="flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.64]">
                         Studio name
                        </p>
                        <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-white">
                        {data?.studio_name} 


                        </p>
                      </div>
                   
                      <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-3 first:pt-0 last:pb-0 border-b border-white/10 last:border-0">
                        <p className="flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.64]">
                          Booking for
                        </p>
                        <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-white">
                       
                              {data?.category_name} 
                        </p>
                      </div>
                    
                      <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-3 first:pt-0 last:pb-0 border-b border-white/10 last:border-0">
                        <p className="flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.64]">
                          Booking date
                        </p>
                        <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-white">
                       
                              {data?.booking_date} 
                        </p>
                      </div>
                      <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-3 first:pt-0 last:pb-0 border-b border-white/10 last:border-0">
                        <p className="flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.64]">
                         Booking Status
                        </p>
                        <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-white">
                       
                              {data?.booking_status} 
                        </p>
                      </div>
                  <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative py-3 first:pt-0 last:pb-0 border-b  border-white/10 last:border-0">
  <p className="flex-grow-0 flex-shrink-0 text-xs text-right text-white/[0.64]">
    Booking Code
  </p>
  <p className="flex-grow-0 flex-shrink-0  text-sm text-left sm:w-52 text-white max-w-full overflow-hidden gap-5">
    {data?.package_booking_code}
  </p>
</div>

                    
               
              
             
                  
                     
                    </div>
                  </div>
                </div>
  
           
              </div>
            </div>
          )}
        </AuthProvider>
      </SecondaryLayout>
    );
  }