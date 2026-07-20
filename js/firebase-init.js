import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { initializeAuth, getAuth, browserLocalPersistence, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, updateDoc, arrayUnion, arrayRemove, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHUju18VBAdDFoQJhsVWp7oUqBxhfwThE",
  authDomain: "rhk-app-e34c6.firebaseapp.com",
  projectId: "rhk-app-e34c6",
  storageBucket: "rhk-app-e34c6.firebasestorage.app",
  messagingSenderId: "1016565109006",
  appId: "1:1016565109006:web:eb7ec260a601a16e5ac75f"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with explicit local persistence fallback for WebViews
let auth;
try {
  auth = initializeAuth(app, {
    persistence: browserLocalPersistence
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { 
  auth, signOut, onAuthStateChanged, 
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  db, doc, setDoc, getDoc, getDocs, updateDoc, arrayUnion, arrayRemove, 
  collection, addDoc, query, orderBy, onSnapshot 
};

