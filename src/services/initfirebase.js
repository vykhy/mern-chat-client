// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAW79VD4ntRV9l-CR_hTlnt_-pp6FT1DpM",
  authDomain: "portfolio-apps-cd8c0.firebaseapp.com",
  projectId: "portfolio-apps-cd8c0",
  storageBucket: "portfolio-apps-cd8c0.appspot.com",
  messagingSenderId: "877871904916",
  appId: "1:877871904916:web:5d64ee1c0f9b3b6e4bdc81",
  measurementId: "G-ZMGG094WHL",
};

// Initialize Firebase
const initFirebase = () => {
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
};

export default initFirebase