// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFHgYTxg51yJPkGri1Rgky92sJHE5yT18",
  authDomain: "et-proforma.firebaseapp.com",
  projectId: "et-proforma",
  storageBucket: "et-proforma.appspot.com",
  messagingSenderId: "663605194810",
  appId: "1:663605194810:web:e1e75a951580e6a1a4c503",
  measurementId: "G-7MGCRFKS7K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);