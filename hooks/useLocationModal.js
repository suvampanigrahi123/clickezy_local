'use client';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIsModalOpen,
  setLocation,
  setLocationList,
} from '../redux/slices/locationModal';
import { printLog } from '../helper/printLog';
import { getLocalStorage } from '../utils/localStore';
import * as api from '../services/userService';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const useLocationModal = ({ willPopupVisible }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const location = getLocalStorage('location');
  const { data } = useSWR('/api/locationModalList', () => api.getAllPlaces(), {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  useEffect(() => {
    if (!getLocalStorage('popState') && !location && willPopupVisible) {
      setTimeout(() => {
        dispatch(setIsModalOpen(true));
      }, 1500);
    }

    if (data) {
      dispatch(setLocationList(data));
    }
  }, [data]);
};

export default useLocationModal;
