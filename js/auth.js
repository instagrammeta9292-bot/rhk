import { auth, googleProvider, signInWithPopup, db, doc, getDoc } from "./firebase-init.js";

const googleLoginBtn = document.getElementById("googleLoginBtn");

if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check Firestore if user profile exists
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        window.location.href = "home.html";
      } else {
        // Redirect to setup page for profile creation if first time login
        window.location.href = "setup.html";
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      alert("Google Sign-In failed. Please try again.");
    }
  });
}

