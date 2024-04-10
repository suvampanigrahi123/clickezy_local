/* eslint-disable import/no-extraneous-dependencies */
import '../styles/globals.css';
import 'react-loading-skeleton/dist/skeleton.css';
import Head from 'next/head';
import 'react-lazy-load-image-component/src/effects/blur.css';

//* Redux Store & Provider
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from '../redux/store';

import { Toaster } from 'react-hot-toast';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';

import { SWRConfig } from 'swr';
import { options } from '../config/swrConfig';

// Progress Bar
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useEffect, useRef } from 'react';
import { setLocalStorage } from '../utils/localStore';
import { getMessaging, getToken } from 'firebase/messaging';
import { app } from './api/firebase-messaging-sw';
import { COMMON } from '../constants/const';
import { UserProvider } from '../context/UserContext';

function App({ Component, pageProps }) {
  Router.events.on('routeChangeStart', () => NProgress.start());
  Router.events.on('routeChangeComplete', () => NProgress.done());
  Router.events.on('routeChangeError', () => NProgress.done());
  NProgress.configure({ ease: 'ease', speed: 500 });
  NProgress.configure({ showSpinner: false });
  const usePreviousRoute = () => {
    const { asPath } = useRouter();
    const ref = useRef;
    useEffect(() => {
      ref.current = asPath;
    }, [asPath]);
    return ref.current;
  };
  // TODO: Remove this prevRoute to a hook
  const prevRoute = usePreviousRoute();
  setLocalStorage('prevRoute', prevRoute);

  function requestPermission() {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        const messaging = getMessaging(app);
        getToken(messaging, {
          vapidKey:
            'BDxjWk2h9kJrUyBUNaMCqBZI8JnrChOvJam51hRFpB4iRahaWs8EsmZ1rSWXPWs5S4hw-k77UXwkbpxFyOej25M',
        }).then((currentToken) => {
          if (currentToken) {
            setLocalStorage(COMMON.FIREBASE_TOKEN, currentToken);
          }
        });
      }
    });
  }

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      requestPermission();
    }
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Head>
        <title>Clickezy</title>
        <meta name="title" content="clcikezy" />
        <meta
          name="description"
          content="Capturing Moments, Creating Memories: Customized Photoframes by clickEzy.com.Feel free to customize it based on the photographer's style or specialty"
        />
        <meta
          name="keywords"
          content="clickezy,clickEzy,clickezy.com,https://clickezy-qa.vercel.app,Book a Great Photographer, On-Demand Photoshoots"
        />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="5 days" />
      </Head>
      <GoogleOAuthProvider clientId="1007285704729-4u8op9rfg0sh7rvqs7e95e8h1p5hemmt.apps.googleusercontent.com">
        <UserProvider>
          <Provider store={store}>
            <SWRConfig value={options}>
              <Component {...pageProps} />
            </SWRConfig>
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                className: '',
                duration: 5000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </Provider>
        </UserProvider>
      </GoogleOAuthProvider>
    </>
  );
}
export default App;
