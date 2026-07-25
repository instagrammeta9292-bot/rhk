import { auth, db, onAuthStateChanged, collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, updateDoc } from "./firebase-init.js";

const chatContainer = document.getElementById("chatContainer");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const chatHeaderName = document.getElementById("chatHeaderName");

let currentUserId = null;
const urlParams = new URLSearchParams(window.location.search);
const recipientUid = urlParams.get("uid");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUserId = user.uid;
    if (recipientUid) {
      const recipientSnap = await getDoc(doc(db, "users", recipientUid));
      if (recipientSnap.exists()) {
        chatHeaderName.innerText = recipientSnap.data().username;
      }
    }
    loadMessages();
  } else {
    window.location.href = "index.html";
  }
});

sendBtn.onclick = async () => {
  const text = messageInput.value.trim();
  if (!text || !currentUserId) return;

  try {
    await addDoc(collection(db, "messages"), {
      senderId: currentUserId,
      recipientId: recipientUid || "global",
      text: text,
      timestamp: new Date().toISOString(),
      status: "sent"
    });
    messageInput.value = "";
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

function loadMessages() {
  const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
  onSnapshot(q, (snapshot) => {
    let messagesHTML = "";
    snapshot.forEach((docSnap) => {
      const msg = docSnap.data();
      if (msg.recipientId === "global" || msg.senderId === currentUserId || msg.recipientId === currentUserId) {
        const isOutgoing = msg.senderId === currentUserId;
        const bubbleClass = isOutgoing ? "message-bubble outgoing" : "message-bubble incoming";
        
        let statusIcon = "✓";
        let statusClass = "message-status";
        if (msg.status === "delivered") statusIcon = "✓✓";
        if (msg.status === "seen") {
          statusIcon = "✓✓";
          statusClass = "message-status seen";
        }

        messagesHTML += `
          <div class="${bubbleClass}">
            <div>${msg.text}</div>
            ${isOutgoing ? `<div class="${statusClass}">${statusIcon}</div>` : ''}
          </div>
        `;
      }
    });

    chatContainer.innerHTML = messagesHTML;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  });
}
