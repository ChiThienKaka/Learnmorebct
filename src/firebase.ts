// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCu8nKpPBbzxPh9Y1SLsnMCcBqqMAyqiLA",
  authDomain: "learnmore-bct.firebaseapp.com",
  projectId: "learnmore-bct",
  storageBucket: "learnmore-bct.appspot.com",
  messagingSenderId: "455285098195",
  appId: "1:455285098195:web:e2665c27278444b08b7626"
};

// Initialize Firebase
 const appFirebase = initializeApp(firebaseConfig);
 // Lấy instance của Firebase Auth
 const auth = getAuth(appFirebase)
 export default auth;