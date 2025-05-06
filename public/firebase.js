
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDa4fn9erZMXXCIgyJMMQoT7zIi8OvKP4",
  authDomain: "car-tracker-3aeb5.firebaseapp.com",
  databaseURL: "https://car-tracker-3aeb5-default-rtdb.firebaseio.com",
  projectId: "car-tracker-3aeb5",
  storageBucket: "car-tracker-3aeb5.appspot.com",
  messagingSenderId: "981803314783",
  appId: "1:981803314783:web:e64effbc2adacec18cb5ea"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

export { auth, database, googleProvider };
