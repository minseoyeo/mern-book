// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-book-26de7.firebaseapp.com",
  projectId: "mern-book-26de7",
  storageBucket: "mern-book-26de7.appspot.com",
  messagingSenderId: "159818196864",
  appId: "1:159818196864:web:7e97ca318ad4cd19640365"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;