import Link from 'next/link';
import { homeLabel } from '../../constants/labelText';
import { memo } from 'react';
import Image from 'next/image';
import FooterService from './FooterService';

function Footer() {
  return (
    <footer className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0">
      <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 px-8 py-16 bg-[#0C0D10]">
        <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-16">
          {/* <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-6 px-[60px]">
            <svg
              width={32}
              height={33}
              viewBox="0 0 32 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-grow-0 flex-shrink-0 w-8 h-8 relative"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M17.8627 28.3419V17.4139H21.5493L22.0973 13.1353H17.8627V10.4099C17.8627 9.17526 18.2067 8.32993 19.9787 8.32993H22.224V4.51526C21.1315 4.39818 20.0334 4.34165 18.9347 4.34593C15.676 4.34593 13.4387 6.33526 13.4387 9.98726V13.1273H9.776V17.4059H13.4467V28.3419H17.8627Z"
                fill="white"
              />
            </svg>
            <svg
              width={32}
              height={33}
              viewBox="0 0 32 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-grow-0 flex-shrink-0 w-8 h-8 relative"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M11.92 25.286C13.6091 25.2966 15.2836 24.9718 16.8462 24.3303C18.4088 23.6888 19.8285 22.7434 21.0229 21.5489C22.2174 20.3545 23.1627 18.9348 23.8043 17.3722C24.4458 15.8096 24.7706 14.1352 24.76 12.446V11.856C25.6356 11.2145 26.3935 10.4262 27 9.52601C26.1755 9.88661 25.3031 10.1258 24.41 10.236C25.3569 9.67179 26.0674 8.78368 26.41 7.73601C25.5275 8.26545 24.5598 8.63765 23.55 8.83601C22.8699 8.11138 21.97 7.63107 20.9895 7.4694C20.0089 7.30773 19.0024 7.47371 18.1257 7.94167C17.249 8.40962 16.551 9.15346 16.1396 10.0581C15.7282 10.9627 15.6264 11.9777 15.85 12.946C14.056 12.858 12.3007 12.393 10.6984 11.5815C9.096 10.77 7.68254 9.63009 6.55 8.23601C5.97892 9.22719 5.80583 10.3983 6.06576 11.5123C6.32569 12.6263 6.99923 13.5999 7.95 14.236C7.24861 14.209 6.56345 14.0171 5.95 13.676V13.726C5.94377 14.7618 6.29272 15.7685 6.9387 16.5783C7.58469 17.388 8.48867 17.9519 9.5 18.176C8.84764 18.3515 8.16429 18.3788 7.5 18.256C7.79278 19.1394 8.35168 19.9106 9.10005 20.4638C9.84841 21.017 10.7496 21.3252 11.68 21.346C10.0892 22.6265 8.11209 23.3314 6.07 23.346C5.71195 23.3357 5.35475 23.3056 5 23.256C7.06696 24.5729 9.4692 25.2672 11.92 25.256"
                fill="white"
              />
            </svg>
            <svg
              width={32}
              height={33}
              viewBox="0 0 32 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-grow-0 flex-shrink-0 w-8 h-8 relative"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M16 9.93667C12.4531 9.93667 9.59062 12.7992 9.59062 16.346C9.59062 19.8929 12.4531 22.7554 16 22.7554C19.5469 22.7554 22.4094 19.8929 22.4094 16.346C22.4094 12.7992 19.5469 9.93667 16 9.93667ZM16 20.5117C13.7062 20.5117 11.8344 18.6398 11.8344 16.346C11.8344 14.0523 13.7062 12.1804 16 12.1804C18.2937 12.1804 20.1656 14.0523 20.1656 16.346C20.1656 18.6398 18.2937 20.5117 16 20.5117ZM22.6719 8.18042C21.8437 8.18042 21.175 8.84917 21.175 9.6773C21.175 10.5054 21.8437 11.1742 22.6719 11.1742C23.5 11.1742 24.1687 10.5085 24.1687 9.6773C24.169 9.48066 24.1304 9.2859 24.0553 9.10418C23.9802 8.92246 23.8699 8.75734 23.7309 8.6183C23.5918 8.47925 23.4267 8.369 23.245 8.29386C23.0633 8.21872 22.8685 8.18018 22.6719 8.18042V8.18042ZM28.4937 16.346C28.4937 14.621 28.5094 12.9117 28.4125 11.1898C28.3156 9.1898 27.8594 7.4148 26.3969 5.9523C24.9312 4.48667 23.1594 4.03355 21.1594 3.93667C19.4344 3.8398 17.725 3.85542 16.0031 3.85542C14.2781 3.85542 12.5687 3.8398 10.8469 3.93667C8.84687 4.03355 7.07187 4.4898 5.60937 5.9523C4.14375 7.41792 3.69062 9.1898 3.59375 11.1898C3.49687 12.9148 3.5125 14.6242 3.5125 16.346C3.5125 18.0679 3.49687 19.7804 3.59375 21.5023C3.69062 23.5023 4.14687 25.2773 5.60937 26.7398C7.075 28.2054 8.84687 28.6585 10.8469 28.7554C12.5719 28.8523 14.2812 28.8367 16.0031 28.8367C17.7281 28.8367 19.4375 28.8523 21.1594 28.7554C23.1594 28.6585 24.9344 28.2023 26.3969 26.7398C27.8625 25.2742 28.3156 23.5023 28.4125 21.5023C28.5125 19.7804 28.4937 18.071 28.4937 16.346V16.346ZM25.7437 23.7148C25.5156 24.2835 25.2406 24.7085 24.8 25.146C24.3594 25.5867 23.9375 25.8617 23.3687 26.0898C21.725 26.7429 17.8219 26.596 16 26.596C14.1781 26.596 10.2719 26.7429 8.62812 26.0929C8.05937 25.8648 7.63437 25.5898 7.19687 25.1492C6.75625 24.7085 6.48125 24.2867 6.25312 23.7179C5.60312 22.071 5.75 18.1679 5.75 16.346C5.75 14.5242 5.60312 10.6179 6.25312 8.97417C6.48125 8.40542 6.75625 7.98042 7.19687 7.54292C7.6375 7.10542 8.05937 6.8273 8.62812 6.59917C10.2719 5.94917 14.1781 6.09605 16 6.09605C17.8219 6.09605 21.7281 5.94917 23.3719 6.59917C23.9406 6.8273 24.3656 7.1023 24.8031 7.54292C25.2437 7.98355 25.5187 8.40542 25.7469 8.97417C26.3969 10.6179 26.25 14.5242 26.25 16.346C26.25 18.1679 26.3969 22.071 25.7437 23.7148Z"
                fill="white"
              />
            </svg>
          </div> */}
          <div className="flex flex-col md:flex-row md:flex-wrap justify-start items-center flex-grow-0 flex-shrink-0 gap-16">
            <div className="md:w-[30%] md:pl-12 flex flex-col justify-start flex-grow-0 flex-shrink-0 relative gap-4">
              <Image
                src={'/clickezy.svg'}
                width={50}
                height={50}
                className="w-36 h-14"
                alt="clickezy"
              />
              <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 relative gap-4">
                <p className="flex-grow-0 flex-shrink-0 text-base text-white">
                  Capturing Moments, Creating Memories: Customized Photoframes
                  by{' '}
                  <Link href={'/'} className="text-blue-500">
                    clickEzy.com
                  </Link>
                  .
                </p>
                <p className="flex-grow-0 flex-shrink-0 text-base text-white">
                  Feel free to customize it based on the photographer's style or
                  specialty
                </p>
              </div>
              <div className="text-white">
                <p className="font-bold">Connect With Us</p>
                <div className="flex self-stretch flex-grow-0 flex-shrink-0 relative gap-3 mt-2">
                  <Link href={'/'} className="bg-blue-600 rounded-full">
                    <svg
                      width={32}
                      height={33}
                      viewBox="0 0 32 33"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-grow-0 flex-shrink-0 w-8 h-8 relative"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        d="M17.8627 28.3419V17.4139H21.5493L22.0973 13.1353H17.8627V10.4099C17.8627 9.17526 18.2067 8.32993 19.9787 8.32993H22.224V4.51526C21.1315 4.39818 20.0334 4.34165 18.9347 4.34593C15.676 4.34593 13.4387 6.33526 13.4387 9.98726V13.1273H9.776V17.4059H13.4467V28.3419H17.8627Z"
                        fill="white"
                      />
                    </svg>
                  </Link>
                  <Link href={'/'} className="bg-blue-600 rounded-full">
                    <svg
                      width={32}
                      height={33}
                      viewBox="0 0 32 33"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-grow-0 flex-shrink-0 w-8 h-8 relative"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        d="M11.92 25.286C13.6091 25.2966 15.2836 24.9718 16.8462 24.3303C18.4088 23.6888 19.8285 22.7434 21.0229 21.5489C22.2174 20.3545 23.1627 18.9348 23.8043 17.3722C24.4458 15.8096 24.7706 14.1352 24.76 12.446V11.856C25.6356 11.2145 26.3935 10.4262 27 9.52601C26.1755 9.88661 25.3031 10.1258 24.41 10.236C25.3569 9.67179 26.0674 8.78368 26.41 7.73601C25.5275 8.26545 24.5598 8.63765 23.55 8.83601C22.8699 8.11138 21.97 7.63107 20.9895 7.4694C20.0089 7.30773 19.0024 7.47371 18.1257 7.94167C17.249 8.40962 16.551 9.15346 16.1396 10.0581C15.7282 10.9627 15.6264 11.9777 15.85 12.946C14.056 12.858 12.3007 12.393 10.6984 11.5815C9.096 10.77 7.68254 9.63009 6.55 8.23601C5.97892 9.22719 5.80583 10.3983 6.06576 11.5123C6.32569 12.6263 6.99923 13.5999 7.95 14.236C7.24861 14.209 6.56345 14.0171 5.95 13.676V13.726C5.94377 14.7618 6.29272 15.7685 6.9387 16.5783C7.58469 17.388 8.48867 17.9519 9.5 18.176C8.84764 18.3515 8.16429 18.3788 7.5 18.256C7.79278 19.1394 8.35168 19.9106 9.10005 20.4638C9.84841 21.017 10.7496 21.3252 11.68 21.346C10.0892 22.6265 8.11209 23.3314 6.07 23.346C5.71195 23.3357 5.35475 23.3056 5 23.256C7.06696 24.5729 9.4692 25.2672 11.92 25.256"
                        fill="white"
                      />
                    </svg>
                  </Link>
                  <Link href={'/'} className="bg-blue-600 rounded-full">
                    <svg
                      width={32}
                      height={33}
                      viewBox="0 0 32 33"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-grow-0 flex-shrink-0 w-8 h-8 relative"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        d="M16 9.93667C12.4531 9.93667 9.59062 12.7992 9.59062 16.346C9.59062 19.8929 12.4531 22.7554 16 22.7554C19.5469 22.7554 22.4094 19.8929 22.4094 16.346C22.4094 12.7992 19.5469 9.93667 16 9.93667ZM16 20.5117C13.7062 20.5117 11.8344 18.6398 11.8344 16.346C11.8344 14.0523 13.7062 12.1804 16 12.1804C18.2937 12.1804 20.1656 14.0523 20.1656 16.346C20.1656 18.6398 18.2937 20.5117 16 20.5117ZM22.6719 8.18042C21.8437 8.18042 21.175 8.84917 21.175 9.6773C21.175 10.5054 21.8437 11.1742 22.6719 11.1742C23.5 11.1742 24.1687 10.5085 24.1687 9.6773C24.169 9.48066 24.1304 9.2859 24.0553 9.10418C23.9802 8.92246 23.8699 8.75734 23.7309 8.6183C23.5918 8.47925 23.4267 8.369 23.245 8.29386C23.0633 8.21872 22.8685 8.18018 22.6719 8.18042V8.18042ZM28.4937 16.346C28.4937 14.621 28.5094 12.9117 28.4125 11.1898C28.3156 9.1898 27.8594 7.4148 26.3969 5.9523C24.9312 4.48667 23.1594 4.03355 21.1594 3.93667C19.4344 3.8398 17.725 3.85542 16.0031 3.85542C14.2781 3.85542 12.5687 3.8398 10.8469 3.93667C8.84687 4.03355 7.07187 4.4898 5.60937 5.9523C4.14375 7.41792 3.69062 9.1898 3.59375 11.1898C3.49687 12.9148 3.5125 14.6242 3.5125 16.346C3.5125 18.0679 3.49687 19.7804 3.59375 21.5023C3.69062 23.5023 4.14687 25.2773 5.60937 26.7398C7.075 28.2054 8.84687 28.6585 10.8469 28.7554C12.5719 28.8523 14.2812 28.8367 16.0031 28.8367C17.7281 28.8367 19.4375 28.8523 21.1594 28.7554C23.1594 28.6585 24.9344 28.2023 26.3969 26.7398C27.8625 25.2742 28.3156 23.5023 28.4125 21.5023C28.5125 19.7804 28.4937 18.071 28.4937 16.346V16.346ZM25.7437 23.7148C25.5156 24.2835 25.2406 24.7085 24.8 25.146C24.3594 25.5867 23.9375 25.8617 23.3687 26.0898C21.725 26.7429 17.8219 26.596 16 26.596C14.1781 26.596 10.2719 26.7429 8.62812 26.0929C8.05937 25.8648 7.63437 25.5898 7.19687 25.1492C6.75625 24.7085 6.48125 24.2867 6.25312 23.7179C5.60312 22.071 5.75 18.1679 5.75 16.346C5.75 14.5242 5.60312 10.6179 6.25312 8.97417C6.48125 8.40542 6.75625 7.98042 7.19687 7.54292C7.6375 7.10542 8.05937 6.8273 8.62812 6.59917C10.2719 5.94917 14.1781 6.09605 16 6.09605C17.8219 6.09605 21.7281 5.94917 23.3719 6.59917C23.9406 6.8273 24.3656 7.1023 24.8031 7.54292C25.2437 7.98355 25.5187 8.40542 25.7469 8.97417C26.3969 10.6179 26.25 14.5242 26.25 16.346C26.25 18.1679 26.3969 22.071 25.7437 23.7148Z"
                        fill="white"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            {/*  */}

            <div className="md:w-52 flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 relative gap-4">
              <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-white/40">
                {homeLabel.company.title}
              </p>
              <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 relative gap-4">
                <p className="flex-grow-0 flex-shrink-0 text-base text-white">
                  {homeLabel.company.about}
                </p>
                <p className="flex-grow-0 flex-shrink-0 text-base text-white">
                  {homeLabel.company.team}
                </p>
                <p className="flex-grow-0 flex-shrink-0 text-base text-white">
                  {homeLabel.company.contact}
                </p>
                <p className="flex-grow-0 flex-shrink-0 text-base text-white">
                  {homeLabel.company.faq}
                </p>
                <p className="flex-grow-0 flex-shrink-0 text-base text-white">
                  {homeLabel.company.blog}
                </p>
              </div>
            </div>
            <div className="md:w-52 flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 relative gap-4">
              <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-white/40">
                {homeLabel.service.title}
              </p>
              <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 relative gap-4">
                <FooterService key={'footer-service'} />
              </div>
            </div>
            <div className="md:w-52 flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 gap-4">
              <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 relative gap-4">
                <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-white/40">
                  {homeLabel.service.tnc}
                </p>
                <p className="flex-grow-0 flex-shrink-0 text-base text-white">
                  {homeLabel.service.privacy}
                </p>
                <p className="flex-grow-0 flex-shrink-0 text-base text-white">
                  {homeLabel.service.cookie}
                </p>
                <p className="flex-grow-0 flex-shrink-0 text-base text-white">
                  {homeLabel.service.abuse}
                </p>
                <p className="flex-grow-0 flex-shrink-0 text-base text-white">
                  {homeLabel.service.security}
                </p>
                <p className="flex-grow-0 flex-shrink-0 text-base text-white">
                  {homeLabel.service.home}
                </p>
              </div>
            </div>
          </div>
          <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-white/[0.48]">
            <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-white/[0.48]">
              {'©' + new Date().getFullYear()} {homeLabel.pvt_lmt}
            </span>
            <br />
            <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-white/[0.48]">
              {homeLabel.reserved}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
export default memo(Footer);
