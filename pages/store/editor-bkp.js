/* eslint-disable no-undef */
/* eslint-disable curly */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import GridLayout from '../../components/layout/GridLayout';
import Header from '../../components/common/Header';
import {
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';

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
import SliderIcon from '../../components/common/icons/slider';
// import ScrollIcon from '../../components/common/icons/scroll';

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
      unit: 'px',
      aspect: 1,
      width: 50,
      height: 50,
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
    updateStageImage(0);
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

  return (
    <GridLayout>
      <Header>
        <div className="flex flex-col justify-start items-start self-stretch bg-[#010201]">
          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 py-4">
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative py-1">
              <Link href="product-list">
                <ArrowLeftIcon className="h-6 w-6 text-white" />
              </Link>
            </div>
            <div className="flex flex-col justify-center items-start flex-grow flex-shrink-0 relative self-stretch gap-1">
              <p className="flex-grow-0 flex-shrink-0 text-base font-medium text-left text-white">
                Back
              </p>
            </div>
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-4">
              <Link href="checkout" className="text-white">
                Add to cart
              </Link>
            </div>
          </div>
        </div>
      </Header>

      {/* Page Body */}
      <main className="self-auto">
        <div className="p-2">
          {!state.onCropSelect && (
            <div className="aspect-w-12 aspect-h-16  rounded-md overflow-hidden">
              <Image
                id="edit_stage"
                src="/assets/images/10.jpg"
                className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
                alt=""
                width={250}
                height={164}
              />
            </div>
          )}
          {state.onCropSelect && (
            <ReactCrop
              src="http://localhost:3000/assets/images/10.jpg"
              crop={state.crop}
              onChange={(crop) => changeCropState(crop)}
              onImageLoaded={(image) => onImageLoadEndState(image)}
              keepSelection="true"
            />
          )}
        </div>
      </main>

      {/* Page Footer */}
      <footer className="flex flex-col justify-start items-start self-start flex-grow-0 flex-shrink-0 gap-2 py-4 max-w-sm">
        {state.selectedModule === 'looks' && (
          <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 w-full gap-1.5 px-4 overflow-x-auto">
            {filterArr?.map((item, key) => (
              <div
                className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1"
                onClick={() => applyImageFilter(item, key)}
                key={key}
              >
                <div className="flex justify-between items-end flex-grow-0 flex-shrink-0 w-[56px] relative pt-2">
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
                      ? 'w-[56px] h-[56px] aspect-w-16 aspect-h-16  rounded-md overflow-hidden'
                      : 'w-[56px] h-[56px] aspect-w-16 aspect-h-16  rounded-md overflow-hidden'
                  }
                >
                  <Image
                    src="/assets/images/10.jpg"
                    className="w-full h-full object-center object-cover bg-black lg:w-full lg:h-full"
                    alt=""
                    width={72}
                    height={72}
                    style={{ filter: item.css }}
                  />
                </div>
                {/* <p className="flex-grow-0 flex-shrink-0 text-[11px] font-medium text-left text-white">
                  {item.name}
                </p> */}
              </div>
            ))}
          </div>
        )}

        {state.selectedModule === 'tools' && (
          <>
            {state.selectedImageEffect === '' && (
              <div className="flex flex-col justify-center items-center self-stretch flex-grow gap-2 px-4 py-4">
                <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 gap-2">
                  <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 gap-1">
                    <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-5 py-3 rounded-[48px] bg-[#186ced]/[0.32] border border-[#186ced]">
                      <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">
                        Acrylic
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 gap-1">
                    <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-5 py-3 rounded-[48px] bg-[#202124]">
                      <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">
                        Coloured
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 gap-1">
                    <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-5 py-3 rounded-[48px] bg-[#202124]">
                      <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">
                        Canvas
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col-reverse justify-center items-center flex-grow-0 flex-shrink-0 gap-1">
                    <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-5 py-3 rounded-[48px] bg-[#202124]">
                      <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">
                        Card
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Bottom */}
        {state.selectedImageEffect === '' && (
          <div className="flex flex-col justify-start self-stretch">
            <div className="flex justify-between items-center flex-grow-0 flex-shrink-0 px-4 overflow-x-auto">
              <div
                className={
                  state.selectedModule === 'looks'
                    ? 'flex-1 flex justify-center items-center flex-grow-0 flex-shrink-0 p-4 relative gap-2 cursor-pointer'
                    : 'flex-1 flex justify-center items-center flex-grow-0 flex-shrink-0 p-4 relative gap-2 cursor-pointer opacity-40'
                }
                onClick={() => setSelectedModule('looks')}
              >
                <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-white">
                  Photo
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
                  Frame
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
                  Type
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
                  Size
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
                  Style
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
                  Material
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
                  Thickness
                </p>
              </div>
            </div>
          </div>
        )}
      </footer>
    </GridLayout>
  );
};

export default Customisation;
