// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtCoOBagybTTByIeLEc_B-nSNmhXFPX1s",
  authDomain: "echo-deals.firebaseapp.com",
  projectId: "echo-deals",
  storageBucket: "echo-deals.firebasestorage.app",
  messagingSenderId: "340855440980",
  appId: "1:340855440980:web:179601e5cb964994868fc1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)