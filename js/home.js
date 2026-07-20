import { auth, db, collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, addDoc, query, orderBy, onAuthStateChanged } from "./firebase-init.js";

const feedContainer = document.getElementById("feedContainer");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  loadFeed(user.uid);
});

async function loadFeed(currentUserId) {
  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      feedContainer.innerHTML = `<div style="text-align: center; color: #888; margin-top: 40px;">No posts yet. Be the first to share!</div>`;
      return;
    }

    feedContainer.innerHTML = "";

    querySnapshot.forEach((postDoc) => {
      const post = postDoc.data();
      const postId = postDoc.id;
      const likes = post.likes || [];
      const isLiked = likes.includes(currentUserId);
      const comments = post.comments || [];

      const postElement = document.createElement("div");
      postElement.className = "post-card";
      
      let mediaContent = '';
      if (post.mediaType === 'reel' || (post.mediaUrl && post.mediaUrl.includes('.mp4'))) {
        mediaContent = `<video src="${post.mediaUrl}" controls class="post-media"></video>`;
      } else {
        mediaContent = `<img src="${post.mediaUrl}" class="post-media" alt="Post media">`;
      }

      postElement.innerHTML = `
        <div class="post-header">
          <img src="${post.userPhoto || 'https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg'}" class="post-avatar">
          <a href="profile.html?uid=${post.userId}" class="post-username">${post.username}</a>
        </div>
        <div class="post-media-box">
          ${mediaContent}
        </div>
        <div class="post-actions">
          <span class="like-btn" data-id="${postId}">${isLiked ? '❤️' : '🤍'}</span>
          <span>💬</span>
          <span>✈️</span>
        </div>
        <div class="post-details">
          <div class="likes-count">${likes.length} likes</div>
          <div class="caption-text"><span>${post.username}</span>${post.caption || ''}</div>
          <div class="comments-section" id="comments-${postId}">
            ${comments.map(c => `<div><b>${c.username}</b> ${c.text}</div>`).join('')}
          </div>
        </div>
        <form class="comment-input-box" data-id="${postId}">
          <input type="text" class="comment-input" placeholder="Add a comment..." required>
          <button type="submit" class="comment-submit">Post</button>
        </form>
      `;

      // Like Button Event
      const likeBtn = postElement.querySelector(".like-btn");
      likeBtn.addEventListener("click", async () => {
        const postRef = doc(db, "posts", postId);
        if (isLiked) {
          await updateDoc(postRef, { likes: arrayRemove(currentUserId) });
        } else {
          await updateDoc(postRef, { likes: arrayUnion(currentUserId) });
        }
        loadFeed(currentUserId); // Refresh feed
      });

      // Comment Form Event
      const commentForm = postElement.querySelector(".comment-input-box");
      commentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const inputField = commentForm.querySelector(".comment-input");
        const commentText = inputField.value.trim();
        if (!commentText) return;

        const userSnap = await getDoc(doc(db, "users", currentUserId));
        const username = userSnap.exists() ? userSnap.data().username : "user";

        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
          comments: arrayUnion({ username, text: commentText, createdAt: new Date().toISOString() })
        });
        loadFeed(currentUserId);
      });

      feedContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("Error loading feed:", error);
    feedContainer.innerHTML = `<div style="text-align: center; color: red; margin-top: 40px;">Error loading posts.</div>`;
  }
}
