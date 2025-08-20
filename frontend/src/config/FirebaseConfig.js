// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbFeW4_vmVzTcbK2aFbrAYMdWyOLX_p7M",
  authDomain: "testing-88c54.firebaseapp.com",
  databaseURL: "https://testing-88c54-default-rtdb.firebaseio.com",
  projectId: "testing-88c54",
  storageBucket: "testing-88c54.firebasestorage.app",
  messagingSenderId: "451885208972",
  appId: "1:451885208972:web:bf5284504e1f28365af2a9",
  measurementId: "G-ZVZF4LG97M",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);



