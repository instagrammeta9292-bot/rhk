import { auth, db, doc, getDoc, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "./firebase-init.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");
const toggleModeText = document.getElementById("toggleModeText");

let isSignUp = false;

toggleModeText.addEventListener("click", () => {
  isSignUp = !isSignUp;
  if (isSignUp) {
    loginBtn.innerText = "Sign Up";
    toggleModeText.innerHTML = `Already have an account? <span style="color: #0095f6; font-weight: 600;">Sign in</span>`;
  } else {
    loginBtn.innerText = "Sign In";
    toggleModeText.innerHTML = `Don't have an account? <span style="color: #0095f6; font-weight: 600;">Sign up</span>`;
  }
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (userSnap.exists()) {
        window.location.href = "home.html";
      } else {
        window.location.href = "setup.html";
      }
    } catch (err) {
      console.error("Firestore navigation check error:", err);
    }
  }
});

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          window.location.href = "home.html";
        } else {
          window.location.href = "setup.html";
        }
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          window.location.href = "home.html";
        } else {
          window.location.href = "setup.html";
        }
      }
    } catch (error) {
      console.error("WebView Auth Error:", error.code, error.message);
      alert("Login failed: " + error.message);
    }
  });
}
