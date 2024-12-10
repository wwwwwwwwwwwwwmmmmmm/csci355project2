// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqG3uwzRGEkDtdiLYXlRECwtewog9KnE8",
  authDomain: "pro2-31ac0.firebaseapp.com",
  projectId: "pro2-31ac0",
  storageBucket: "pro2-31ac0.firebasestorage.app",
  messagingSenderId: "979495892487",
  appId: "1:979495892487:web:208d33af46c55956869ca2",
  measurementId: "G-VNN73P34T7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);