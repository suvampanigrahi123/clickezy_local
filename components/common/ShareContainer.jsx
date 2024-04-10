import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
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

const ShareContainer = (title) => {
  const { asPath } = useRouter();
  const [url, setUrl] = useState('');
  useEffect(() => {
    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : '';

    const URL = `${origin}${asPath}`;
    setUrl(URL);
  }, [title]);

  return (
    <div className="flex items-center justify-center flex-1 gap-5 bg-white/20">
      <div className="Demo__some-network">
        <FacebookShareButton url={url} className="">
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </div>
      <div>
        <FacebookMessengerShareButton
          url={url}
          appId="521270401588372"
          className=""
        >
          <FacebookMessengerIcon size={32} round />
        </FacebookMessengerShareButton>
      </div>
      <div>
        <TelegramShareButton url={url} title={title} className="">
          <TelegramIcon size={32} round />
        </TelegramShareButton>
      </div>
      <div>
        <WhatsappShareButton url={url} title={title} className="">
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
    </div>
  );
};

export default ShareContainer;
