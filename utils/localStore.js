import { AES, enc } from 'crypto-js';
import { printLog } from '../helper/printLog';
const secretKey = 'akash@123';

export const setLocalStorage = (key, item) => {
  try {
    if (typeof window !== 'undefined') {
      const encryptedValue = AES.encrypt(
        JSON.stringify(item),
        secretKey
      ).toString();
      localStorage.setItem(key, encryptedValue);
    }
  } catch (error) {
    printLog(error);
  }
};

export const getLocalStorage = (key) => {
  try {
    let data = '';
    if (typeof window !== 'undefined') {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue || encryptedValue === 'undefined') {
        return null;
      }
      const bytes = AES.decrypt(encryptedValue, secretKey).toString(enc.Utf8);
      if (!bytes || bytes === 'undefined') {
        return null;
      }
      data = JSON.parse(bytes);
      return data;
    }
  } catch (error) {
    printLog(error);
  }
};

export const removeLocalStorage = (key) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch (error) {
    printLog(error);
  }
};
