import { auth, signOut, onAuthStateChanged, db, doc, getDoc, collection, getDocs } from "./firebase-init.js";

const feedContainer = document.getElementById("feedContainer");
const userStoryAvatar = document.getElementById("userStoryAvatar");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      window.location.href = "setup.html";
    } else {
      const userData = userSnap.data();
      userStoryAvatar.style.backgroundImage = `url('${userData.photoURL}')`;
      renderFeed(userData);
    }
  } else {
    window.location.href = "index.html";
  }
});

function renderFeed(currentUserData) {
  feedContainer.innerHTML = `
    <div class="post-card">
      <div class="post-header">
        <div class="post-user-info">
          <div class="post-user-avatar" style="background-image: url('${currentUserData.photoURL}');"></div>
          <span class="post-username">${currentUserData.username}</span>
        </div>
        <div class="post-options">...</div>
      </div>
      <div class="post-media-container">
        <img class="post-image" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe" alt="Post media">
      </div>
      <div class="post-actions">
        <div class="post-actions-left">
          <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <svg viewBox="0 0 24 24"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg>
          <svg viewBox="0 0 24 24"><path d="M22 3L2 10.5l9 3.5 3.5 9L22 3z"/></svg>
        </div>
        <div>
          <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>
        </div>
      </div>
      <div class="post-footer">
        <p class="post-caption"><span>${currentUserData.username}</span> Welcome to your active RHK brand stream! All buttons and bottom links are fully operational. 🚀</p>
      </div>
    </div>
  `;
}
