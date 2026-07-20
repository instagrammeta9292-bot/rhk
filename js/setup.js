import { auth, db, doc, setDoc, onAuthStateChanged } from "./firebase-init.js";

const CLOUD_NAME = "nhy9lfkt"; 
const UPLOAD_PRESET = "rhk_upload";

const avatarInput = document.getElementById("avatarInput");
const avatarPreview = document.getElementById("avatarPreview");
const setupForm = document.getElementById("setupForm");
const submitBtn = document.getElementById("submitBtn");

let currentUser = null;
let uploadedImageUrl = "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg";

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    if (user.photoURL) {
      uploadedImageUrl = user.photoURL;
      avatarPreview.style.backgroundImage = `url('${uploadedImageUrl}')`;
    }
  } else {
    window.location.href = "index.html";
  }
});

avatarInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  avatarPreview.style.backgroundImage = `url('${URL.createObjectURL(file)}')`;
  submitBtn.disabled = true;
  submitBtn.innerText = "Uploading to Cloudinary...";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    
    if (data.secure_url) {
      uploadedImageUrl = data.secure_url;
      submitBtn.disabled = false;
      submitBtn.innerText = "Start Using RHK";
    } else {
      console.error("Cloudinary setup upload error:", data);
      alert("Image upload failed: " + (data.error?.message || "Invalid setup configuration"));
      submitBtn.disabled = false;
      submitBtn.innerText = "Start Using RHK";
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Image upload failed due to network connection.");
    submitBtn.disabled = false;
    submitBtn.innerText = "Start Using RHK";
  }
});

setupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) return;

  const username = document.getElementById("usernameInput").value.trim().toLowerCase();
  const fullName = document.getElementById("fullNameInput").value.trim();
  const bio = document.getElementById("bioInput").value.trim();

  try {
    await setDoc(doc(db, "users", currentUser.uid), {
      uid: currentUser.uid,
      username,
      fullName,
      bio,
      photoURL: uploadedImageUrl,
      following: [],
      followers: [],
      createdAt: new Date().toISOString()
    });

    window.location.href = "home.html";
  } catch (error) {
    console.error("Firestore error:", error);
    alert("Error saving profile settings.");
  }
});
