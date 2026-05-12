// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDW9Lo5OlMwTJb3_5rWq_bvKVb2DAVHS8c",
  authDomain: "rms-alerts-b10ab.firebaseapp.com",
  projectId: "rms-alerts-b10ab",
  storageBucket: "rms-alerts-b10ab.firebasestorage.app",
  messagingSenderId: "151019487398",
  appId: "1:151019487398:web:36012f1f83460c69b73467",
  measurementId: "G-L1CTXM4QET"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const messaging = getMessaging(app);




