// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKv7XoSWiRllqhXESlbQMR6CUYB4lT-Ug",
  authDomain: "mediaminer-9da1b.firebaseapp.com",
  projectId: "mediaminer-9da1b",
  storageBucket: "mediaminer-9da1b.firebasestorage.app",
  messagingSenderId: "997250704513",
  appId: "1:997250704513:web:c105ec00a1ba543f355980",
  measurementId: "G-D4PSKJP9P3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth, analytics };
