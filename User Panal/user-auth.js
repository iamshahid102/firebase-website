// ======================= Page Change Function Start =============================

document.getElementById("pageBtn-1").addEventListener("click", () => {
  document.getElementById("container-1").classList.add("hidden-form");
  document.getElementById("container-2").classList.remove("hidden-form");
});

document.getElementById("pageBtn-2").addEventListener("click", () => {
  document.getElementById("container-2").classList.add("hidden-form");
  document.getElementById("container-1").classList.remove("hidden-form");
});

// ======================= Page Change Function End =============================

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

// ======================= Sign Up Function Start =============================

async function storeUserData(userName, userEmail, userUid) {
  try {
    const docRef = await addDoc(collection(db, "userDatas"), {
      userName,
      userEmail,
      userUid,
      isAdmin: false,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

function signupForm(event) {
  event.preventDefault();
  let userName = document.getElementById("userName").value.toUpperCase().trim();
  let userEmail = document
    .getElementById("userEmail")
    .value.toLowerCase()
    .trim();
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;

  if (!userName || !userEmail || !password || !confirmPassword) {
    swal("Fill Out All Input Field!", "Press OK For Retry!", "error");
    return;
  }

  if (password == confirmPassword) {
    createUserWithEmailAndPassword(auth, userEmail, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("user id ", user.uid);

        storeUserData(userName, userEmail, user.uid);

        document.getElementById("signupForm").reset();

        swal("SignUp Success!", `${userName} Go To LogIn Page`, "success");
        
        setTimeout(() => {
          document.getElementById("container-2").classList.add("hidden-form");
          document
            .getElementById("container-1")
            .classList.remove("hidden-form");
        }, 3000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        swal("This Email Is Already Exist!", "Press OK For Retry!", "error");
      });
  } else {
    swal("Password Should Be Same!", "Press OK For Retry!", "error");
  }
}

window.signupForm = signupForm;

// ======================= Sign Up Function End =============================

// ======================= Sign In Function Start =============================

function signinForm(event) {
  event.preventDefault();
  let checkEmail = document.getElementById("checkEmail").value.trim();
  let CheckPassword = document.getElementById("CheckPassword").value;

  if (!checkEmail || !CheckPassword) {
    swal("Please Fill Out All Field!", "Press OK For Retry!", "error");
    return;
  }

  signInWithEmailAndPassword(auth, checkEmail, CheckPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("userEmail ", user.email);
      swal("Log In Success!", "Go to Dashboard!", "success");
      setTimeout(() => {
        window.location.href = "./Dashboard/dashboard.html";
      }, 3000);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      swal(
        "Please Input Correct Email Or Password !",
        "Press OK For Retry!",
        "error"
      );
    });
}

window.signinForm = signinForm;

// ======================= Sign In Function End =============================

// Page Redirect Function Start
function pageRedirect() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      window.location.href = "../Dashboard/dashboard.html";
      console.log(user, uid);
    } else {
      // User is signed out
      return;
    }
  });
}

pageRedirect();

// Page Redirect Function End
