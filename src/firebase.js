import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// firebase cnofiguration
var firebaseConfig = {
  apiKey: "AIzaSyDrTU5gIjUoyRWXz9Ft9Sp8PS9nh92ObA8",
  authDomain: "react-firebase-a6e99.firebaseapp.com",
  projectId: "react-firebase-a6e99",
  storageBucket: "react-firebase-a6e99.appspot.com",
  messagingSenderId: "564498679343",
  appId: "1:564498679343:web:cf4c374a18f1afbfe168da",
  measurementId: "G-2NHQFET8CF",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//   firebase.analytics();

export default firebase;
