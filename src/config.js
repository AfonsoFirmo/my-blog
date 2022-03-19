// Import the functions you need from the SDKs you need
// Uses Web version 9 (modular) refer to https://firebase.google.com/docs/firestore/quickstart#web-version-9_1
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebase = initializeApp ({
  apiKey: "AIzaSyCYtf4AGA6u22UD0K7hvjr818bLw7sBNfo",
  authDomain: "myblog1-b9593.firebaseapp.com",
  projectId: "myblog1-b9593",
  storageBucket: "myblog1-b9593.appspot.com",
  messagingSenderId: "799487437364",
  appId: "1:799487437364:web:ea950decfc5d040b4db861",
  measurementId: "G-3W9KVKZ4YS"
});

export const db = getFirestore();