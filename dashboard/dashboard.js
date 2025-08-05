let userUid = "";
let cardsContainer = document.getElementById("card-container");

// ======================= Firebase Importing start =============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
  getAuth,
  signOut,
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
function userUidGet() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userUid = user.uid;
      // console.log(userUid);
    } else {
      // User is signed out
      return;
    }
  });
}

userUidGet();

// ======================= Sign Out Function start =============================

const signOutBtn = document.getElementById("logout");

signOutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      window.location.href = "../index.html";
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
});

// ======================= Sign Out Function end =============================

// ======================= Read Datas Function start =============================

async function readDatas() {
  cardsContainer.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((doc) => {
    if (doc.data().userUid === userUid) {
      cardsContainer.innerHTML += `<div class="card">
        <img src="${doc.data().imageURL}" alt="almari" />
        <h3>${doc.data().title}</h3>
        <p class="price">Price: ${doc.data().price}</p>
        <p>
          ${doc.data().description}
        </p>
        <div class="cardBtn">
          <button>edit</button>
          <button>delete</button>
        </div>
      </div>`;
    }
  });
}

readDatas();

// ======================= Read Datas Function end =============================

// ======================= Add Datas Function start =============================

const addProduct = document.getElementById("addProduct");

addProduct.addEventListener("click", async () => {
  let title = document.getElementById("title").value.trim();
  let price = document.getElementById("price").value.trim();
  let description = document.getElementById("description").value.trim();
  let imageURL = document.getElementById("image-url").value.trim();

  try {
    const docRef = await addDoc(collection(db, "products"), {
      title,
      price,
      description,
      imageURL,
      userUid,
    });

    readDatas();

    title = "";
    price = "";
    description = "";
    imageURL = "";
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

// ======================= Add Datas Function end =============================
