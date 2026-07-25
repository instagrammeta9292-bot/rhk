import { auth, onAuthStateChanged, db, doc, getDoc, collection, getDocs, query, orderBy, updateDoc, arrayUnion, arrayRemove } from "./firebase-init.js";

const feedContainer = document.getElementById("feedContainer");
const userStoryAvatar = document.getElementById("userStoryAvatar");
const storiesContainer = document.getElementById("storiesContainer");
const uploadModal = document.getElementById("uploadModal");
const openUploadModal = document.getElementById("openUploadModal");
const navPlusBtn = document.getElementById("navPlusBtn");

const storyViewer = document.getElementById("storyViewer");
const closeStoryViewer = document.getElementById("closeStoryViewer");
const viewerUserAvatar = document.getElementById("viewerUserAvatar");
const viewerUsername = document.getElementById("viewerUsername");
const viewerMediaContainer = document.getElementById("viewerMediaContainer");

if(openUploadModal) openUploadModal.onclick = () => uploadModal.style.display = "flex";
if(navPlusBtn) navPlusBtn.onclick = (e) => { e.preventDefault(); uploadModal.style.display = "flex"; };

window.closeModal = () => uploadModal.style.display = "none";
if(closeStoryViewer) closeStoryViewer.onclick = () => storyViewer.style.display = "none";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      window.location.href = "setup.html";
    } else {
      const userData = userSnap.data();
      userStoryAvatar.style.backgroundImage = `url('${userData.photoURL}')`;
      loadFeedAndStories(userData, user.uid);
    }
  } else {
    window.location.href = "index.html";
  }
});

async function loadFeedAndStories(currentUser, currentUid) {
  const visibleUserIds = [currentUid, ...(currentUser.following || [])];

  try {
    // Fetch users metadata for verified status & avatars
    const usersSnapshot = await getDocs(collection(db, "users"));
    const usersMap = {};
    usersSnapshot.forEach(docSnap => {
      usersMap[docSnap.id] = docSnap.data();
    });

    const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const postsSnapshot = await getDocs(postsQuery);
    
    let postsHTML = "";
    postsSnapshot.forEach((docSnap) => {
      const post = docSnap.id;
      const pData = docSnap.data();
      if (visibleUserIds.includes(pData.userId) && pData.mediaType === 'post') {
        const postAuthor = usersMap[pData.userId] || {};
        const isVerified = postAuthor.isVerified ? `<span class="verified-badge">✔️</span>` : '';
        const isBookmarked = currentUser.bookmarks && currentUser.bookmarks.includes(docSnap.id);

        // Render Poll UI if post has poll data
        let pollHtml = '';
        if (pData.poll && pData.poll.question) {
          pollHtml = `
            <div class="post-poll-container">
              <div style="font-weight: 600; margin-bottom: 6px; font-size: 13px;">📊 ${pData.poll.question}</div>
              ${pData.poll.options.map((opt, idx) => `<button class="poll-option-btn" onclick="votePoll('${docSnap.id}', ${idx})">${opt}</button>`).join('')}
            </div>
          `;
        }

        postsHTML += `
          <div class="post-card">
            <div class="post-header">
              <a href="view-profile.html?uid=${pData.userId}" class="post-user-info">
                <div class="post-user-avatar" style="background-image: url('${pData.userPhoto || postAuthor.photoURL}');"></div>
                <span class="post-username">${pData.username} ${isVerified}</span>
              </a>
            </div>
            <div class="post-media-container">
              <img class="post-image" src="${pData.mediaUrl}" alt="Post media">
            </div>
            ${pollHtml}
            <div class="post-actions">
              <div class="post-actions-left">
                <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                <svg viewBox="0 0 24 24"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg>
              </div>
              <svg onclick="toggleBookmark('${docSnap.id}')" viewBox="0 0 24 24" style="fill: ${isBookmarked ? '#0095f6' : '#fff'}; cursor: pointer;"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
            </div>
            <div class="post-footer">
              <p class="post-caption"><a href="view-profile.html?uid=${pData.userId}" style="color: #fff; text-decoration: none;"><span>${pData.username}</span></a> ${pData.caption || ""}</p>
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

    // Load Stories Tray
    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    usersSnapshot.forEach((docSnap) => {
      const uData = docSnap.data();
      if (currentUser.following && currentUser.following.includes(uData.uid)) {
        let hasActiveStory = false;
        let activeStoryData = null;

        postsSnapshot.forEach((pDoc) => {
          const pData = pDoc.data();
          if (pData.userId === uData.uid && (pData.mediaType === 'story' || pData.mediaType === 'story_video')) {
            const storyTime = new Date(pData.createdAt).getTime();
            if (now - storyTime < twentyFourHours) {
              hasActiveStory = true;
              activeStoryData = pData;
            }
          }
        });

        if (hasActiveStory) {
          const storyItem = document.createElement("div");
          storyItem.className = "story-item";
          storyItem.onclick = () => {
            viewerUserAvatar.style.backgroundImage = `url('${uData.photoURL}')`;
            viewerUserAvatar.onclick = () => window.location.href = `view-profile.html?uid=${uData.uid}`;
            viewerUsername.innerText = uData.username;
            viewerUsername.onclick = () => window.location.href = `view-profile.html?uid=${uData.uid}`;
            
            let mediaHtml = `<img src="${activeStoryData.mediaUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain;">`;
            if (activeStoryData.mediaType === 'story_video') {
              mediaHtml = `<video autoplay controls src="${activeStoryData.mediaUrl}" style="max-width: 100%; max-height: 100%;"></video>`;
            }

            viewerMediaContainer.innerHTML = mediaHtml;
            storyViewer.style.display = "flex";
          };

          const ringClass = uData.isPremium ? "story-ring profile-ring-premium" : "story-ring";
          storyItem.innerHTML = `
            <div class="${ringClass}">
              <div class="story-img" style="background-image: url('${uData.photoURL}');"></div>
            </div>
            <span class="story-username">${uData.username}</span>
          `;
          storiesContainer.appendChild(storyItem);
        }
      }
    });

  } catch (error) {
    console.error("Error loading feed:", error);
    feedContainer.innerHTML = `<p style="text-align: center; padding: 40px; color: #ed4956;">Error loading posts.</p>`;
  }
}

// Global helper for bookmark toggling
window.toggleBookmark = async (postId) => {
  const user = auth.currentUser;
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const bookmarks = userSnap.data().bookmarks || [];
    if (bookmarks.includes(postId)) {
      await updateDoc(userRef, { bookmarks: arrayRemove(postId) });
    } else {
      await updateDoc(userRef, { bookmarks: arrayUnion(postId) });
    }
    location.reload();
  }
};

