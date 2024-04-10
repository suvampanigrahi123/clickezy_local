import { handle401 } from './handle401';

export const printLog = (error, type) => {
  if (error.response) {
    if (error?.response?.status === 401) {  
       handle401(error, type);
    }
  }
};
