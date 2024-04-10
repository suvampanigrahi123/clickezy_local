/* eslint-disable no-undef */
/* eslint-disable curly */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { saveAs } from 'file-saver';
import GridLayout from '../../components/layout/GridLayout';
import CancelIcon from '../../components/common/icons/cancel';
import RightIcon from '../../components/common/icons/right';
import CropIcon from '../../components/common/icons/crop';
import BrightnessIcon from '../../components/common/icons/brightness';
import ContrastIcon from '../../components/common/icons/contrast';
import SaturationIcon from '../../components/common/icons/saturation';
import HueIcon from '../../components/common/icons/hue';
import BlurIcon from '../../components/common/icons/blur';
import SepiaIcon from '../../components/common/icons/sepia';
import GrayscaleIcon from '../../components/common/icons/grayscale';
// import ScrollIcon from '../../components/common/icons/scroll';
import Image from 'next/image';
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import SliderIcon from '../../components/common/icons/slider';
import { useRouter } from 'next/router';
import * as api from '../../services/userService';
import useSWR from 'swr';
import { imageOnError } from '../../utils/errorImage';
import { LazyLoadImage } from 'react-lazy-load-image-component';
var editedVal;

const Customisation = () => {
  const filterArr = [
    { id: 1, name: 'Normal', css: '' },
    {
      id: 2,
      name: 'Vivid',
      css: 'brightness(110%) contrast(110%) saturate(130%)',
    },
    { id: 3, name: 'Lofi', css: 'contrast(150%) saturate(110%)' },
    { id: 4, name: 'Toaster', css: 'brightness(90%) contrast(150%)' },
    { id: 5, name: 'Earlybird', css: 'contrast(90%) sepia(20%)' },
    { id: 6, name: 'Gingham', css: 'brightness(105%) hue-rotate(350deg)' },
    {
      id: 7,
      name: 'Hudson',
      css: 'brightness(120%) contrast(90%) saturate(110%)',
    },
    { id: 8, name: 'Brooklyn', css: 'brightness(110%) contrast(90%)' },
    {
      id: 9,
      name: 'Moon',
      css: 'brightness(110%) contrast(110%) grayscale(100%)',
    },
  ];

  const [selectedImage, setSelectedImage] = useState({
    image: '',
    blobUrl: '',
    blob: '',
  });

  const [state, setState] = useState({
    filterIndex: 0,
    selectedModule: 'looks',
    onCropSelect: false,
    selectedImageEffect: '',
    sliderValue: 2,
    editVal: 0,
    crop: {
      unit: '%',
      aspect: 1,
      width: 50,
      height: 50,
      x: 25,
      y: 25,
    },
  });

  const changeCropState = (crop) => {
    setState((state) => ({
      ...state,
      crop: crop,
    }));
  };

  const onImageLoadEndState = (img) => {
    imageRef = img;
  };

  const setSelectedModule = (type) => {
    setState((state) => ({
      ...state,
      selectedModule: type,
    }));
  };

  const changeImageEffect = (type) => {
    editedVal = '';
    setState((state) => ({
      ...state,
      selectedImageEffect: type,
    }));
  };

  const cancelImageEdit = () => {
    // updateStageImage(0);
    doneImageEdit();
  };

  const doneImageEdit = () => {
    setState((state) => ({
      ...state,
      selectedImageEffect: '',
      editVal: 0,
    }));
  };

  const updateSlider = (val) => {
    val = state.selectedImageEffect === 'blur' && val <= 0 ? 0 : Number(val);
    setState((state) => ({
      ...state,
      editVal: val,
    }));
    let calculateVal = val === 0 ? val : getCalculateVal(val);
    updateStageImage(calculateVal);
  };

  const getCalculateVal = (val) => {
    let calVal = 0;
    if (state.selectedImageEffect === 'blur') calVal = Number(val / 30);
    else if (
      state.selectedImageEffect === 'grayscale' ||
      state.selectedImageEffect === 'sepia'
    )
      calVal = Number(val + 5);
    else calVal = Number(val / 2);
    return calVal;
  };

  const updateStageImage = (calculateVal) => {
    let styleStr = document
        .getElementById('edit_stage')
        .getAttribute('style')
        .split(';'),
      propertyVal = [],
      styleProps = 'filter:';
    if (styleStr?.length && styleStr[1]) {
      let filterStr = styleStr[1].split(':')[1];
      if (filterStr) {
        propertyVal = filterStr.split(' ');
      }
    }

    let isApply = false,
      unitVal = state.selectedImageEffect === 'blur' ? 'px' : '%';
    propertyVal.forEach((item) => {
      if (item.includes(state.selectedImageEffect)) {
        let val = Number(item.match(/\(([^)]+)\)/)[1].split(unitVal)[0]);
        if (!editedVal) editedVal = val;
        calculateVal = !calculateVal
          ? state.filterIndex
            ? editedVal
            : 0
          : calculateVal + editedVal;
        if (calculateVal)
          styleProps +=
            ' ' +
            state.selectedImageEffect +
            '(' +
            calculateVal +
            unitVal +
            ')';
        isApply = true;
      } else if (item) {
        styleProps += ' ' + item;
      }
    });

    if (!isApply) {
      if (!editedVal)
        editedVal =
          state.selectedImageEffect === 'blur' ||
          state.selectedImageEffect === 'grayscale' ||
          state.selectedImageEffect === 'sepia'
            ? 0
            : 100;
      calculateVal = !calculateVal ? editedVal : calculateVal + editedVal;
      styleProps +=
        ' ' + state.selectedImageEffect + '(' + calculateVal + unitVal + ')';
    }
    document
      .getElementById('edit_stage')
      .setAttribute('style', 'color:transparent;' + styleProps);
  };

  const applyImageFilter = (item, key) => {
    setState((state) => ({
      ...state,
      filterIndex: key,
    }));
    let styleStr = item.css
      ? 'color:transparent;filter:' + item.css
      : 'color:transparent;';
    document.getElementById('edit_stage').setAttribute('style', styleStr);
  };

  const onClickCrop = () => {
    setState((state) => ({
      ...state,
      onCropSelect: true,
    }));
  };

  //showing Image @suvam
  const router = useRouter();
  const [image, setImage] = useState('');
  const { image_id, booking_id } = router.query;
  const { data, isLoading } = useSWR(
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
      const image = imageArray?.find(
        (image) => Number(image.id) === Number(image_id)
      );
      setImage(image);
    }
  }, [data]);

  const downLoadImage = () => {
    saveAs(image?.url, image?.url?.split('/').pop());
  };

  const resetAll = () => {
    setState((state) => ({
      ...state,
      selectedImageEffect: '',
      editVal: 0,
    }));
  };

  return (
    <GridLayout>
      {/* Page Header */}
      <header className="flex flex-col justify-start items-start self-start min-h-[64px] max-h-[64px]">
        <div className="flex flex-col justify-start items-start self-stretch">
          <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 pl-5 py-4">
            {state.selectedModule === 'looks' && (
              <>
                <Link
                  href={`photo_detail?booking_id=${booking_id}&image_id=${image_id}`}
                  className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1 py-1"
                >
                  <CancelIcon />
                  <p className="flex-grow-0 flex-shrink-0 text-sm font-normal text-left text-white">
                    Cancel
                  </p>
                </Link>
                <div className="flex flex-col justify-center items-start flex-grow" />
                <button
                  type="button"
                  className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1"
                  onClick={downLoadImage}
                >
                  <ArrowDownTrayIcon className="w-5 h-5 text-white" />
                  {/* <p className="flex-grow-0 flex-shrink-0 text-sm font-normal text-left text-white">
                    Download
                  </p> */}
                </button>
              </>
            )}
            {state.selectedModule === 'tools' && (
              <>
                {state.selectedImageEffect === '' && (
                  <>
                    <Link
                      href={`photo_detail?booking_id=${booking_id}&image_id=${image_id}`}
                      className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1 py-1"
                    >
                      <CancelIcon />
                      <p className="flex-grow-0 flex-shrink-0 text-sm font-normal text-left text-white">
                        Cancel
                      </p>
                    </Link>
                    <div className="flex flex-col justify-center items-start flex-grow" />
                    <button
                      type="button"
                      className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1"
                    >
                      <ArrowDownTrayIcon className="w-5 h-5 text-white" />
                    </button>
                  </>
                )}
                {state.selectedImageEffect && (
                  <>
                    {/* <Link
                      href="photo_detail"
                      className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1 py-1"
                    >
                      <CancelIcon />
                    </Link> */}
                    <div className="flex flex-col justify-center items-start flex-grow">
                      <p className="text-white text-xl capitalize">
                        {state.selectedImageEffect}
                      </p>
                    </div>
                    <button
                      onClick={resetAll}
                      type="button"
                      className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-1"
                    >
                      <ArrowPathIcon className="w-5 h-5 text-white" />
                      <p className="flex-grow-0 flex-shrink-0 text-sm font-normal text-left text-white">
                        Reset
                      </p>
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Page Body */}
      <main className="self-auto">
        <div className="p-2  h-48 w-96">
          {!state.onCropSelect && (
            <div className="object-fill  rounded-md overflow-hidden">
              <LazyLoadImage
                id="edit_stage"
                src={image && image?.url}
                alt=""
                width={250}
                height={164}
                className="w-full h-[43vh] object-contain  bg-black lg:w-full lg:h-full"
                onError={imageOnError}
              />
            </div>
          )}
          {state.onCropSelect && (
            <ReactCrop
              crop={state.crop}
              onChange={(crop) => changeCropState(crop)}
              onImageLoaded={(image) => onImageLoadEndState(image)}
              keepSelection="false"
            >
              <LazyLoadImage src={image && image?.url} />
            </ReactCrop>
          )}
        </div>
      </main>

      {/* Page Footer */}
      <footer className="flex flex-col justify-start items-start self-start flex-grow-0 flex-shrink-0 gap-2 py-4 max-w-sm">
        {state.selectedModule === 'looks' && (
          <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 w-full gap-2 px-4 overflow-x-auto">
            {filterArr?.map((item, key) => (
              <div
                className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1"
                onClick={() => applyImageFilter(item, key)}
                key={key}
              >
                <div className="flex justify-between items-end flex-grow-0 flex-shrink-0 w-[72px] relative pt-2">
                  <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                  <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                  <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                  <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                  <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                  <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-4" />
                  <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                  <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                  <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                  <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                  <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                </div>
                <div
                  className={
                    state.selectedModule === ''
                      ? 'w-[72px] h-[72px] aspect-w-16 aspect-h-16  rounded-md overflow-hidden'
                      : 'w-[72px] h-[72px] aspect-w-16 aspect-h-16  rounded-md overflow-hidden ring-1 ring-white'
                  }
                >
                  <LazyLoadImage
                    src={image ? image?.thumb : '/assets/images/10.jpg'}
                    className="w-full h-full object-cover  bg-black lg:w-full lg:h-full"
                    alt=""
                    width={72}
                    height={72}
                    style={{ filter: item.css }}
                    onError={imageOnError}
                  />
                </div>
                <p className="flex-grow-0 flex-shrink-0 text-[11px] font-medium text-left text-white">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        )}

        {state.selectedModule === 'tools' && (
          <>
            {state.selectedImageEffect === '' && (
              <div className="flex justify-start items-end w-full gap-2 px-4 overflow-x-auto">
                <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1">
                  <div className="flex justify-between items-end flex-grow-0 flex-shrink-0 w-[64px] relative pt-2">
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-4" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                  </div>
                  <div
                    className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-[72px] w-16 gap-2.5 p-2.5 rounded cursor-pointer"
                    onClick={() => onClickCrop()}
                  >
                    <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
                      <CropIcon />
                    </div>
                  </div>
                  <p className="flex-grow-0 flex-shrink-0 text-[11px] font-medium text-left text-white">
                    Crop
                  </p>
                </div>
                <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1">
                  <div className="flex justify-between items-end flex-grow-0 flex-shrink-0 w-[64px] relative pt-2">
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-4" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                  </div>
                  <div
                    className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-[72px] w-16 gap-2.5 p-2.5 rounded cursor-pointer"
                    onClick={() => changeImageEffect('brightness')}
                  >
                    <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
                      <BrightnessIcon fill="#eab308" />
                    </div>
                  </div>
                  <p className="flex-grow-0 flex-shrink-0 text-[11px] font-medium text-left text-white">
                    Brightness
                  </p>
                </div>
                <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1">
                  <div className="flex justify-between items-end flex-grow-0 flex-shrink-0 w-[64px] relative pt-2">
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-4" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                  </div>
                  <div
                    className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-[72px] w-16 gap-2.5 p-2.5 rounded cursor-pointer"
                    onClick={() => changeImageEffect('contrast')}
                  >
                    <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
                      <ContrastIcon />
                    </div>
                  </div>
                  <p className="flex-grow-0 flex-shrink-0 text-[11px] font-medium text-left text-white">
                    Contrast
                  </p>
                </div>
                <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1">
                  <div className="flex justify-between items-end flex-grow-0 flex-shrink-0 w-[64px] relative pt-2">
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-4" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                  </div>
                  <div
                    className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-[72px] w-16 gap-2.5 p-2.5 rounded cursor-pointer"
                    onClick={() => changeImageEffect('saturate')}
                  >
                    <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
                      <SaturationIcon />
                    </div>
                  </div>
                  <p className="flex-grow-0 flex-shrink-0 text-[11px] font-medium text-left text-white">
                    Saturation
                  </p>
                </div>

                <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1">
                  <div className="flex justify-between items-end flex-grow-0 flex-shrink-0 w-[64px] relative pt-2">
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-4" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                  </div>
                  <div
                    className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-[72px] w-16 gap-2.5 p-2.5 rounded cursor-pointer"
                    onClick={() => changeImageEffect('grayscale')}
                  >
                    <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
                      <GrayscaleIcon />
                    </div>
                  </div>
                  <p className="flex-grow-0 flex-shrink-0 text-[11px] font-medium text-left text-white">
                    Grayscale
                  </p>
                </div>
                <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1">
                  <div className="flex justify-between items-end flex-grow-0 flex-shrink-0 w-[64px] relative pt-2">
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-4" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                  </div>
                  <div
                    className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-[72px] w-16 gap-2.5 p-2.5 rounded cursor-pointer"
                    onClick={() => changeImageEffect('blur')}
                  >
                    <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
                      <BlurIcon />
                    </div>
                  </div>
                  <p className="flex-grow-0 flex-shrink-0 text-[11px] font-medium text-left text-white">
                    Fade
                  </p>
                </div>
                <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1">
                  <div className="flex justify-between items-end flex-grow-0 flex-shrink-0 w-[64px] relative pt-2">
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-4" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                    <div className="flex-grow-0 flex-shrink-0 bg-white/40 w-[1px] h-2" />
                  </div>
                  <div
                    className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-[72px] w-16 gap-2.5 p-2.5 rounded cursor-pointer"
                    onClick={() => changeImageEffect('sepia')}
                  >
                    <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
                      <SepiaIcon />
                    </div>
                  </div>
                  <p className="flex-grow-0 flex-shrink-0 text-[11px] font-medium text-left text-white">
                    Sepia
                  </p>
                </div>
              </div>
            )}
            {/* {state.selectedImageEffect && (
              <div className="flex justify-between items-start flex-grow-0 flex-shrink-0 self-stretch gap-2 px-4">
                <ScrollIcon />
              </div>
            )} */}
          </>
        )}

        {state.selectedImageEffect === '' && (
          <div className="flex flex-col justify-start self-stretch px-4">
            <div className="flex justify-between items-center flex-grow-0 flex-shrink-0">
              <div
                className={
                  state.selectedModule === 'looks'
                    ? 'flex-1 flex justify-center items-center flex-grow-0 flex-shrink-0 p-4 relative gap-2 cursor-pointer'
                    : 'flex-1 flex justify-center items-center flex-grow-0 flex-shrink-0 p-4 relative gap-2 cursor-pointer opacity-40'
                }
                onClick={() => setSelectedModule('looks')}
              >
                <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">
                  Looks
                </p>
              </div>
              <div
                className={
                  state.selectedModule === 'tools'
                    ? 'flex-1 flex justify-center items-center flex-grow-0 flex-shrink-0 p-4 relative gap-2 cursor-pointer'
                    : 'flex-1 flex justify-center items-center flex-grow-0 flex-shrink-0 p-4 relative gap-2 cursor-pointer opacity-40'
                }
                onClick={() => setSelectedModule('tools')}
              >
                <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">
                  Tools
                </p>
              </div>
              <div className="flex-1 flex justify-center items-center flex-grow-0 flex-shrink-0 p-4 relative gap-2 cursor-pointer opacity-40">
                <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">
                  Retouch
                </p>
              </div>
            </div>
          </div>
        )}

        {state.selectedImageEffect && (
          <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 self-stretch gap-8 px-4 h-[116px]">
            <div className="range flex flex-col justify-center">
              <SliderIcon />
              <input
                id="typeinp"
                type="range"
                min="-80"
                max="80"
                className="slider appearance-none bg-white/20 h-1 w-full"
                value={state.editVal}
                onChange={(e) => updateSlider(e.target.value)}
                step="10"
              />
            </div>
            <label htmlFor="typeinp" className="text-white">
              {state.editVal}
            </label>
          </div>
        )}

        {state.selectedImageEffect && (
          <div className="flex flex-col justify-start self-stretch px-4">
            <div className="flex justify-between items-center flex-grow-0 flex-shrink-0">
              <div className="flex-1 flex justify-center items-center flex-grow-0 flex-shrink-0 p-4 relative gap-2">
                <div
                  className="flex justify-center items-center flex-grow-0 flex-shrink-0 gap-1 cursor-pointer"
                  onClick={() => cancelImageEdit()}
                >
                  <CancelIcon />
                  <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">
                    Cancel
                  </p>
                </div>
              </div>
              {/* <div className="flex-1 flex justify-center items-center flex-grow-0 flex-shrink-0 p-4 relative  gap-2">
                <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white capitalize">
                  {state.selectedImageEffect}
                </p>
              </div> */}
              <div className="flex-1 flex justify-center items-center flex-grow-0 flex-shrink-0 p-4 relative gap-2">
                <div
                  className="flex justify-center items-center flex-grow-0 flex-shrink-0 gap-1 cursor-pointer"
                  onClick={() => doneImageEdit()}
                >
                  <RightIcon />
                  <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">
                    Done
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </footer>
    </GridLayout>
  );
};

export default Customisation;
