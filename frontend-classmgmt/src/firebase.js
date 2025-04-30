// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {  GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDk0ZnuLNA-_PrafkEROE3-1XiD_-KhPj4",
  authDomain: "classmgmt-aa87d.firebaseapp.com",
  projectId: "classmgmt-aa87d",
  storageBucket: "classmgmt-aa87d.firebasestorage.app",
  messagingSenderId: "60650241423",
  appId: "1:60650241423:web:aca89a25df9e7d09291ffa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth};


