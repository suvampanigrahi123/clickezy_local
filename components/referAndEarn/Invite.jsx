import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-hot-toast';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import useSWR from 'swr';
import * as api from '../../services/userService';
import {
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

import Drawer from '../common/Drawer';

const Invite = ({ referDetails }) => {
  const { userId } = useUser();
  const [referLink, setReferLink] = useState('');
  const [referTitle, setReferTitle] = useState('join clickezy');
  const [isOpen, setIsOpen] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const referData = referDetails?.referDataDTO;
  const referCode = referData?.refer_code;

  const { data, error } = useSWR(
    userId && ['/refer-dashboard/', userId],
    () => api.getReferDashboard(userId),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  if (error) {
    toast.error('Failed to load dashboard');
  }

  useEffect(() => {
    setReferLink(`https://clickezy.com?refercode=${referCode}`);
  }, []);

  const shareReferLink = () => {
    setIsOpen(true);
  };

  function closeModal() {
    setIsOpen(false);
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referLink);
    toast.success('Referral link copied to clipboard');
  };
  return (
    <>
      <div className="w-full flex flex-col gap-4 mt-4 p-4 md:px-10 bg-[#252529] border border-[#252529] rounded-[10px] shadow text-white ">
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-2xl">Share the referral link</h2>
            <p className="text-sm text-gray-400">
              You can also share personal referral link by copying and sending
              it or sharing it on your social media.
            </p>
          </div>
        </div>
        <div>
          <div className="relative w-full">
            <input
              type="text"
              id="voice-search"
              className="border text-sm rounded-[10px] formInput  block w-full p-2.5  bg-[#19191C] border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              value={referLink}
              readOnly
            />
          </div>
        </div>
        <div className="w-full flex items-center justify-between gap-3">
          <div className="flex items-center flex-col w-full">
            <button
              onClick={shareReferLink}
              className="text-white w-full bg-[#10813F] hover:bg-[#128f46] focus:ring-4 focus:ring-blue-300 font-medium text-sm rounded-[10px] px-3 py-3"
            >
              Share
            </button>
          </div>
        </div>
      </div>
      {/* Refer Details */}
      <div className="w-full mt-4 p-4 md:px-10 bg-[#CFFFC3] border-gray-200 rounded-[10px] shadow  ">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center flex-col">
            <div className="text-2xl font-bold">{data?.invited}</div>
            <div>Invited</div>
          </div>
          <div className="flex items-center flex-col">
            <div className="text-2xl font-bold">{data?.joined}</div>
            <div>Joined</div>
          </div>
          <div className="flex items-center flex-col">
            <div className="text-2xl font-bold">{data?.booked}</div>
            <div>Booked</div>
          </div>
        </div>
      </div>

      <Drawer
        title="Share"
        closeModal={closeModal}
        isOpen={isOpen}
        height="h-2/5"
      >
        <div className="flex w-full p-4">
          <div className="flex  flex-1 gap-5 flex-wrap">
            <div className="flex flex-col items-center justify-center gap-2">
              <WhatsappShareButton url={referLink} title={referTitle}>
                <WhatsappIcon size={40} round />
              </WhatsappShareButton>
              <span className="text-white text-xs">Whatsapp</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <FacebookShareButton url={referLink} className="">
                <FacebookIcon size={40} round />
              </FacebookShareButton>
              <span className="text-white text-xs">Facebook</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <FacebookMessengerShareButton url={referLink}>
                <FacebookMessengerIcon size={40} round />
              </FacebookMessengerShareButton>
              <span className="text-white text-xs">Messenger</span>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <TelegramShareButton url={referLink} title={referTitle}>
                <TelegramIcon size={40} round />
              </TelegramShareButton>
              <span className="text-white text-xs">Telegram</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <button onClick={copyToClipboard}>
                <DocumentDuplicateIcon className="text-gray-300 h-10 w-10" />
              </button>
              <span className="text-white text-xs">Clipboard</span>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Invite;
