export const initializeFbSDK = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src =
      'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
    // document.body.appendChild(script);

    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    initFacebookSdk();

    document.body.appendChild(script);
  });
};

export const initFacebookSdk = () => {
  return new Promise((resolve, reject) => {
    // Load the Facebook SDK asynchronously
    window.FB.init({
      appId: '1340793996526285',
      cookie: true,
      xfbml: true,
      version: 'v18.0',
    });
    resolve(true);
  });
};

export const getFacebookLoginStatus = () => {
  return new Promise((resolve, reject) => {
    window.FB.getLoginStatus((response) => {
      resolve(response);
    });
  });
};

export const fbLogin = () => {
  return new Promise((resolve, reject) => {
    window.FB.login((response) => {
      resolve(response);
    });
  });
};
