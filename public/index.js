import 'https://cdnjs.cloudflare.com/ajax/libs/framework7/5.7.10/js/framework7.bundle.min.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { ref, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import app from './F7App.js';
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

import { auth, database, googleProvider } from './firebase.js';


const $$ = Dom7;
const today = new Date().toISOString().split('T')[0]; 

// Handles auth state change
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(" Logged in:", user.email);
    app.tab.show("#tab2", true);
    loadCars();
  } else {
    app.tab.show("#tab1", true);
    console.log(" Logged out");
  }
});



// Using Dom7 to attach listeners safely when DOM is ready
$$(document).on('click', '#googleSignInBtn', () => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      console.log("Google signed in user:", result.user);
      app.loginScreen.close(".loginYes", true);
      app.tab.show("#tab2", true);
    })
    .catch((error) => {
      console.error("Google Sign-In Error:", error.message);
      $$("#signInError").html(error.message);
    });
});


$$("#loginForm").on("submit", (evt) => {
  evt.preventDefault(); 
  const form = app.form.convertToData("#loginForm");

  signInWithEmailAndPassword(auth, form.username, form.password)
    .then(() => {
      app.loginScreen.close(".loginYes", true);
      app.tab.show("#tab2", true);
    })
    .catch(err => {
      $$("#signInError").html(err.message);
      console.error("Login Error:", err.message);
    });
});

// Signup
$$("#signUpForm").on("submit", (evt) => {
  evt.preventDefault();
  const form = app.form.convertToData("#signUpForm");

  createUserWithEmailAndPassword(auth, form.username, form.password)
    .then((userCredential) => {
      const user = userCredential.user;
      return push(ref(database, "users/" + user.uid), {
        email: user.email,
        createdAt: new Date().toISOString()
      });
    })
    .then(() => {
      app.loginScreen.close(".signupYes", true);
    })
    .catch((error) => {
      $$("#signUpError").html(error.message);
      console.error("Signup Error:", error.message);
    });
});

// Logout
$$("#logout").on("click", () => {
  signOut(auth);
});

// Add Car
$$("#addItem").on("submit", (e) => {
  e.preventDefault();
  const make = $$("#carMake").val();
  const model = $$("#carModel").val();
  const year = $$("#carYear").val();
  const price = $$("#carPrice").val();
  const image = $$("#carImage").val();

  push(ref(database, "cars"), {
    make, model, year, price, image, datePurchased: null
  });

  app.sheet.close(".my-sheet", true);
});


// Load Cars
function loadCars() {
  const container = document.getElementById("groceryList");
  onValue(ref(database, "cars"), (snapshot) => {
    container.innerHTML = "";
    const data = snapshot.val();
    for (let id in data) {
      const car = data[id];
      const strike = car.datePurchased ? 'style="text-decoration:line-through"' : "";
      const image = car.image || "https://via.placeholder.com/300x180?text=No+Image";

      //HTML content
      container.innerHTML += `
        <div class="card" ${strike}>
          <img src="${image}" style="width:100%; height:180px; object-fit:cover;" alt="Car Image">
          <div class="card-content">
            <h3>${car.make} ${car.model}</h3>
            <p>Year: ${car.year}</p>
            <p>Price: $${car.price}</p>
            <button onclick="markBought('${id}')">I bought this</button>
            <button onclick="removeCar('${id}')">I don't need this</button>
          </div>
        </div>
      `;
    }
  });
}


// Mark as Bought
window.markBought = function(id) {
  update(ref(database, "cars/" + id), {
    datePurchased: today
  });
};

// Remove Car
window.removeCar = function(id) {
  remove(ref(database, "cars/" + id));
};