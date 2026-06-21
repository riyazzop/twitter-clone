// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwLwoppbsA4wWZVTh_s1XorATq6Nu9wpQ",
  authDomain: "twitter-45e7e.firebaseapp.com",
  projectId: "twitter-45e7e",
  storageBucket: "twitter-45e7e.firebasestorage.app",
  messagingSenderId: "620085951064",
  appId: "1:620085951064:web:05d7644d7afdd608e6682d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export default app
