import { auth, googleProvider, signInWithPopup, db, doc, getDoc, onAuthStateChanged } from "./firebase-init.js";

const googleLoginBtn = document.getElementById("googleLoginBtn");

// If already logged in, redirect directly to feed
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (userSnap.exists()) {
      window.location.href = "home.html";
    }
  }
});

if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        window.location.href = "home.html";
      } else {
        window.location.href = "setup.html";
      }
    } catch (error) {
      console.error("Auth Error:", error.message);
      alert("Login failed.");
    }
  });
}
