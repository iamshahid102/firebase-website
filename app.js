// ======================= Firebase Importing start =============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyDOfaSkv7-QTh-AC-2CZ0t5Tei8GBdbuyE",
  authDomain: "product-store-e23cd.firebaseapp.com",
  projectId: "product-store-e23cd",
  storageBucket: "product-store-e23cd.firebasestorage.app",
  messagingSenderId: "732735639539",
  appId: "1:732735639539:web:717d83266c6fb2b9f40c86",
  measurementId: "G-J9KBNSMH4V",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ======================= Firebase Importing end =============================

// Page Redirect Function Start
function pageRedirect() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      window.location.href = "./Dashboard/dashboard.html";
      console.log(user);
    } else {
      // User is signed out
      return;
    }
  });
}

pageRedirect();

// Page Redirect Function End
