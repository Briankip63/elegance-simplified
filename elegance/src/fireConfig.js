
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKfGHbrd2B7qFMZqRmIAcdyXmgeVdvmz4",
  authDomain: "elegance-fccda.firebaseapp.com",
  projectId: "elegance-fccda",
  storageBucket: "elegance-fccda.appspot.com",
  messagingSenderId: "615181992347",
  appId: "1:615181992347:web:effa48a5e8418046a6613e",
  measurementId: "G-7NLD7M9GPN"
};


const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app)

export default fireDB;