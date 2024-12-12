// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC3en61xPELy0-T1HiK4qSg1H7oU0FH5_k",
    authDomain: "long-state-444417-r5.firebaseapp.com",
    projectId: "long-state-444417-r5",
    storageBucket: "long-state-444417-r5.firebasestorage.app",
    messagingSenderId: "673514120333",
    appId: "1:673514120333:web:16f0fc682b3877464a6ec4",
    measurementId: "G-EKR7B3B8TB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);