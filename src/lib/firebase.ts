import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBN0D8J16PU709QqSJev2sVX7JXI80JR6k",
  authDomain: "new-maruthi-tiffins.firebaseapp.com",
  projectId: "new-maruthi-tiffins",
  storageBucket: "new-maruthi-tiffins.firebasestorage.app",
  messagingSenderId: "857934123980",
  appId: "1:857934123980:web:b7073ea1f17a54adccc369",
  measurementId: "G-WJM6X12N51"
};


const app = initializeApp(firebaseConfig);
console.log("Firebase Config:", firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);