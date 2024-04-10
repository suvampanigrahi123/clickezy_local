import React from 'react';

import FacebookLogin from '@greatsumini/react-facebook-login';

const FLogin = () => {
  return (
    <>
      <FacebookLogin
        appId="1340793996526285"
        style={{
          backgroundColor: '#4267b2',
          color: '#fff',
          fontSize: '16px',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '4px',
        }}
        onSuccess={(response) => {
          console.log('Login Success!', response);
        }}
        onFail={(error) => {
          console.log('Login Failed!', error);
        }}
        onProfileSuccess={(response) => {
          console.log('Get Profile Success!', response);
        }}
      />
    </>
  );
};

export default FLogin;
