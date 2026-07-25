import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, doc, setDoc } from "./firebase-init.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const toggleModeText = document.getElementById("toggleModeText");

let isSignUp = false;

if (toggleModeText) {
  toggleModeText.onclick = () => {
    isSignUp = !isSignUp;
    const btn = document.getElementById("loginBtn");
    if (isSignUp) {
      toggleModeText.innerHTML = `Already have an account? <span style="color: #0095f6; font-weight: 600;">Sign in</span>`;
      btn.innerText = "Sign Up";
    } else {
      toggleModeText.innerHTML = `Don't have an account? <span style="color: #0095f6; font-weight: 600;">Sign up</span>`;
      btn.innerText = "Sign In";
    }
  };
}

if (loginForm) {
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create initial user document record
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: email,
          username: email.split("@")[0],
          fullName: "",
          bio: "",
          photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
          createdAt: new Date().toISOString()
        });

        window.location.replace("setup.html");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.replace("home.html");
      }
    } catch (error) {
      alert("Authentication error: " + error.message);
    }
  };
}
