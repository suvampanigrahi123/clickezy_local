/* eslint-disable react/button-has-type */
import Link from 'next/link';
import Image from 'next/image';
import PrimaryLayout from '../components/layout/PrimaryLayout';
import Typewriter from 'typewriter-effect';
import GreenDot from '../components/common/icons/greendot';
import { Photo, Studio } from '../components/home/index';
import { Header } from '../components/common/index';
import { COMMON } from '../constants/const';
import { homeLabel } from '../constants/labelText';
import useLocationModal from '../hooks/useLocationModal';
import PackageBase from '../components/packageBase/packagebase';

export default function Home() {
  //@ Location Popover Hook
  useLocationModal({ willPopupVisible: true });
  return (
    <PrimaryLayout>
      <Header>
        <div className="flex justify-start items-center self-stretch flex-grow gap-2 px-6 py-4 md:px-44">
          <div className="flex justify-start items-center flex-grow relative">
            <p className="flex-grow-0 flex-shrink-0 text-xl font-medium capitalize">
              <span className="flex-grow-0 flex-shrink-0 text-xl font-medium capitalize text-[#1185e0]">
                Click
              </span>
              <span className="flex-grow-0 flex-shrink-0 text-xl font-medium capitalize text-white">
                ezy
              </span>
            </p>
          </div>
          <Link
            href="/booking"
            className="btn-primary self-stretch text-xs rounded-xl font-medium px-4 py-2"
          >
            {homeLabel.booknow}
          </Link>
        </div>
      </Header>

      {/* Page Body */}
      <div className="flex flex-col justify-start items-start bg-[#202124]">
        {/* Hero */}
        <div className="flex flex-col md:flex-row justify-center items-start md:items-center self-stretch flex-grow-0 flex-shrink-0 bg-[#19191c]">
          <div className="md:w-[1088px] flex flex-col md:flex-row md:columns-2 justify-center md:justify-between items-start sm:self-stretch sm:flex-grow-0 sm:flex-shrink-0 gap-4 px-6 md:px-0 pt-12 pb-16 md:py-20">
            <div className="md:w-6/12 flex flex-col justify-center items-start sm:self-stretch sm:flex-grow-0 sm:flex-shrink-0 gap-10">
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-8">
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
                  <div className="flex flex-col justify-start items-start sm:self-stretch sm:flex-grow-0 sm:flex-shrink-0 relative text-2xl text-white gap-3">
                    <h3 className="flex-grow-0 flex-shrink-0">
                      {homeLabel.line1}
                    </h3>
                    <h1 className="flex-grow-0 flex-shrink-0 text-[40px] font-medium capitalize">
                      {homeLabel.line2}
                    </h1>
                    <h3 className="flex-grow-0 flex-shrink-0">
                      {homeLabel.line3}
                    </h3>
                  </div>
                  <p className="text-base text-white/[0.48] whitespace-normal">
                    {homeLabel.line4}
                  </p>
                </div>
              </div>
              <div className="flex w-full md:h-[260px] rounded-lg md:rounded-bl-[100px] md:overflow-hidden">
                <Image
                  src="/assets/images/hero-1.png"
                  className="w-full h-[240px] md:h-full rounded-lg object-cover bg-black"
                  width={288}
                  height={164}
                  alt="hero-1"
                  priority={true}
                  sizes="(min-width: 780px) 544px, calc(97.61vw - 30px)"
                />
              </div>
            </div>
            <div className="md:w-5/12 flex flex-col justify-center items-start sm:self-stretch sm:flex-grow-0 sm:flex-shrink-0 gap-10">
              <div className="flex w-full md:h-[240px] rounded-lg md:rounded-tr-[100px] md:overflow-hidden">
                <Image
                  src="/assets/images/hero-2.png"
                  className="w-full h-[240px] md:h-full rounded-lg object-cover bg-black"
                  width={288}
                  height={164}
                  alt="hero-2"
                  priority={true}
                  sizes="(min-width: 780px) 453px, calc(97.61vw - 30px)"
                />
              </div>
              <div className="flex flex-col justify-start items-start sm:self-stretch sm:flex-grow-0 sm:flex-shrink-0 relative overflow-hidden gap-6">
                <p className="sm:self-stretch sm:flex-grow-0 sm:flex-shrink-0 text-xl">
                  <span className="self-stretch flex-grow-0 flex-shrink-0 text-xl text-white/[0.48]">
                    {homeLabel.from}
                  </span>
                  <span className="self-stretch flex-grow-0 flex-shrink-0 text-xl text-white">
                    {' '}
                  </span>
                  <span className="self-stretch flex-grow-0 flex-shrink-0 text-xl font-medium capitalize text-white">
                    {homeLabel.line5}
                  </span>
                  <span className="self-stretch flex-grow-0 flex-shrink-0 text-xl text-white">
                    {' '}
                  </span>
                  <br />
                  <span className="self-stretch flex-grow-0 flex-shrink-0 text-xl text-white/[0.48]">
                    {homeLabel.to}
                  </span>
                  <span className="self-stretch flex-grow-0 flex-shrink-0 text-xl text-white">
                    {' '}
                  </span>
                  <span className="self-stretch flex-grow-0 flex-shrink-0 text-xl font-medium capitalize text-white">
                    {homeLabel.line6}
                  </span>
                  <span className="self-stretch flex-grow-0 flex-shrink-0 text-xl text-white">
                    {' '}
                  </span>
                  <br />
                  <span className="self-stretch flex-grow-0 flex-shrink-0 text-xl text-white/[0.48]">
                    {homeLabel.to}
                  </span>
                  <span className="self-stretch flex-grow-0 flex-shrink-0 text-xl text-white">
                    {' '}
                  </span>
                  <span className="self-stretch flex-grow-0 flex-shrink-0 text-xl font-medium capitalize text-white">
                    {homeLabel.line7}
                  </span>
                  <span className="self-stretch flex-grow-0 flex-shrink-0 text-xl text-white">
                    .
                  </span>
                </p>
                <p className="sm:self-stretch sm:flex-grow-0 sm:flex-shrink-0 text-base text-white">
                  {homeLabel.line8}
                </p>
              </div>
              <Link
                href="/booking"
                className="btn-primary self-stretch md:self-auto"
              >
                {homeLabel.booknow}
              </Link>
            </div>
          </div>
        </div>

        {/* All Category */}
        <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 bg-[#202124]">
          <div className="md:px-44 flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-14 py-16 md:py-20">
            <Photo />
            {/* <Place /> */}
            <Studio />
          </div>
        </div>
            {/* Package Base Booking */}
            <PackageBase />
        {/* Steps */}
        <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 bg-[#27292d]">
          <div className="md:px-44 flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 overflow-hidden gap-28 px-6 py-16 md:py-20">
            <div className="flex flex-col justify-start items-start flex-grow gap-8">
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                <h1 className="self-stretch flex-grow-0 flex-shrink-0 text-3xl font-medium text-white">
                  {homeLabel.line9}
                </h1>
                <p className="flex-grow-0 flex-shrink-0 text-base text-white/[0.80]">
                  {homeLabel.line10}
                </p>
              </div>
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0">
                <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 overflow-hidden gap-5">
                  <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2 py-1">
                    <GreenDot />
                    <div className="flex-grow w-px bg-[#393b40]" />
                  </div>
                  <div className="flex flex-col justify-start items-start flex-grow relative gap-2 pb-8">
                    <p className="self-stretch flex-grow-0 flex-shrink-0 text-lg font-medium text-white">
                      {homeLabel.book.heading}
                    </p>
                    <p className="self-stretch flex-grow-0 flex-shrink-0 text-sm text-white/[0.48]">
                      {homeLabel.book.des}
                    </p>
                  </div>
                </div>
                <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 overflow-hidden gap-5">
                  <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2 py-1">
                    <GreenDot />
                    <div className="flex-grow w-px bg-[#393b40]" />
                  </div>
                  <div className="flex flex-col justify-start items-start flex-grow relative gap-2 pb-8">
                    <p className="self-stretch flex-grow-0 flex-shrink-0 text-lg font-medium text-white">
                      {homeLabel.match.heading}
                    </p>
                    <p className="self-stretch flex-grow-0 flex-shrink-0 text-sm text-white/[0.48]">
                      {homeLabel.match.des}
                    </p>
                  </div>
                </div>
                <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 overflow-hidden gap-5">
                  <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2 py-1">
                    <GreenDot />
                    <div className="flex-grow w-px bg-[#393b40]" />
                  </div>
                  <div className="flex flex-col justify-start items-start flex-grow relative gap-2 pb-8">
                    <p className="self-stretch flex-grow-0 flex-shrink-0 text-lg font-medium text-white">
                      {homeLabel.shoot.heading}
                    </p>
                    <p className="self-stretch flex-grow-0 flex-shrink-0 text-sm text-white/[0.48]">
                      {homeLabel.shoot.des}
                    </p>
                  </div>
                </div>
                <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 overflow-hidden gap-5">
                  <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2 py-1">
                    <GreenDot />
                    <div className="flex-grow w-px bg-[#393b40]" />
                  </div>
                  <div className="flex flex-col justify-start items-start flex-grow relative gap-2 pb-8">
                    <p className="self-stretch flex-grow-0 flex-shrink-0 text-lg font-medium text-white">
                      {homeLabel.photos.heading}
                    </p>
                    <p className="self-stretch flex-grow-0 flex-shrink-0 text-sm text-white/[0.48]">
                      {homeLabel.photos.des}
                    </p>
                  </div>
                </div>
                <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 overflow-hidden gap-5">
                  <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2 pt-1">
                    <GreenDot />
                  </div>
                  <div className="flex flex-col justify-start items-start flex-grow relative gap-2">
                    <p className="self-stretch flex-grow-0 flex-shrink-0 text-lg font-medium text-white">
                      {homeLabel.real.heading}
                    </p>
                    <p className="self-stretch flex-grow-0 flex-shrink-0 text-sm text-white/[0.48]">
                      {homeLabel.real.des}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Us */}
        <div className="flex flex-col md:flex-row justify-center items-start md:items-center self-stretch flex-grow-0 flex-shrink-0 bg-[#202124]">
          <div className="md:w-[1088px] flex flex-col md:flex-row md:columns-2 justify-start md:justify-between items-start self-stretch flex-grow-0 flex-shrink-0 gap-10 md:gap-16 px-6 md:px-0 py-16 md:py-20">
            <div className="md:w-6/12 flex flex-col justify-center md:justify-start items-start sm:self-stretch sm:flex-grow-0 sm:flex-shrink-0 gap-10 md:gap-4">
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
                <h1 className="self-stretch flex-grow-0 flex-shrink-0 text-4xl font-medium text-white">
                  {homeLabel.line11}
                </h1>
                <p className="flex-grow-0 flex-shrink-0 text-xl text-white/[0.80]">
                  {homeLabel.line12}
                </p>
              </div>
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
                <Image
                  src="/assets/images/home-0.png"
                  className="w-full h-48 md:h-72 rounded-lg object-cover bg-black"
                  width={288}
                  height={164}
                  alt="photography"
                  sizes="(min-width: 780px) 544px, calc(97.61vw - 30px)"
                />
                <p className="self-stretch flex-grow-0 flex-shrink-0 text-sm text-white/[0.80]">
                  {homeLabel.line13}
                </p>
              </div>
            </div>
            <div className="md:w-6/12 flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-10">
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 overflow-hidden gap-[21px]">
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                  <p className="flex-grow-0 flex-shrink-0 text-xl font-semibold capitalize text-white">
                    {homeLabel.easy.heading}
                  </p>
                  <p className="self-stretch flex-grow-0 flex-shrink-0 text-base text-white/[0.48]">
                    {homeLabel.easy.desc}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 overflow-hidden gap-[21px]">
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                  <p className="flex-grow-0 flex-shrink-0 text-xl font-semibold capitalize text-white">
                    {homeLabel.demand.heading}
                  </p>
                  <p className="self-stretch flex-grow-0 flex-shrink-0 text-base text-white/[0.48]">
                    {homeLabel.demand.desc}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 overflow-hidden gap-[21px]">
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                  <p className="flex-grow-0 flex-shrink-0 text-xl font-semibold capitalize text-white">
                    {homeLabel.quality.heading}
                  </p>
                  <p className="self-stretch flex-grow-0 flex-shrink-0 text-base text-white/[0.48]">
                    {homeLabel.quality.desc}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 overflow-hidden gap-[21px]">
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                  <p className="flex-grow-0 flex-shrink-0 text-xl font-semibold capitalize text-white">
                    {homeLabel.deliverd.heading}
                  </p>
                  <p className="self-stretch flex-grow-0 flex-shrink-0 text-base text-white/[0.48]">
                    <span className="self-stretch flex-grow-0 flex-shrink-0 text-base text-white/[0.48]">
                      {homeLabel.deliverd.desc1}
                    </span>
                    <br />
                    <span className="self-stretch flex-grow-0 flex-shrink-0 text-base text-white/[0.48]">
                      {homeLabel.deliverd.desc2}
                    </span>
                  </p>
                </div>
              </div>
              <Link
                href="/booking"
                className="btn-primary self-stretch md:self-auto"
              >
                {homeLabel.booknow}
              </Link>
            </div>
          </div>
        </div>

        {/* Studio Signup */}
        <div className="flex flex-col md:flex-row justify-center items-start self-stretch flex-grow-0 flex-shrink-0 bg-[#27292d]">
          <div className="md:w-[1088px] flex flex-col md:flex-row md:columns-2 justify-center items-center self-stretch flex-grow-0 flex-shrink-0 gap-6 md:gap-16 px-6 py-16">
            <div className="md:w-7/12 flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-6 rounded-2xl">
              <p className="self-stretch flex-grow-0 flex-shrink-0 text-4xl font-medium text-white">
                {homeLabel.line14}
              </p>
              <p className="self-stretch flex-grow-0 flex-shrink-0 text-base text-white">
                <span className="text-white/[0.48]">
                  {homeLabel.photographer.text1}{' '}
                </span>
                <span className="font-medium">
                  {homeLabel.photographer.text2}
                </span>
                <span className="text-white/[0.48]">
                  {' '}
                  {homeLabel.photographer.text3}
                </span>
              </p>
            </div>
            <div className="flex self-stretch md:self-auto">
              <a
                href="https://frontend.staging.clickezy.com/onboard/"
                target="_blank"
                className="btn-primary flex-grow md:flex-grow-0 bg-[#2e2f34]"
                rel="noreferrer"
              >
                {homeLabel.signup}
              </a>
            </div>
          </div>
        </div>

        {/* Hire Studio */}
        <div className="flex flex-col justify-center items-start self-stretch flex-grow-0 flex-shrink-0 bg-[#202124]">
          <div className="md:px-44 flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 px-6 py-16 md:py-20">
            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-16">
              {/*  */}
              <div className="flex flex-col md:flex-row md:columns-2 justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-8 p-6 rounded-3xl bg-[#2e2f34]">
                <div className="md:w-[370px] h-[168px] md:h-auto flex justify-start self-stretch flex-grow-0 flex-shrink-0 relative gap-2 md:gap-4">
                  <Image
                    src="/assets/images/home-1.png"
                    className="w-full rounded-lg object-cover bg-black"
                    width={288}
                    height={164}
                    alt=""
                    sizes="(min-width: 780px) 177px, calc(50vw - 52px)"
                  />
                  <Image
                    src="/assets/images/home-2.png"
                    className="w-full rounded-lg object-cover bg-black"
                    width={288}
                    height={164}
                    alt=""
                    sizes="(min-width: 780px) 177px, calc(50vw - 52px)"
                  />
                </div>
                <div className="flex flex-col justify-start items-center md:justify-center self-stretch flex-grow flex-shrink gap-8 md:gap-6">
                  <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-4">
                    <div className="self-stretch flex-grow-0 flex-shrink-0 text-4xl md:text-3xl font-medium text-white">
                      <span>{homeLabel.line16} </span>
                      <span className="text-[#2d99f8]">
                        {homeLabel.line17}{' '}
                      </span>
                      <span>{homeLabel.line18} </span>
                      <Typewriter
                        options={{
                          strings: COMMON.TYPE_WRITER,
                          autoStart: true,
                          loop: true,
                          wrapperClassName: 'capitalize text-[#f5cc1b]',
                        }}
                      />
                    </div>
                    <p className="text-base text-white/[0.48]">
                      {homeLabel.line19}
                    </p>
                  </div>
                  <Link
                    href="/booking"
                    className="btn-primary self-stretch md:self-auto"
                  >
                    {homeLabel.booknow}
                  </Link>
                </div>
              </div>
              {/*  */}
              <div className="flex flex-col md:flex-row md:columns-2 justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-8">
                <div className="md:w-7/12 flex flex-col justify-start items-start sm:self-stretch sm:flex-grow-0 sm:flex-shrink-0 gap-8">
                  <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-5">
                    <p className="self-stretch flex-grow-0 flex-shrink-0 text-4xl font-medium text-white">
                      {homeLabel.line20}
                    </p>
                    <Image
                      src="/assets/images/home-3.png"
                      className="w-full rounded-lg object-cover bg-black md:hidden"
                      width={288}
                      height={180}
                      alt=""
                      sizes="calc(41.67vw - 179px)"
                    />
                    <p className="self-stretch flex-grow-0 flex-shrink-0 text-base md:text-lg text-white/[0.48]">
                      {homeLabel.line21}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-4">
                    <button className="btn-primary self-stretch md:self-auto">
                      {homeLabel.get_frame}
                    </button>
                    <button className="btn-primary self-stretch md:self-auto` bg-[#2e2f34]">
                      {homeLabel.make_photo}
                    </button>
                  </div>
                </div>
                <div className="hidden md:flex w-5/12 h-64">
                  <Image
                    src="/assets/images/home-3.png"
                    className="w-full rounded-lg object-cover bg-black"
                    width={288}
                    height={180}
                    alt=""
                    sizes="calc(41.67vw - 179px)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PrimaryLayout>
  );
}
