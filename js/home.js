import { auth, onAuthStateChanged, db, doc, getDoc, collection, getDocs, query, orderBy } from "./firebase-init.js";

const feedContainer = document.getElementById("feedContainer");
const userStoryAvatar = document.getElementById("userStoryAvatar");
const storiesContainer = document.getElementById("storiesContainer");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      window.location.href = "setup.html";
    } else {
      const userData = userSnap.data();
      userStoryAvatar.style.backgroundImage = `url('${userData.photoURL}')`;
      loadFeedAndStories(userData);
    }
  } else {
    window.location.href = "index.html";
  }
});

async function loadFeedAndStories(currentUser) {
  // Allow users to see their own posts + posts from users they follow
  const visibleUserIds = [currentUser.uid, ...(currentUser.following || [])];

  try {
    // Load Posts
    const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const postsSnapshot = await getDocs(postsQuery);
    
    let postsHTML = "";
    postsSnapshot.forEach((docSnap) => {
      const post = docSnap.data();
      if (visibleUserIds.includes(post.userId)) {
        postsHTML += `
          <div class="post-card">
            <div class="post-header">
              <a href="view-profile.html?uid=${post.userId}" class="post-user-info">
                <div class="post-user-avatar" style="background-image: url('${post.userPhoto}');"></div>
                <span class="post-username">${post.username}</span>
              </a>
              <div class="post-options">...</div>
            </div>
            <div class="post-media-container">
              <img class="post-image" src="${post.mediaUrl}" alt="Post media">
            </div>
            <div class="post-actions">
              <div class="post-actions-left">
                <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                <svg viewBox="0 0 24 24"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg>
                <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </div>
              <div>
                <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>
              </div>
            </div>
            <div class="post-footer">
              <p class="post-caption"><span>${post.username}</span> ${post.caption || ""}</p>
            </div>
          </div>
        `;
      }
    });

    if (postsHTML === "") {
      feedContainer.innerHTML = `<p style="text-align: center; padding: 40px; color: #888;">No posts yet. Search users in Explore to follow them!</p>`;
    } else {
      feedContainer.innerHTML = postsHTML;
    }

    // Load Stories Tray for Followed Users
    const usersSnapshot = await getDocs(collection(db, "users"));
    usersSnapshot.forEach((docSnap) => {
      const uData = docSnap.data();
      if (currentUser.following && currentUser.following.includes(uData.uid)) {
        const storyItem = document.createElement("div");
        storyItem.className = "story-item";
        storyItem.onclick = () => window.location.href = `view-profile.html?uid=${uData.uid}`;
        storyItem.innerHTML = `
          <div class="story-ring">
            <div class="story-img" style="background-image: url('${uData.photoURL}');"></div>
          </div>
          <span class="story-username">${uData.username}</span>
        `;
        storiesContainer.appendChild(storyItem);
      }
    });

  } catch (error) {
    console.error("Error loading feed:", error);
    feedContainer.innerHTML = `<p style="text-align: center; padding: 40px; color: #ed4956;">Error loading posts.</p>`;
  }
}
