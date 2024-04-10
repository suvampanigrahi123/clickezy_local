export const environment = {
  production: false,
  baseUrl: 'https://user.staging.clickezy.com/api/v1',
  store: 'https://store.staging.clickezy.com/api/v1',
};

// Constants.js
const prod = {
  url: {
    API_URL: 'https://clickezy-dev.netlify.app',
  },
};

export const dev = {
  baseUrl: 'http://localhost:8002/api/v1',
  store: 'http://localhost:8002/api/v1'
};
export const config = process.env.NODE_ENV === 'development' ? dev : prod;
