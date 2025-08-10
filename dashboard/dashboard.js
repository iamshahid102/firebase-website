let userUid = "";
let cardsContainer = document.getElementById("card-container");

// ======================= Firebase Importing start =============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  Timestamp,
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

let cardLentgh = 0;

window.addToCard = async function addToCard(id) {
  cardLentgh++;
  document.getElementById("cardSec").innerHTML = `Card: <span>${cardLentgh}</span>`;
  const docRef = doc(db, "products", id); // "users" is collection name
  const editRef = await getDoc(docRef);
  const data = editRef.data();

  try {
    await addDoc(collection(db, "cardsItem"), {
      title: data.title,
      price: data.price,
      description: data.description,
      imageURL: data.imageURL,
      userUid,
      createdAt: Timestamp.now(),
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// ======================= Read Datas Function start =============================

async function readDatas() {
  cardsContainer.innerHTML = "<h1> Loading... </h1>";
  try {
    const products = await getDocs(collection(db, "products"));
    // console.log("Total products:", products.size); // .size → number of products

    if (products.size < 1) {
      cardsContainer.innerHTML = "<h1> Empty! </h1>";
      return;
    }

    const userDatas = await getDocs(collection(db, "userDatas"));
    userDatas.forEach((data) => {
      const userData = data.data();

      if (userData.userUid === userUid && userData.isAdmin) {
        cardsContainer.innerHTML = "";
        products.forEach((item) => {
          const product = item.data();

          if (product.userUid === userUid) {
            cardsContainer.innerHTML += `<div class="card">
        <img src="${product.imageURL}" alt="item" />
        <h3>${product.title}</h3>
        <p class="price">Price: ${product.price}</p>
        <p>
          ${product.description}
        </p>
        <div class="cardBtn">
          <button data-bs-toggle="modal"
          data-bs-target="#updateModal"
          data-bs-whatever="@getbootstrap" onclick="editBtn('${item.id}')">Edit</button>
          <button onclick="deleteBtn('${item.id}')">Delete</button>
        </div>
      </div>`;
          }
        });
      } else {
        document.getElementById("cardSec").style.display = "block";
        document.getElementById("addProduct").style.display = "none";

        cardsContainer.innerHTML = "";
        products.forEach((item) => {
          const product = item.data();

          cardsContainer.innerHTML += `<div class="card">
        <img src="${product.imageURL}" alt="item" />
        <h3>${product.title}</h3>
        <p class="price">Price: ${product.price}</p>
        <p>
          ${product.description}
        </p>
        <div class="cardBtn">
          <button onclick="addToCard('${item.id}')">Add To Card</button>
        </div>
      </div>`;
        });
      }
    });
  } catch (error) {
    console.log("err => ", error);
  }
}

readDatas();

// ======================= Read Datas Function end =============================

// ======================= Add Datas Function start =============================

const addProduct = document.getElementById("submitProduct");

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
      createdAt: Timestamp.now(),
    });

    title = "";
    price = "";
    description = "";
    imageURL = "";

    readDatas();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

// ======================= Add Datas Function end =============================

// ======================= Edit Function start =============================

let docRef = null;

window.editBtn = async function editBtn(id) {
  let editTitle = document.getElementById("edit-title");
  let editPrice = document.getElementById("edit-price");
  let editImageURL = document.getElementById("edit-image-url");
  let editDescription = document.getElementById("edit-description");

  docRef = doc(db, "products", id); // "users" is collection name
  const editRef = await getDoc(docRef);
  const data = editRef.data();

  editTitle.value = data.title;
  editPrice.value = data.price;
  editImageURL.value = data.imageURL;
  editDescription.value = data.description;
};

document.getElementById("updateProduct").addEventListener("click", async () => {
  let editTitle = document.getElementById("edit-title").value.trim();
  let editPrice = document.getElementById("edit-price").value.trim();
  let editImageURL = document.getElementById("edit-image-url").value.trim();
  let editDescription = document
    .getElementById("edit-description")
    .value.trim();

  cardsContainer.innerHTML = "<h1> Loading... </h1>"; // loader

  await updateDoc(docRef, {
    title: editTitle,
    price: editPrice,
    imageURL: editImageURL,
    description: editDescription,
    createdAt: Timestamp.now(),
    userUid,
  });

  readDatas();
});

// ======================= Edit Function end =============================

// ======================= Delete Function start =============================

window.deleteBtn = async function deleteBtn(id) {
  await deleteDoc(doc(db, "products", id));
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Item Deleted..",
    showConfirmButton: false,
    timer: 1500,
  });
  console.log("delete success");

  readDatas();
};

// ======================= Delete Function end =============================
