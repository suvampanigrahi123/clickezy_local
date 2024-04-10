import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCyHQSok2m-l1IDu3X92guo_gVrZdliaj0',
  authDomain: 'clickezy-c51c8.firebaseapp.com',
  projectId: 'clickezy-c51c8',
  storageBucket: 'clickezy-c51c8.appspot.com',
  messagingSenderId: '751425821416',
  appId: '1:751425821416:web:3d5114ad9cf8c85e3b875d',
  measurementId: 'G-RLY1M6R9Q1',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
