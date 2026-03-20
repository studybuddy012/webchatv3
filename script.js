// // // // // // // // // // // // // // // // // const { Client, Account, Storage, Databases, ID, Query } = Appwrite;

// // // // // // // // // // // // // // // // // // --- CONFIGURATION ---
// // // // // // // // // // // // // // // // // const client = new Client()
// // // // // // // // // // // // // // // // //     .setEndpoint('https://cloud.appwrite.io/v1')
// // // // // // // // // // // // // // // // //     .setProject('69bcc12d00306fe9ce4d');

// // // // // // // // // // // // // // // // // const account = new Account(client);
// // // // // // // // // // // // // // // // // const storage = new Storage(client);
// // // // // // // // // // // // // // // // // const databases = new Databases(client);

// // // // // // // // // // // // // // // // // const BUCKET_ID = '69bcc2cc0025e83e281d'; 
// // // // // // // // // // // // // // // // // const DATABASE_ID = '69bcd743001d1369dedc';
// // // // // // // // // // // // // // // // // const COLLECTION_ID = 'photos';

// // // // // // // // // // // // // // // // // // --- AUTHENTICATION ---
// // // // // // // // // // // // // // // // // async function checkAuth() {
// // // // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // // // // // //         document.getElementById('user-status').innerText = `Logged in: ${user.email}`;
// // // // // // // // // // // // // // // // //         document.getElementById('login-section').style.display = 'none';
// // // // // // // // // // // // // // // // //         document.getElementById('main-content').style.display = 'flex';
// // // // // // // // // // // // // // // // //         document.getElementById('logout-btn').style.display = 'block';
// // // // // // // // // // // // // // // // //         loadChat(true); // Initial Load
// // // // // // // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // // // // // // //         document.getElementById('user-status').innerText = "Access Denied. Please Login.";
// // // // // // // // // // // // // // // // //         document.getElementById('login-section').style.display = 'block';
// // // // // // // // // // // // // // // // //         document.getElementById('main-content').style.display = 'none';
// // // // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // // async function handleLogin() {
// // // // // // // // // // // // // // // // //     const email = document.getElementById('email').value;
// // // // // // // // // // // // // // // // //     const pass = document.getElementById('password').value;
// // // // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // // // //         // Appwrite v14+ Compatibility
// // // // // // // // // // // // // // // // //         await account.createEmailPasswordSession(email, pass);
// // // // // // // // // // // // // // // // //         location.reload();
// // // // // // // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // // // // // // //         alert("Login Error: " + err.message);
// // // // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // // async function handleLogout() {
// // // // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // // // //         await account.deleteSession('current');
// // // // // // // // // // // // // // // // //         location.reload();
// // // // // // // // // // // // // // // // //     } catch (err) { console.error(err); }
// // // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // // // --- MESSAGING LOGIC ---
// // // // // // // // // // // // // // // // // async function handleSendMessage() {
// // // // // // // // // // // // // // // // //     const fileInput = document.getElementById('image-input');
// // // // // // // // // // // // // // // // //     const msgInput = document.getElementById('message-input');
// // // // // // // // // // // // // // // // //     const btn = document.getElementById('send-btn');
// // // // // // // // // // // // // // // // //     const file = fileInput.files[0];
// // // // // // // // // // // // // // // // //     const message = msgInput.value.trim();

// // // // // // // // // // // // // // // // //     if (!file && !message) return;

// // // // // // // // // // // // // // // // //     btn.disabled = true;
// // // // // // // // // // // // // // // // //     btn.innerText = "...";

// // // // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // // // // // //         let fileUrl = null;

// // // // // // // // // // // // // // // // //         // 1. Photo Upload (If exists)
// // // // // // // // // // // // // // // // //         if (file) {
// // // // // // // // // // // // // // // // //             const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);
// // // // // // // // // // // // // // // // //             fileUrl = storage.getFileView(BUCKET_ID, uploadedFile.$id).href;
// // // // // // // // // // // // // // // // //         }

// // // // // // // // // // // // // // // // //         // 2. Save to Database
// // // // // // // // // // // // // // // // //         await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
// // // // // // // // // // // // // // // // //             imageUrl: fileUrl,
// // // // // // // // // // // // // // // // //             message: message,
// // // // // // // // // // // // // // // // //             senderId: user.$id,
// // // // // // // // // // // // // // // // //             createdAt: new Date().toISOString()
// // // // // // // // // // // // // // // // //         });

// // // // // // // // // // // // // // // // //         // Reset inputs (No reload needed because of Real-time listener)
// // // // // // // // // // // // // // // // //         msgInput.value = '';
// // // // // // // // // // // // // // // // //         fileInput.value = '';
// // // // // // // // // // // // // // // // //         btn.disabled = false;
// // // // // // // // // // // // // // // // //         btn.innerText = "Send 🚀";
// // // // // // // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // // // // // // //         alert("Error: " + err.message);
// // // // // // // // // // // // // // // // //         btn.disabled = false;
// // // // // // // // // // // // // // // // //         btn.innerText = "Send 🚀";
// // // // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // // // --- RENDER & REAL-TIME ---
// // // // // // // // // // // // // // // // // async function loadChat(isInitial = true) {
// // // // // // // // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // // // // // //         if (isInitial) {
// // // // // // // // // // // // // // // // //             const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // // // // // // // // // // // //                 Query.orderAsc('createdAt')
// // // // // // // // // // // // // // // // //             ]);
// // // // // // // // // // // // // // // // //             chatBox.innerHTML = ''; // Clear only once
// // // // // // // // // // // // // // // // //             response.documents.forEach(doc => renderMessage(doc, user));
// // // // // // // // // // // // // // // // //         }
// // // // // // // // // // // // // // // // //     } catch (err) { console.log(err); }
// // // // // // // // // // // // // // // // //     chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // // function renderMessage(doc, user) {
// // // // // // // // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // // // // // // // //     const isMe = doc.senderId === user.$id;
    
// // // // // // // // // // // // // // // // //     const bubble = document.createElement('div');
// // // // // // // // // // // // // // // // //     bubble.className = `bubble ${isMe ? 'my-bubble' : 'friend-bubble'}`;
    
// // // // // // // // // // // // // // // // //     // Photo check
// // // // // // // // // // // // // // // // //     let content = doc.imageUrl ? `<img src="${doc.imageUrl}" loading="lazy" onclick="openViewer('${doc.imageUrl}')">` : "";
// // // // // // // // // // // // // // // // //     // Text check
// // // // // // // // // // // // // // // // //     content += doc.message ? `<p class="chat-text">${doc.message}</p>` : "";
    
// // // // // // // // // // // // // // // // //     const time = new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// // // // // // // // // // // // // // // // //     // const deleteBtn = isMe ? `<span class="delete-icon" onclick="deleteMessage('${doc.$id}', '${doc.imageUrl}')">🗑️</span>` : "";
// // // // // // // // // // // // // // // // //     const deleteBtn = isMe ? `<span class="delete-icon" onclick="deleteMessage('${doc.$id}', '${doc.imageUrl}')"><i class="fa-solid fa-trash"></i></span>` : "";

// // // // // // // // // // // // // // // // //     bubble.innerHTML = `
// // // // // // // // // // // // // // // // //         ${content}
// // // // // // // // // // // // // // // // //         <div class="bubble-footer">
// // // // // // // // // // // // // // // // //             ${deleteBtn}
// // // // // // // // // // // // // // // // //             <div class="time">${time}</div>
// // // // // // // // // // // // // // // // //         </div>
// // // // // // // // // // // // // // // // //     `;
    
// // // // // // // // // // // // // // // // //     chatBox.appendChild(bubble);
// // // // // // // // // // // // // // // // //     chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // // // // // // // // // // // //     chatBox.scrollTo({
// // // // // // // // // // // // // // // // //     top: chatBox.scrollHeight,
// // // // // // // // // // // // // // // // //     behavior: "smooth"
// // // // // // // // // // // // // // // // // });
// // // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // // // --- DELETE LOGIC ---
// // // // // // // // // // // // // // // // // async function deleteMessage(docId, fileUrl) {
// // // // // // // // // // // // // // // // //     if (!confirm("Bhai, pakka delete karna hai?")) return;
// // // // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // // // //         await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, docId);
        
// // // // // // // // // // // // // // // // //         if (fileUrl) {
// // // // // // // // // // // // // // // // //             // Extract File ID from URL
// // // // // // // // // // // // // // // // //             const urlParts = fileUrl.split('/');
// // // // // // // // // // // // // // // // //             const fileId = urlParts[urlParts.length - 2];
// // // // // // // // // // // // // // // // //             try { await storage.deleteFile(BUCKET_ID, fileId); } catch(e) {}
// // // // // // // // // // // // // // // // //         }
        
// // // // // // // // // // // // // // // // //         // Remove from UI manually or reload
// // // // // // // // // // // // // // // // //         location.reload(); 
// // // // // // // // // // // // // // // // //     } catch (err) { alert("Delete fail: " + err.message); }
// // // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // // // --- VIEWER ---
// // // // // // // // // // // // // // // // // function openViewer(src) {
// // // // // // // // // // // // // // // // //     const viewer = document.getElementById('image-viewer');
// // // // // // // // // // // // // // // // //     const img = document.getElementById('full-image');

// // // // // // // // // // // // // // // // //     img.src = src;
// // // // // // // // // // // // // // // // //     viewer.classList.add("active"); // 🔥 animation trigger
// // // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // // function closeViewer() {
// // // // // // // // // // // // // // // // //     const viewer = document.getElementById('image-viewer');
// // // // // // // // // // // // // // // // //     viewer.classList.remove("active");
// // // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // // // --- REAL-TIME SUBSCRIPTION ---
// // // // // // // // // // // // // // // // // client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`, async (res) => {
// // // // // // // // // // // // // // // // //     const user = await account.get();
    
// // // // // // // // // // // // // // // // //     // New message added
// // // // // // // // // // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.create")) {
// // // // // // // // // // // // // // // // //         renderMessage(res.payload, user);
// // // // // // // // // // // // // // // // //     }
    
// // // // // // // // // // // // // // // // //     // Message deleted
// // // // // // // // // // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.delete")) {
// // // // // // // // // // // // // // // // //         // UI cleanup can be complex, so reload for simple delete update
// // // // // // // // // // // // // // // // //         location.reload();
// // // // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // // // });

// // // // // // // // // // // // // // // // // // Initial Start
// // // // // // // // // // // // // // // // // checkAuth();
// // // // // // // // // // // // // // // // const { Client, Account, Storage, Databases, ID, Query } = Appwrite;

// // // // // // // // // // // // // // // // // --- CONFIGURATION ---
// // // // // // // // // // // // // // // // const client = new Client()
// // // // // // // // // // // // // // // //     .setEndpoint('https://cloud.appwrite.io/v1')
// // // // // // // // // // // // // // // //     .setProject('69bcc12d00306fe9ce4d');

// // // // // // // // // // // // // // // // const account = new Account(client);
// // // // // // // // // // // // // // // // const storage = new Storage(client);
// // // // // // // // // // // // // // // // const databases = new Databases(client);

// // // // // // // // // // // // // // // // const BUCKET_ID = '69bcc2cc0025e83e281d'; 
// // // // // // // // // // // // // // // // const DATABASE_ID = '69bcd743001d1369dedc';
// // // // // // // // // // // // // // // // const COLLECTION_ID = 'photos';

// // // // // // // // // // // // // // // // // Pagination Variables
// // // // // // // // // // // // // // // // let offset = 0;
// // // // // // // // // // // // // // // // const LIMIT = 10;
// // // // // // // // // // // // // // // // let isLoadingMore = false;
// // // // // // // // // // // // // // // // let allLoaded = false;

// // // // // // // // // // // // // // // // // --- AUTHENTICATION ---
// // // // // // // // // // // // // // // // async function checkAuth() {
// // // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // // // // //         document.getElementById('user-status').innerText = `Logged in: ${user.email}`;
// // // // // // // // // // // // // // // //         document.getElementById('login-section').style.display = 'none';
// // // // // // // // // // // // // // // //         document.getElementById('main-content').style.display = 'flex';
// // // // // // // // // // // // // // // //         document.getElementById('logout-btn').style.display = 'block';
        
// // // // // // // // // // // // // // // //         // Initial load: Sabse naye 10 messages
// // // // // // // // // // // // // // // //         loadChat(true); 
// // // // // // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // // // // // //         document.getElementById('user-status').innerText = "Access Denied. Please Login.";
// // // // // // // // // // // // // // // //         document.getElementById('login-section').style.display = 'block';
// // // // // // // // // // // // // // // //         document.getElementById('main-content').style.display = 'none';
// // // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // async function handleLogin() {
// // // // // // // // // // // // // // // //     const email = document.getElementById('email').value;
// // // // // // // // // // // // // // // //     const pass = document.getElementById('password').value;
// // // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // // //         await account.createEmailPasswordSession(email, pass);
// // // // // // // // // // // // // // // //         location.reload();
// // // // // // // // // // // // // // // //     } catch (err) { alert("Login Error: " + err.message); }
// // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // async function handleLogout() {
// // // // // // // // // // // // // // // //     await account.deleteSession('current');
// // // // // // // // // // // // // // // //     location.reload();
// // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // // --- MESSAGING LOGIC ---
// // // // // // // // // // // // // // // // async function handleSendMessage() {
// // // // // // // // // // // // // // // //     const fileInput = document.getElementById('image-input');
// // // // // // // // // // // // // // // //     const msgInput = document.getElementById('message-input');
// // // // // // // // // // // // // // // //     const btn = document.getElementById('send-btn');
// // // // // // // // // // // // // // // //     const file = fileInput.files[0];
// // // // // // // // // // // // // // // //     const message = msgInput.value.trim();

// // // // // // // // // // // // // // // //     if (!file && !message) return;

// // // // // // // // // // // // // // // //     btn.disabled = true;
// // // // // // // // // // // // // // // //     btn.innerText = "...";

// // // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // // // // //         let fileUrl = null;

// // // // // // // // // // // // // // // //         if (file) {
// // // // // // // // // // // // // // // //             const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);
// // // // // // // // // // // // // // // //             fileUrl = storage.getFileView(BUCKET_ID, uploadedFile.$id).href;
// // // // // // // // // // // // // // // //         }

// // // // // // // // // // // // // // // //         await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
// // // // // // // // // // // // // // // //             imageUrl: fileUrl,
// // // // // // // // // // // // // // // //             message: message,
// // // // // // // // // // // // // // // //             senderId: user.$id,
// // // // // // // // // // // // // // // //             createdAt: new Date().toISOString()
// // // // // // // // // // // // // // // //         });

// // // // // // // // // // // // // // // //         msgInput.value = '';
// // // // // // // // // // // // // // // //         fileInput.value = '';
// // // // // // // // // // // // // // // //         btn.disabled = false;
// // // // // // // // // // // // // // // //         btn.innerText = "Send 🚀";
// // // // // // // // // // // // // // // //         // Note: location.reload() hata diya hai flicker rokne ke liye
// // // // // // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // // // // // //         alert("Error: " + err.message);
// // // // // // // // // // // // // // // //         btn.disabled = false;
// // // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // // --- RENDER & CHUNKING LOGIC ---
// // // // // // // // // // // // // // // // async function loadChat(isInitial = true) {
// // // // // // // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // // // // //         if (isInitial) {
// // // // // // // // // // // // // // // //             offset = 0;
// // // // // // // // // // // // // // // //             allLoaded = false;
// // // // // // // // // // // // // // // //             const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // // // // // // // // // // //                 Query.orderDesc('createdAt'),
// // // // // // // // // // // // // // // //                 Query.limit(LIMIT)
// // // // // // // // // // // // // // // //             ]);
            
// // // // // // // // // // // // // // // //             chatBox.innerHTML = '';
// // // // // // // // // // // // // // // //             // Naye messages niche dikhane ke liye reverse()
// // // // // // // // // // // // // // // //             response.documents.reverse().forEach(doc => renderMessage(doc, user, 'bottom'));
// // // // // // // // // // // // // // // //             chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // // // // // // // // // // //         }
// // // // // // // // // // // // // // // //     } catch (err) { console.log(err); }
// // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // // async function loadMoreMessages() {
// // // // // // // // // // // // // // // // //     if (isLoadingMore || allLoaded) return;
// // // // // // // // // // // // // // // // //     isLoadingMore = true;
    
// // // // // // // // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // // // // // // // //     const oldScrollHeight = chatBox.scrollHeight;

// // // // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // // // // // //         offset += LIMIT;

// // // // // // // // // // // // // // // // //         const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // // // // // // // // // // // //             Query.orderDesc('createdAt'),
// // // // // // // // // // // // // // // // //             Query.limit(LIMIT),
// // // // // // // // // // // // // // // // //             Query.offset(offset)
// // // // // // // // // // // // // // // // //         ]);

// // // // // // // // // // // // // // // // //         if (response.documents.length === 0) {
// // // // // // // // // // // // // // // // //             allLoaded = true;
// // // // // // // // // // // // // // // // //             isLoadingMore = false;
// // // // // // // // // // // // // // // // //             return;
// // // // // // // // // // // // // // // // //         }

// // // // // // // // // // // // // // // // //         // Purane messages upar Prepend honge
// // // // // // // // // // // // // // // // //         response.documents.forEach(doc => renderMessage(doc, user, 'top'));

// // // // // // // // // // // // // // // // //         // Scroll position fix taaki jhatka na lage
// // // // // // // // // // // // // // // // //         chatBox.scrollTop = chatBox.scrollHeight - oldScrollHeight;
        
// // // // // // // // // // // // // // // // //     } catch (err) { console.log(err); }
// // // // // // // // // // // // // // // // //     isLoadingMore = false;
// // // // // // // // // // // // // // // // // }
// // // // // // // // // // // // // // // // async function loadMoreMessages() {
// // // // // // // // // // // // // // // //     if (isLoadingMore || allLoaded) return;
    
// // // // // // // // // // // // // // // //     const loader = document.getElementById('load-more-spinner');
// // // // // // // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
    
// // // // // // // // // // // // // // // //     // 1. Loader dikhao
// // // // // // // // // // // // // // // //     loader.style.display = 'block';
// // // // // // // // // // // // // // // //     isLoadingMore = true;
    
// // // // // // // // // // // // // // // //     const oldScrollHeight = chatBox.scrollHeight;

// // // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // // // // //         offset += LIMIT;

// // // // // // // // // // // // // // // //         const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // // // // // // // // // // //             Query.orderDesc('createdAt'),
// // // // // // // // // // // // // // // //             Query.limit(LIMIT),
// // // // // // // // // // // // // // // //             Query.offset(offset)
// // // // // // // // // // // // // // // //         ]);

// // // // // // // // // // // // // // // //         if (response.documents.length === 0) {
// // // // // // // // // // // // // // // //             allLoaded = true;
// // // // // // // // // // // // // // // //             loader.innerHTML = "<p style='font-size:10px; color:#8696a0;'>Sab khatam! Aur purana kuch nahi hai.</p>";
// // // // // // // // // // // // // // // //             setTimeout(() => { loader.style.display = 'none'; }, 2000);
// // // // // // // // // // // // // // // //             isLoadingMore = false;
// // // // // // // // // // // // // // // //             return;
// // // // // // // // // // // // // // // //         }

// // // // // // // // // // // // // // // //         // 2. Purane messages render karo
// // // // // // // // // // // // // // // //         response.documents.forEach(doc => renderMessage(doc, user, 'top'));

// // // // // // // // // // // // // // // //         // 3. Scroll position maintain karo
// // // // // // // // // // // // // // // //         chatBox.scrollTop = chatBox.scrollHeight - oldScrollHeight;
        
// // // // // // // // // // // // // // // //     } catch (err) { 
// // // // // // // // // // // // // // // //         console.log(err); 
// // // // // // // // // // // // // // // //     } finally {
// // // // // // // // // // // // // // // //         // 4. Loader chhupao (thoda delay ke saath taaki flicker na ho)
// // // // // // // // // // // // // // // //         setTimeout(() => {
// // // // // // // // // // // // // // // //             if (!allLoaded) loader.style.display = 'none';
// // // // // // // // // // // // // // // //             isLoadingMore = false;
// // // // // // // // // // // // // // // //         }, 500);
// // // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // function renderMessage(doc, user, position = 'bottom') {
// // // // // // // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // // // // // // //     const isMe = doc.senderId === user.$id;
    
// // // // // // // // // // // // // // // //     const bubble = document.createElement('div');
// // // // // // // // // // // // // // // //     bubble.className = `bubble ${isMe ? 'my-bubble' : 'friend-bubble'}`;
    
// // // // // // // // // // // // // // // //     let content = doc.imageUrl ? `<img src="${doc.imageUrl}" loading="lazy" onclick="openViewer('${doc.imageUrl}')">` : "";
// // // // // // // // // // // // // // // //     content += doc.message ? `<p class="chat-text">${doc.message}</p>` : "";
    
// // // // // // // // // // // // // // // //     const time = new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// // // // // // // // // // // // // // // //     const deleteBtn = isMe ? `<span class="delete-icon" onclick="deleteMessage('${doc.$id}', '${doc.imageUrl}')">🗑️</span>` : "";

// // // // // // // // // // // // // // // //     bubble.innerHTML = `${content}<div class="bubble-footer">${deleteBtn}<div class="time">${time}</div></div>`;
    
// // // // // // // // // // // // // // // //     if (position === 'bottom') {
// // // // // // // // // // // // // // // //         chatBox.appendChild(bubble);
// // // // // // // // // // // // // // // //         chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // // // // // // // // // // //     } else {
// // // // // // // // // // // // // // // //         chatBox.prepend(bubble);
// // // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // // --- SCROLL EVENT FOR INFINITE SCROLL ---
// // // // // // // // // // // // // // // // document.getElementById('chat-box').addEventListener('scroll', (e) => {
// // // // // // // // // // // // // // // //     if (e.target.scrollTop === 0) {
// // // // // // // // // // // // // // // //         loadMoreMessages(); // Top par pahunchte hi purane load karo
// // // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // // });

// // // // // // // // // // // // // // // // // --- DELETE LOGIC ---
// // // // // // // // // // // // // // // // async function deleteMessage(docId, fileUrl) {
// // // // // // // // // // // // // // // //     if (!confirm("Delete karna hai?")) return;
// // // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // // //         await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, docId);
// // // // // // // // // // // // // // // //         if (fileUrl) {
// // // // // // // // // // // // // // // //             const fileId = fileUrl.split('/').reverse()[1];
// // // // // // // // // // // // // // // //             try { await storage.deleteFile(BUCKET_ID, fileId); } catch(e) {}
// // // // // // // // // // // // // // // //         }
// // // // // // // // // // // // // // // //         location.reload(); 
// // // // // // // // // // // // // // // //     } catch (err) { alert(err.message); }
// // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // // --- VIEWER ---
// // // // // // // // // // // // // // // // function openViewer(src) {
// // // // // // // // // // // // // // // //     document.getElementById('full-image').src = src;
// // // // // // // // // // // // // // // //     document.getElementById('image-viewer').style.display = 'block';
// // // // // // // // // // // // // // // // }
// // // // // // // // // // // // // // // // function closeViewer() { document.getElementById('image-viewer').style.display = 'none'; }

// // // // // // // // // // // // // // // // // --- REAL-TIME SUBSCRIPTION ---
// // // // // // // // // // // // // // // // client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`, async (res) => {
// // // // // // // // // // // // // // // //     const user = await account.get();
// // // // // // // // // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.create")) {
// // // // // // // // // // // // // // // //         renderMessage(res.payload, user, 'bottom');
// // // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.delete")) {
// // // // // // // // // // // // // // // //         location.reload();
// // // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // // });

// // // // // // // // // // // // // // // // checkAuth();
// // // // // // // // // // // // // // // const { Client, Account, Storage, Databases, ID, Query } = Appwrite;

// // // // // // // // // // // // // // // // --- CONFIGURATION ---
// // // // // // // // // // // // // // // const client = new Client()
// // // // // // // // // // // // // // //     .setEndpoint('https://cloud.appwrite.io/v1')
// // // // // // // // // // // // // // //     .setProject('69bcc12d00306fe9ce4d'); // Tera Project ID

// // // // // // // // // // // // // // // const account = new Account(client);
// // // // // // // // // // // // // // // const storage = new Storage(client);
// // // // // // // // // // // // // // // const databases = new Databases(client);

// // // // // // // // // // // // // // // const BUCKET_ID = '69bcc2cc0025e83e281d'; 
// // // // // // // // // // // // // // // const DATABASE_ID = '69bcd743001d1369dedc'; // Tera Database ID check kar lena
// // // // // // // // // // // // // // // const COLLECTION_ID = 'photos'; 

// // // // // // // // // // // // // // // // Pagination Variables
// // // // // // // // // // // // // // // let offset = 0;
// // // // // // // // // // // // // // // const LIMIT = 10;
// // // // // // // // // // // // // // // let isLoadingMore = false;
// // // // // // // // // // // // // // // let allLoaded = false;

// // // // // // // // // // // // // // // // --- AUTHENTICATION ---
// // // // // // // // // // // // // // // async function checkAuth() {
// // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // // // //         document.getElementById('user-status').innerText = `Logged in: ${user.email}`;
// // // // // // // // // // // // // // //         document.getElementById('login-section').style.display = 'none';
// // // // // // // // // // // // // // //         document.getElementById('main-content').style.display = 'flex';
// // // // // // // // // // // // // // //         document.getElementById('logout-btn').style.display = 'block';
        
// // // // // // // // // // // // // // //         // Initial load: Sabse naye 10 messages
// // // // // // // // // // // // // // //         loadChat(true); 
// // // // // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // // // // //         document.getElementById('user-status').innerText = "Access Denied. Please Login.";
// // // // // // // // // // // // // // //         document.getElementById('login-section').style.display = 'block';
// // // // // // // // // // // // // // //         document.getElementById('main-content').style.display = 'none';
// // // // // // // // // // // // // // //         document.getElementById('logout-btn').style.display = 'none';
// // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // async function handleLogin() {
// // // // // // // // // // // // // // //     const email = document.getElementById('email').value;
// // // // // // // // // // // // // // //     const pass = document.getElementById('password').value;
// // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // //         // Appwrite v14+ Compatibility
// // // // // // // // // // // // // // //         await account.createEmailPasswordSession(email, pass);
// // // // // // // // // // // // // // //         location.reload();
// // // // // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // // // // //         alert("Login Error: " + err.message);
// // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // async function handleLogout() {
// // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // //         await account.deleteSession('current');
// // // // // // // // // // // // // // //         location.reload();
// // // // // // // // // // // // // // //     } catch (err) { console.error(err); }
// // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // --- MESSAGING LOGIC ---
// // // // // // // // // // // // // // // async function handleSendMessage() {
// // // // // // // // // // // // // // //     const fileInput = document.getElementById('image-input');
// // // // // // // // // // // // // // //     const msgInput = document.getElementById('message-input');
// // // // // // // // // // // // // // //     const btn = document.getElementById('send-btn');
// // // // // // // // // // // // // // //     const file = fileInput.files[0];
// // // // // // // // // // // // // // //     const message = msgInput.value.trim();

// // // // // // // // // // // // // // //     if (!file && !message) return;

// // // // // // // // // // // // // // //     btn.disabled = true;
// // // // // // // // // // // // // // //     btn.innerText = "...";

// // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // // // //         let fileUrl = null;

// // // // // // // // // // // // // // //         // 1. Photo Upload (If exists)
// // // // // // // // // // // // // // //         if (file) {
// // // // // // // // // // // // // // //             const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);
// // // // // // // // // // // // // // //             fileUrl = storage.getFileView(BUCKET_ID, uploadedFile.$id).href;
// // // // // // // // // // // // // // //         }

// // // // // // // // // // // // // // //         // 2. Save to Database
// // // // // // // // // // // // // // //         await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
// // // // // // // // // // // // // // //             imageUrl: fileUrl,
// // // // // // // // // // // // // // //             message: message,
// // // // // // // // // // // // // // //             senderId: user.$id,
// // // // // // // // // // // // // // //             createdAt: new Date().toISOString()
// // // // // // // // // // // // // // //         });

// // // // // // // // // // // // // // //         // Reset inputs (No reload needed because of Real-time listener)
// // // // // // // // // // // // // // //         msgInput.value = '';
// // // // // // // // // // // // // // //         fileInput.value = '';
// // // // // // // // // // // // // // //         btn.disabled = false;
// // // // // // // // // // // // // // //         btn.innerText = "Send 🚀";
// // // // // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // // // // //         alert("Error: " + err.message);
// // // // // // // // // // // // // // //         btn.disabled = false;
// // // // // // // // // // // // // // //         btn.innerText = "Send 🚀";
// // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // --- RENDER & CHUNKING LOGIC ---
// // // // // // // // // // // // // // // async function loadChat(isInitial = true) {
// // // // // // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // // // //         if (isInitial) {
// // // // // // // // // // // // // // //             offset = 0;
// // // // // // // // // // // // // // //             allLoaded = false;
// // // // // // // // // // // // // // //             const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // // // // // // // // // //                 Query.orderDesc('createdAt'),
// // // // // // // // // // // // // // //                 Query.limit(LIMIT)
// // // // // // // // // // // // // // //             ]);
            
// // // // // // // // // // // // // // //             // Clear only once and preserve spinner
// // // // // // // // // // // // // // //             const loaderHTML = document.getElementById('load-more-spinner').outerHTML;
// // // // // // // // // // // // // // //             chatBox.innerHTML = loaderHTML; 

// // // // // // // // // // // // // // //             // Naye messages niche dikhane ke liye reverse()
// // // // // // // // // // // // // // //             response.documents.reverse().forEach(doc => renderMessage(doc, user, 'bottom'));
            
// // // // // // // // // // // // // // //             // Seedha bottom par scroll karein
// // // // // // // // // // // // // // //             chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // // // // // // // // // //         }
// // // // // // // // // // // // // // //     } catch (err) { console.log(err); }
// // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // 🔥 Naya Load More (Spinner ke saath)
// // // // // // // // // // // // // // // async function loadMoreMessages() {
// // // // // // // // // // // // // // //     if (isLoadingMore || allLoaded) return;
    
// // // // // // // // // // // // // // //     const loader = document.getElementById('load-more-spinner');
// // // // // // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
    
// // // // // // // // // // // // // // //     // 1. Loader dikhao
// // // // // // // // // // // // // // //     loader.style.display = 'block';
// // // // // // // // // // // // // // //     isLoadingMore = true;
    
// // // // // // // // // // // // // // //     const oldScrollHeight = chatBox.scrollHeight;

// // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // // // //         offset += LIMIT;

// // // // // // // // // // // // // // //         const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // // // // // // // // // //             Query.orderDesc('createdAt'),
// // // // // // // // // // // // // // //             Query.limit(LIMIT),
// // // // // // // // // // // // // // //             Query.offset(offset)
// // // // // // // // // // // // // // //         ]);

// // // // // // // // // // // // // // //         if (response.documents.length === 0) {
// // // // // // // // // // // // // // //             allLoaded = true;
// // // // // // // // // // // // // // //             loader.innerHTML = "<p style='font-size:10px; color:#8696a0;'>No more memories.</p>";
// // // // // // // // // // // // // // //             setTimeout(() => { loader.style.display = 'none'; }, 2000);
// // // // // // // // // // // // // // //             isLoadingMore = false;
// // // // // // // // // // // // // // //             return;
// // // // // // // // // // // // // // //         }

// // // // // // // // // // // // // // //         // 2. Purane messages render karo (Upar Prepend)
// // // // // // // // // // // // // // //         response.documents.forEach(doc => renderMessage(doc, user, 'top'));

// // // // // // // // // // // // // // //         // 3. Scroll position fix taaki jhatka na lage
// // // // // // // // // // // // // // //         chatBox.scrollTop = chatBox.scrollHeight - oldScrollHeight;
        
// // // // // // // // // // // // // // //     } catch (err) { 
// // // // // // // // // // // // // // //         console.log(err); 
// // // // // // // // // // // // // // //     } finally {
// // // // // // // // // // // // // // //         // 4. Loader chhupao
// // // // // // // // // // // // // // //         setTimeout(() => {
// // // // // // // // // // // // // // //             if (!allLoaded) {
// // // // // // // // // // // // // // //                 document.getElementById('load-more-spinner').style.display = 'none';
// // // // // // // // // // // // // // //             }
// // // // // // // // // // // // // // //             isLoadingMore = false;
// // // // // // // // // // // // // // //         }, 500);
// // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // function renderMessage(doc, user, position = 'bottom') {
// // // // // // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // // // // // //     const isMe = doc.senderId === user.$id;
    
// // // // // // // // // // // // // // //     const bubble = document.createElement('div');
// // // // // // // // // // // // // // //     bubble.className = `bubble ${isMe ? 'my-bubble' : 'friend-bubble'}`;
    
// // // // // // // // // // // // // // //     let content = doc.imageUrl ? `<img src="${doc.imageUrl}" loading="lazy" onclick="openViewer('${doc.imageUrl}')">` : "";
// // // // // // // // // // // // // // //     content += doc.message ? `<p class="chat-text">${doc.message}</p>` : "";
    
// // // // // // // // // // // // // // //     const time = new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// // // // // // // // // // // // // // //     // Trash icon added
// // // // // // // // // // // // // // //     const deleteBtn = isMe ? `<span class="delete-icon" onclick="deleteMessage('${doc.$id}', '${doc.imageUrl}')"><i class="fa-solid fa-trash"></i></span>` : "";

// // // // // // // // // // // // // // //     bubble.innerHTML = `${content}<div class="bubble-footer">${deleteBtn}<div class="time">${time}</div></div>`;
    
// // // // // // // // // // // // // // //     if (position === 'bottom') {
// // // // // // // // // // // // // // //         chatBox.appendChild(bubble);
// // // // // // // // // // // // // // //         // Naye real-time message par smooth scroll
// // // // // // // // // // // // // // //         chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
// // // // // // // // // // // // // // //     } else {
// // // // // // // // // // // // // // //         // Spinner ke niche prepend karo
// // // // // // // // // // // // // // //         const loader = document.getElementById('load-more-spinner');
// // // // // // // // // // // // // // //         loader.after(bubble);
// // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // --- SCROLL EVENT FOR INFINITE SCROLL ---
// // // // // // // // // // // // // // // document.getElementById('chat-box').addEventListener('scroll', (e) => {
// // // // // // // // // // // // // // //     // Top par pahunchte hi purane load karo
// // // // // // // // // // // // // // //     if (e.target.scrollTop === 0) {
// // // // // // // // // // // // // // //         loadMoreMessages(); 
// // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // });

// // // // // // // // // // // // // // // // --- DELETE LOGIC ---
// // // // // // // // // // // // // // // async function deleteMessage(docId, fileUrl) {
// // // // // // // // // // // // // // //     if (!confirm("Bhai, pakka delete karna hai?")) return;
// // // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // // //         await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, docId);
// // // // // // // // // // // // // // //         if (fileUrl) {
// // // // // // // // // // // // // // //             const fileId = fileUrl.split('/').reverse()[1];
// // // // // // // // // // // // // // //             try { await storage.deleteFile(BUCKET_ID, fileId); } catch(e) {}
// // // // // // // // // // // // // // //         }
// // // // // // // // // // // // // // //         location.reload(); 
// // // // // // // // // // // // // // //     } catch (err) { alert("Delete fail: " + err.message); }
// // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // --- VIEWER (With Active State for CSS Animation) ---
// // // // // // // // // // // // // // // function openViewer(src) {
// // // // // // // // // // // // // // //     const viewer = document.getElementById('image-viewer');
// // // // // // // // // // // // // // //     const img = document.getElementById('full-image');
// // // // // // // // // // // // // // //     img.src = src;
// // // // // // // // // // // // // // //     viewer.classList.add("active"); // 🔥 Trigger class for animation
// // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // function closeViewer() {
// // // // // // // // // // // // // // //     const viewer = document.getElementById('image-viewer');
// // // // // // // // // // // // // // //     viewer.classList.remove("active");
// // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // Close viewer on Esc key
// // // // // // // // // // // // // // // document.addEventListener('keydown', (e) => {
// // // // // // // // // // // // // // //     if (e.key === 'Escape') closeViewer();
// // // // // // // // // // // // // // // });

// // // // // // // // // // // // // // // // --- REAL-TIME SUBSCRIPTION ---
// // // // // // // // // // // // // // // client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`, async (res) => {
// // // // // // // // // // // // // // //     const user = await account.get();
// // // // // // // // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.create")) {
// // // // // // // // // // // // // // //         // Naya message bottom par append hoga
// // // // // // // // // // // // // // //         renderMessage(res.payload, user, 'bottom');
// // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.delete")) {
// // // // // // // // // // // // // // //         location.reload();
// // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // });
// // // // // // // // // // // // // // // // Enter dabate hi send ho, Shift+Enter se next line
// // // // // // // // // // // // // // // document.getElementById('message-input').addEventListener('keydown', function(e) {
// // // // // // // // // // // // // // //     if (e.key === 'Enter' && !e.shiftKey) {
// // // // // // // // // // // // // // //         e.preventDefault(); // Enter se line change hone se roko
// // // // // // // // // // // // // // //         handleSendMessage(); // Message bhej do
// // // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // // });
// // // // // // // // // // // // // // // // Initial Start
// // // // // // // // // // // // // // // checkAuth();
// // // // // // // // // // // // // // const { Client, Account, Storage, Databases, ID, Query } = Appwrite;

// // // // // // // // // // // // // // // --- CONFIGURATION ---
// // // // // // // // // // // // // // const client = new Client()
// // // // // // // // // // // // // //     .setEndpoint('https://cloud.appwrite.io/v1')
// // // // // // // // // // // // // //     .setProject('69bcc12d00306fe9ce4d');

// // // // // // // // // // // // // // const account = new Account(client);
// // // // // // // // // // // // // // const storage = new Storage(client);
// // // // // // // // // // // // // // const databases = new Databases(client);

// // // // // // // // // // // // // // const BUCKET_ID = '69bcc2cc0025e83e281d'; 
// // // // // // // // // // // // // // const DATABASE_ID = '69bcd743001d1369dedc';
// // // // // // // // // // // // // // const COLLECTION_ID = 'photos';

// // // // // // // // // // // // // // let offset = 0;
// // // // // // // // // // // // // // const LIMIT = 10;
// // // // // // // // // // // // // // let isLoadingMore = false;
// // // // // // // // // // // // // // let allLoaded = false;

// // // // // // // // // // // // // // // --- AUTH ---
// // // // // // // // // // // // // // async function checkAuth() {
// // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // // //         document.getElementById('user-status').innerText = `Logged in: ${user.email}`;
// // // // // // // // // // // // // //         document.getElementById('login-section').style.display = 'none';
// // // // // // // // // // // // // //         document.getElementById('main-content').style.display = 'flex';
// // // // // // // // // // // // // //         document.getElementById('logout-btn').style.display = 'block';
// // // // // // // // // // // // // //         loadChat(true);
// // // // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // // // //         document.getElementById('user-status').innerText = "Access Denied. Please Login.";
// // // // // // // // // // // // // //         document.getElementById('login-section').style.display = 'block';
// // // // // // // // // // // // // //         document.getElementById('main-content').style.display = 'none';
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // async function handleLogin() {
// // // // // // // // // // // // // //     const email = document.getElementById('email').value;
// // // // // // // // // // // // // //     const pass = document.getElementById('password').value;
// // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // //         await account.createEmailPasswordSession(email, pass);
// // // // // // // // // // // // // //         location.reload();
// // // // // // // // // // // // // //     } catch (err) { alert("Login Error: " + err.message); }
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // async function handleLogout() {
// // // // // // // // // // // // // //     await account.deleteSession('current');
// // // // // // // // // // // // // //     location.reload();
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // --- PREVIEW LOGIC ---
// // // // // // // // // // // // // // document.getElementById('image-input').addEventListener('change', function(e) {
// // // // // // // // // // // // // //     const file = e.target.files[0];
// // // // // // // // // // // // // //     const previewContainer = document.getElementById('image-preview-container');
// // // // // // // // // // // // // //     const previewImg = document.getElementById('image-preview');

// // // // // // // // // // // // // //     if (file) {
// // // // // // // // // // // // // //         const reader = new FileReader();
// // // // // // // // // // // // // //         reader.onload = function(event) {
// // // // // // // // // // // // // //             previewImg.src = event.target.result;
// // // // // // // // // // // // // //             fileNameDisplay.innerText = file.name;
// // // // // // // // // // // // // //             previewContainer.style.display = 'block';
// // // // // // // // // // // // // //         }
// // // // // // // // // // // // // //         reader.readAsDataURL(file);
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // });

// // // // // // // // // // // // // // function clearImagePreview() {
// // // // // // // // // // // // // //     document.getElementById('image-input').value = '';
// // // // // // // // // // // // // //     document.getElementById('image-preview').src = '';
// // // // // // // // // // // // // //     document.getElementById('image-preview-container').style.display = 'none';
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // --- MESSAGING ---
// // // // // // // // // // // // // // async function handleSendMessage() {
// // // // // // // // // // // // // //     const fileInput = document.getElementById('image-input');
// // // // // // // // // // // // // //     const msgInput = document.getElementById('message-input');
// // // // // // // // // // // // // //     const btn = document.getElementById('send-btn');
// // // // // // // // // // // // // //     const file = fileInput.files[0];
// // // // // // // // // // // // // //     const message = msgInput.value.trim();

// // // // // // // // // // // // // //     if (!file && !message) return;

// // // // // // // // // // // // // //     btn.disabled = true;
// // // // // // // // // // // // // //     btn.innerText = "...";

// // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // // //         let fileUrl = null;

// // // // // // // // // // // // // //         if (file) {
// // // // // // // // // // // // // //             const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);
// // // // // // // // // // // // // //             fileUrl = storage.getFileView(BUCKET_ID, uploadedFile.$id).href;
// // // // // // // // // // // // // //         }

// // // // // // // // // // // // // //         await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
// // // // // // // // // // // // // //             imageUrl: fileUrl,
// // // // // // // // // // // // // //             message: message,
// // // // // // // // // // // // // //             senderId: user.$id,
// // // // // // // // // // // // // //             createdAt: new Date().toISOString()
// // // // // // // // // // // // // //         });

// // // // // // // // // // // // // //         msgInput.value = '';
// // // // // // // // // // // // // //         clearImagePreview();
// // // // // // // // // // // // // //         btn.disabled = false;
// // // // // // // // // // // // // //         btn.innerText = "Send 🚀";
// // // // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // // // //         alert(err.message);
// // // // // // // // // // // // // //         btn.disabled = false;
// // // // // // // // // // // // // //         btn.innerText = "Send 🚀";
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // Keyboard Shortcut: Enter to Send
// // // // // // // // // // // // // // document.getElementById('message-input').addEventListener('keydown', function(e) {
// // // // // // // // // // // // // //     if (e.key === 'Enter' && !e.shiftKey) {
// // // // // // // // // // // // // //         e.preventDefault();
// // // // // // // // // // // // // //         handleSendMessage();
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // });

// // // // // // // // // // // // // // // --- RENDER LOGIC ---
// // // // // // // // // // // // // // async function loadChat(isInitial = true) {
// // // // // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // // //         if (isInitial) {
// // // // // // // // // // // // // //             offset = 0;
// // // // // // // // // // // // // //             allLoaded = false;
// // // // // // // // // // // // // //             const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // // // // // // // // //                 Query.orderDesc('createdAt'), Query.limit(LIMIT)
// // // // // // // // // // // // // //             ]);
// // // // // // // // // // // // // //             const loaderHTML = document.getElementById('load-more-spinner').outerHTML;
// // // // // // // // // // // // // //             chatBox.innerHTML = loaderHTML;
// // // // // // // // // // // // // //             response.documents.reverse().forEach(doc => renderMessage(doc, user, 'bottom'));
// // // // // // // // // // // // // //             chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // // // // // // // // //         }
// // // // // // // // // // // // // //     } catch (err) { console.log(err); }
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // async function loadMoreMessages() {
// // // // // // // // // // // // // //     if (isLoadingMore || allLoaded) return;
// // // // // // // // // // // // // //     isLoadingMore = true;
// // // // // // // // // // // // // //     const loader = document.getElementById('load-more-spinner');
// // // // // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // // // // //     loader.style.display = 'block';
// // // // // // // // // // // // // //     const oldScrollHeight = chatBox.scrollHeight;

// // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // // //         offset += LIMIT;
// // // // // // // // // // // // // //         const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // // // // // // // // //             Query.orderDesc('createdAt'), Query.limit(LIMIT), Query.offset(offset)
// // // // // // // // // // // // // //         ]);

// // // // // // // // // // // // // //         if (response.documents.length === 0) {
// // // // // // // // // // // // // //             allLoaded = true;
// // // // // // // // // // // // // //             loader.innerHTML = "<p style='font-size:10px; color:#8696a0;'>No more history.</p>";
// // // // // // // // // // // // // //         } else {
// // // // // // // // // // // // // //             response.documents.forEach(doc => renderMessage(doc, user, 'top'));
// // // // // // // // // // // // // //             chatBox.scrollTop = chatBox.scrollHeight - oldScrollHeight;
// // // // // // // // // // // // // //             loader.style.display = 'none';
// // // // // // // // // // // // // //         }
// // // // // // // // // // // // // //     } catch (err) { console.log(err); }
// // // // // // // // // // // // // //     isLoadingMore = false;
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // function renderMessage(doc, user, position = 'bottom') {
// // // // // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // // // // //     const isMe = doc.senderId === user.$id;
// // // // // // // // // // // // // //     const bubble = document.createElement('div');
// // // // // // // // // // // // // //     bubble.className = `bubble ${isMe ? 'my-bubble' : 'friend-bubble'}`;
    
// // // // // // // // // // // // // //     let content = doc.imageUrl ? `<img src="${doc.imageUrl}" loading="lazy" onclick="openViewer('${doc.imageUrl}')">` : "";
// // // // // // // // // // // // // //     content += doc.message ? `<p class="chat-text">${doc.message.replace(/\n/g, '<br>')}</p>` : "";
    
// // // // // // // // // // // // // //     const time = new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// // // // // // // // // // // // // //     const deleteBtn = isMe ? `<span class="delete-icon" onclick="deleteMessage('${doc.$id}', '${doc.imageUrl}')"><i class="fa-solid fa-trash"></i></span>` : "";

// // // // // // // // // // // // // //     bubble.innerHTML = `${content}<div class="bubble-footer">${deleteBtn}<div class="time">${time}</div></div>`;
    
// // // // // // // // // // // // // //     if (position === 'bottom') {
// // // // // // // // // // // // // //         chatBox.appendChild(bubble);
// // // // // // // // // // // // // //         chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
// // // // // // // // // // // // // //     } else {
// // // // // // // // // // // // // //         document.getElementById('load-more-spinner').after(bubble);
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // Scroll detection for load more
// // // // // // // // // // // // // // document.getElementById('chat-box').addEventListener('scroll', (e) => {
// // // // // // // // // // // // // //     if (e.target.scrollTop === 0) loadMoreMessages();
// // // // // // // // // // // // // // });

// // // // // // // // // // // // // // // Delete & Viewer
// // // // // // // // // // // // // // async function deleteMessage(docId, fileUrl) {
// // // // // // // // // // // // // //     if (!confirm("Delete?")) return;
// // // // // // // // // // // // // //     try {
// // // // // // // // // // // // // //         await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, docId);
// // // // // // // // // // // // // //         if (fileUrl) {
// // // // // // // // // // // // // //             const fileId = fileUrl.split('/').reverse()[1];
// // // // // // // // // // // // // //             await storage.deleteFile(BUCKET_ID, fileId);
// // // // // // // // // // // // // //         }
// // // // // // // // // // // // // //         location.reload();
// // // // // // // // // // // // // //     } catch (err) { alert(err.message); }
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // function openViewer(src) {
// // // // // // // // // // // // // //     document.getElementById('full-image').src = src;
// // // // // // // // // // // // // //     document.getElementById('image-viewer').classList.add("active");
// // // // // // // // // // // // // // }
// // // // // // // // // // // // // // function closeViewer() {
// // // // // // // // // // // // // //     document.getElementById('image-viewer').classList.remove("active");
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // Real-time
// // // // // // // // // // // // // // client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`, async (res) => {
// // // // // // // // // // // // // //     const user = await account.get();
// // // // // // // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.create")) {
// // // // // // // // // // // // // //         renderMessage(res.payload, user, 'bottom');
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.delete")) {
// // // // // // // // // // // // // //         location.reload();
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // // });

// // // // // // // // // // // // // // checkAuth();
// // // // // // // // // // // // // const { Client, Account, Storage, Databases, ID, Query } = Appwrite;

// // // // // // // // // // // // // // --- CONFIGURATION ---
// // // // // // // // // // // // // const client = new Client()
// // // // // // // // // // // // //     .setEndpoint('https://cloud.appwrite.io/v1')
// // // // // // // // // // // // //     .setProject('69bcc12d00306fe9ce4d');

// // // // // // // // // // // // // const account = new Account(client);
// // // // // // // // // // // // // const storage = new Storage(client);
// // // // // // // // // // // // // const databases = new Databases(client);

// // // // // // // // // // // // // const BUCKET_ID = '69bcc2cc0025e83e281d'; 
// // // // // // // // // // // // // const DATABASE_ID = '69bcd743001d1369dedc';
// // // // // // // // // // // // // const COLLECTION_ID = 'photos';

// // // // // // // // // // // // // let offset = 0;
// // // // // // // // // // // // // const LIMIT = 10;
// // // // // // // // // // // // // let isLoadingMore = false;
// // // // // // // // // // // // // let allLoaded = false;

// // // // // // // // // // // // // // --- AUTHENTICATION ---
// // // // // // // // // // // // // async function checkAuth() {
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // //         document.getElementById('user-status').innerText = `Logged in: ${user.email}`;
// // // // // // // // // // // // //         document.getElementById('login-section').style.display = 'none';
// // // // // // // // // // // // //         document.getElementById('main-content').style.display = 'flex';
// // // // // // // // // // // // //         document.getElementById('logout-btn').style.display = 'block';
// // // // // // // // // // // // //         loadChat(true); 
// // // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // // //         document.getElementById('user-status').innerText = "Access Denied. Please Login.";
// // // // // // // // // // // // //         document.getElementById('login-section').style.display = 'block';
// // // // // // // // // // // // //         document.getElementById('main-content').style.display = 'none';
// // // // // // // // // // // // //     }
// // // // // // // // // // // // // }

// // // // // // // // // // // // // async function handleLogin() {
// // // // // // // // // // // // //     const email = document.getElementById('email').value;
// // // // // // // // // // // // //     const pass = document.getElementById('password').value;
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //         await account.createEmailPasswordSession(email, pass);
// // // // // // // // // // // // //         location.reload();
// // // // // // // // // // // // //     } catch (err) { alert("Login Error: " + err.message); }
// // // // // // // // // // // // // }

// // // // // // // // // // // // // async function handleLogout() {
// // // // // // // // // // // // //     await account.deleteSession('current');
// // // // // // // // // // // // //     location.reload();
// // // // // // // // // // // // // }

// // // // // // // // // // // // // // --- IMAGE PREVIEW LOGIC (Updated for Name & Left Align) ---
// // // // // // // // // // // // // document.getElementById('image-input').addEventListener('change', function(e) {
// // // // // // // // // // // // //     const file = e.target.files[0];
// // // // // // // // // // // // //     const previewContainer = document.getElementById('image-preview-container');
// // // // // // // // // // // // //     const previewImg = document.getElementById('image-preview');
// // // // // // // // // // // // //     const fileNameDisplay = document.getElementById('file-name-display');

// // // // // // // // // // // // //     if (file) {
// // // // // // // // // // // // //         const reader = new FileReader();
// // // // // // // // // // // // //         reader.onload = function(event) {
// // // // // // // // // // // // //             previewImg.src = event.target.result;
// // // // // // // // // // // // //             if(fileNameDisplay) fileNameDisplay.innerText = file.name; // Displaying file name
// // // // // // // // // // // // //             previewContainer.style.display = 'block';
// // // // // // // // // // // // //         }
// // // // // // // // // // // // //         reader.readAsDataURL(file);
// // // // // // // // // // // // //     }
// // // // // // // // // // // // // });

// // // // // // // // // // // // // function clearImagePreview() {
// // // // // // // // // // // // //     document.getElementById('image-input').value = '';
// // // // // // // // // // // // //     document.getElementById('image-preview').src = '';
// // // // // // // // // // // // //     const fileNameDisplay = document.getElementById('file-name-display');
// // // // // // // // // // // // //     if(fileNameDisplay) fileNameDisplay.innerText = '';
// // // // // // // // // // // // //     document.getElementById('image-preview-container').style.display = 'none';
// // // // // // // // // // // // // }

// // // // // // // // // // // // // // --- MESSAGING LOGIC ---
// // // // // // // // // // // // // async function handleSendMessage() {
// // // // // // // // // // // // //     const fileInput = document.getElementById('image-input');
// // // // // // // // // // // // //     const msgInput = document.getElementById('message-input');
// // // // // // // // // // // // //     const btn = document.getElementById('send-btn');
// // // // // // // // // // // // //     const file = fileInput.files[0];
// // // // // // // // // // // // //     const message = msgInput.value.trim();

// // // // // // // // // // // // //     if (!file && !message) return;

// // // // // // // // // // // // //     btn.disabled = true;
// // // // // // // // // // // // //     btn.innerText = "...";

// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // //         let fileUrl = null;

// // // // // // // // // // // // //         if (file) {
// // // // // // // // // // // // //             const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);
// // // // // // // // // // // // //             fileUrl = storage.getFileView(BUCKET_ID, uploadedFile.$id).href;
// // // // // // // // // // // // //         }

// // // // // // // // // // // // //         await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
// // // // // // // // // // // // //             imageUrl: fileUrl,
// // // // // // // // // // // // //             message: message,
// // // // // // // // // // // // //             senderId: user.$id,
// // // // // // // // // // // // //             createdAt: new Date().toISOString()
// // // // // // // // // // // // //         });

// // // // // // // // // // // // //         msgInput.value = '';
// // // // // // // // // // // // //         clearImagePreview();
// // // // // // // // // // // // //         btn.disabled = false;
// // // // // // // // // // // // //         btn.innerText = "Send 🚀";
// // // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // // //         alert("Error: " + err.message);
// // // // // // // // // // // // //         btn.disabled = false;
// // // // // // // // // // // // //         btn.innerText = "Send 🚀";
// // // // // // // // // // // // //     }
// // // // // // // // // // // // // }

// // // // // // // // // // // // // // Keyboard Shortcut: Enter to Send
// // // // // // // // // // // // // document.getElementById('message-input').addEventListener('keydown', function(e) {
// // // // // // // // // // // // //     if (e.key === 'Enter' && !e.shiftKey) {
// // // // // // // // // // // // //         e.preventDefault();
// // // // // // // // // // // // //         handleSendMessage();
// // // // // // // // // // // // //     }
// // // // // // // // // // // // // });

// // // // // // // // // // // // // // --- RENDER & CHUNKING LOGIC ---
// // // // // // // // // // // // // async function loadChat(isInitial = true) {
// // // // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // //         if (isInitial) {
// // // // // // // // // // // // //             offset = 0;
// // // // // // // // // // // // //             allLoaded = false;
// // // // // // // // // // // // //             const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // // // // // // // //                 Query.orderDesc('createdAt'),
// // // // // // // // // // // // //                 Query.limit(LIMIT)
// // // // // // // // // // // // //             ]);
            
// // // // // // // // // // // // //             const loader = document.getElementById('load-more-spinner');
// // // // // // // // // // // // //             chatBox.innerHTML = '';
// // // // // // // // // // // // //             if(loader) chatBox.appendChild(loader);

// // // // // // // // // // // // //             response.documents.reverse().forEach(doc => renderMessage(doc, user, 'bottom'));
// // // // // // // // // // // // //             chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // // // // // // // //         }
// // // // // // // // // // // // //     } catch (err) { console.log(err); }
// // // // // // // // // // // // // }

// // // // // // // // // // // // // async function loadMoreMessages() {
// // // // // // // // // // // // //     if (isLoadingMore || allLoaded) return;
    
// // // // // // // // // // // // //     const loader = document.getElementById('load-more-spinner');
// // // // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // // // //     if(loader) loader.style.display = 'block';
// // // // // // // // // // // // //     isLoadingMore = true;
    
// // // // // // // // // // // // //     const oldScrollHeight = chatBox.scrollHeight;

// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // // //         offset += LIMIT;
// // // // // // // // // // // // //         const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // // // // // // // //             Query.orderDesc('createdAt'),
// // // // // // // // // // // // //             Query.limit(LIMIT),
// // // // // // // // // // // // //             Query.offset(offset)
// // // // // // // // // // // // //         ]);

// // // // // // // // // // // // //         if (response.documents.length === 0) {
// // // // // // // // // // // // //             allLoaded = true;
// // // // // // // // // // // // //             if(loader) loader.innerHTML = "<p style='font-size:10px; color:#8696a0;'>No more history.</p>";
// // // // // // // // // // // // //             return;
// // // // // // // // // // // // //         }

// // // // // // // // // // // // //         response.documents.forEach(doc => renderMessage(doc, user, 'top'));
// // // // // // // // // // // // //         chatBox.scrollTop = chatBox.scrollHeight - oldScrollHeight;
// // // // // // // // // // // // //     } catch (err) { console.log(err); }
// // // // // // // // // // // // //     finally {
// // // // // // // // // // // // //         isLoadingMore = false;
// // // // // // // // // // // // //         if(loader && !allLoaded) loader.style.display = 'none';
// // // // // // // // // // // // //     }
// // // // // // // // // // // // // }

// // // // // // // // // // // // // function renderMessage(doc, user, position = 'bottom') {
// // // // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // // // //     const isMe = doc.senderId === user.$id;
    
// // // // // // // // // // // // //     const bubble = document.createElement('div');
// // // // // // // // // // // // //     bubble.className = `bubble ${isMe ? 'my-bubble' : 'friend-bubble'}`;
    
// // // // // // // // // // // // //     let content = doc.imageUrl ? `<img src="${doc.imageUrl}" loading="lazy" onclick="openViewer('${doc.imageUrl}')">` : "";
// // // // // // // // // // // // //     content += doc.message ? `<p class="chat-text">${doc.message}</p>` : "";
    
// // // // // // // // // // // // //     const time = new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// // // // // // // // // // // // //     const deleteBtn = isMe ? `<span class="delete-icon" onclick="deleteMessage('${doc.$id}', '${doc.imageUrl}')"><i class="fa-solid fa-trash"></i></span>` : "";

// // // // // // // // // // // // //     bubble.innerHTML = `${content}<div class="bubble-footer">${deleteBtn}<div class="time">${time}</div></div>`;
    
// // // // // // // // // // // // //     if (position === 'bottom') {
// // // // // // // // // // // // //         chatBox.appendChild(bubble);
// // // // // // // // // // // // //         chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // // // // // // // //     } else {
// // // // // // // // // // // // //         const loader = document.getElementById('load-more-spinner');
// // // // // // // // // // // // //         if(loader) loader.after(bubble);
// // // // // // // // // // // // //         else chatBox.prepend(bubble);
// // // // // // // // // // // // //     }
// // // // // // // // // // // // // }

// // // // // // // // // // // // // document.getElementById('chat-box').addEventListener('scroll', (e) => {
// // // // // // // // // // // // //     if (e.target.scrollTop === 0) {
// // // // // // // // // // // // //         loadMoreMessages(); 
// // // // // // // // // // // // //     }
// // // // // // // // // // // // // });

// // // // // // // // // // // // // async function deleteMessage(docId, fileUrl) {
// // // // // // // // // // // // //     if (!confirm("Delete karna hai?")) return;
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //         await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, docId);
// // // // // // // // // // // // //         if (fileUrl) {
// // // // // // // // // // // // //             const fileId = fileUrl.split('/').reverse()[1];
// // // // // // // // // // // // //             try { await storage.deleteFile(BUCKET_ID, fileId); } catch(e) {}
// // // // // // // // // // // // //         }
// // // // // // // // // // // // //         location.reload(); 
// // // // // // // // // // // // //     } catch (err) { alert(err.message); }
// // // // // // // // // // // // // }

// // // // // // // // // // // // // function openViewer(src) {
// // // // // // // // // // // // //     const viewer = document.getElementById('image-viewer');
// // // // // // // // // // // // //     document.getElementById('full-image').src = src;
// // // // // // // // // // // // //     if(viewer) viewer.classList.add("active");
// // // // // // // // // // // // //     else document.getElementById('image-viewer').style.display = 'block';
// // // // // // // // // // // // // }

// // // // // // // // // // // // // function closeViewer() {
// // // // // // // // // // // // //     const viewer = document.getElementById('image-viewer');
// // // // // // // // // // // // //     if(viewer) viewer.classList.remove("active");
// // // // // // // // // // // // //     else document.getElementById('image-viewer').style.display = 'none';
// // // // // // // // // // // // // }

// // // // // // // // // // // // // client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`, async (res) => {
// // // // // // // // // // // // //     const user = await account.get();
// // // // // // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.create")) {
// // // // // // // // // // // // //         renderMessage(res.payload, user, 'bottom');
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.delete")) {
// // // // // // // // // // // // //         location.reload();
// // // // // // // // // // // // //     }
// // // // // // // // // // // // // });

// // // // // // // // // // // // // checkAuth();
// // // // // // // // // // // // const { Client, Account, Storage, Databases, ID, Query } = Appwrite;

// // // // // // // // // // // // // --- CONFIGURATION ---
// // // // // // // // // // // // const client = new Client()
// // // // // // // // // // // //     .setEndpoint('https://cloud.appwrite.io/v1')
// // // // // // // // // // // //     .setProject('69bcc12d00306fe9ce4d');

// // // // // // // // // // // // const account = new Account(client);
// // // // // // // // // // // // const storage = new Storage(client);
// // // // // // // // // // // // const databases = new Databases(client);

// // // // // // // // // // // // const BUCKET_ID = '69bcc2cc0025e83e281d'; 
// // // // // // // // // // // // const DATABASE_ID = '69bcd743001d1369dedc';
// // // // // // // // // // // // const COLLECTION_ID = 'photos';

// // // // // // // // // // // // let offset = 0;
// // // // // // // // // // // // const LIMIT = 10;
// // // // // // // // // // // // let isLoadingMore = false;
// // // // // // // // // // // // let allLoaded = false;

// // // // // // // // // // // // // --- AUTHENTICATION ---
// // // // // // // // // // // // async function checkAuth() {
// // // // // // // // // // // //     try {
// // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // //         document.getElementById('user-status').innerText = `Logged in: ${user.email}`;
// // // // // // // // // // // //         document.getElementById('login-section').style.display = 'none';
// // // // // // // // // // // //         document.getElementById('main-content').style.display = 'flex';
// // // // // // // // // // // //         document.getElementById('logout-btn').style.display = 'block';
// // // // // // // // // // // //         loadChat(true); 
// // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // //         document.getElementById('user-status').innerText = "Access Denied. Please Login.";
// // // // // // // // // // // //         document.getElementById('login-section').style.display = 'block';
// // // // // // // // // // // //         document.getElementById('main-content').style.display = 'none';
// // // // // // // // // // // //     }
// // // // // // // // // // // // }

// // // // // // // // // // // // async function handleLogin() {
// // // // // // // // // // // //     const email = document.getElementById('email').value;
// // // // // // // // // // // //     const pass = document.getElementById('password').value;
// // // // // // // // // // // //     try {
// // // // // // // // // // // //         await account.createEmailPasswordSession(email, pass);
// // // // // // // // // // // //         location.reload();
// // // // // // // // // // // //     } catch (err) { alert("Login Error: " + err.message); }
// // // // // // // // // // // // }

// // // // // // // // // // // // async function handleLogout() {
// // // // // // // // // // // //     await account.deleteSession('current');
// // // // // // // // // // // //     location.reload();
// // // // // // // // // // // // }

// // // // // // // // // // // // // --- IMAGE PREVIEW LOGIC ---
// // // // // // // // // // // // document.getElementById('image-input').addEventListener('change', function(e) {
// // // // // // // // // // // //     const file = e.target.files[0];
// // // // // // // // // // // //     const previewContainer = document.getElementById('image-preview-container');
// // // // // // // // // // // //     const previewImg = document.getElementById('image-preview');
// // // // // // // // // // // //     const fileNameDisplay = document.getElementById('file-name-display');

// // // // // // // // // // // //     if (file) {
// // // // // // // // // // // //         const reader = new FileReader();
// // // // // // // // // // // //         reader.onload = function(event) {
// // // // // // // // // // // //             previewImg.src = event.target.result;
// // // // // // // // // // // //             if(fileNameDisplay) fileNameDisplay.innerText = file.name;
// // // // // // // // // // // //             previewContainer.style.display = 'block';
// // // // // // // // // // // //         }
// // // // // // // // // // // //         reader.readAsDataURL(file);
// // // // // // // // // // // //     }
// // // // // // // // // // // // });

// // // // // // // // // // // // function clearImagePreview() {
// // // // // // // // // // // //     document.getElementById('image-input').value = '';
// // // // // // // // // // // //     document.getElementById('image-preview').src = '';
// // // // // // // // // // // //     const fileNameDisplay = document.getElementById('file-name-display');
// // // // // // // // // // // //     if(fileNameDisplay) fileNameDisplay.innerText = '';
// // // // // // // // // // // //     document.getElementById('image-preview-container').style.display = 'none';
// // // // // // // // // // // // }

// // // // // // // // // // // // // --- MESSAGING LOGIC ---
// // // // // // // // // // // // async function handleSendMessage() {
// // // // // // // // // // // //     const fileInput = document.getElementById('image-input');
// // // // // // // // // // // //     const msgInput = document.getElementById('message-input');
// // // // // // // // // // // //     const btn = document.getElementById('send-btn');
// // // // // // // // // // // //     const file = fileInput.files[0];
// // // // // // // // // // // //     const message = msgInput.value.trim();

// // // // // // // // // // // //     if (!file && !message) return;

// // // // // // // // // // // //     btn.disabled = true;
// // // // // // // // // // // //     btn.innerText = "...";

// // // // // // // // // // // //     try {
// // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // //         let fileUrl = null;

// // // // // // // // // // // //         if (file) {
// // // // // // // // // // // //             const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);
// // // // // // // // // // // //             fileUrl = storage.getFileView(BUCKET_ID, uploadedFile.$id).href;
// // // // // // // // // // // //         }

// // // // // // // // // // // //         await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
// // // // // // // // // // // //             imageUrl: fileUrl,
// // // // // // // // // // // //             message: message,
// // // // // // // // // // // //             senderId: user.$id,
// // // // // // // // // // // //             createdAt: new Date().toISOString()
// // // // // // // // // // // //         });

// // // // // // // // // // // //         msgInput.value = '';
// // // // // // // // // // // //         clearImagePreview();
// // // // // // // // // // // //         btn.disabled = false;
// // // // // // // // // // // //         btn.innerText = "Send 🚀";
// // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // //         alert("Error: " + err.message);
// // // // // // // // // // // //         btn.disabled = false;
// // // // // // // // // // // //         btn.innerText = "Send 🚀";
// // // // // // // // // // // //     }
// // // // // // // // // // // // }

// // // // // // // // // // // // document.getElementById('message-input').addEventListener('keydown', function(e) {
// // // // // // // // // // // //     if (e.key === 'Enter' && !e.shiftKey) {
// // // // // // // // // // // //         e.preventDefault();
// // // // // // // // // // // //         handleSendMessage();
// // // // // // // // // // // //     }
// // // // // // // // // // // // });

// // // // // // // // // // // // // --- RENDER LOGIC ---
// // // // // // // // // // // // async function loadChat(isInitial = true) {
// // // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // // //     try {
// // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // //         if (isInitial) {
// // // // // // // // // // // //             offset = 0;
// // // // // // // // // // // //             allLoaded = false;
// // // // // // // // // // // //             const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // // // // // // //                 Query.orderDesc('createdAt'),
// // // // // // // // // // // //                 Query.limit(LIMIT)
// // // // // // // // // // // //             ]);
            
// // // // // // // // // // // //             const loader = document.getElementById('load-more-spinner');
// // // // // // // // // // // //             chatBox.innerHTML = '';
// // // // // // // // // // // //             if(loader) chatBox.appendChild(loader);

// // // // // // // // // // // //             response.documents.reverse().forEach(doc => renderMessage(doc, user, 'bottom'));
// // // // // // // // // // // //             chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // // // // // // //         }
// // // // // // // // // // // //     } catch (err) { console.log(err); }
// // // // // // // // // // // // }

// // // // // // // // // // // // async function loadMoreMessages() {
// // // // // // // // // // // //     if (isLoadingMore || allLoaded) return;
// // // // // // // // // // // //     const loader = document.getElementById('load-more-spinner');
// // // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // // //     if(loader) loader.style.display = 'block';
// // // // // // // // // // // //     isLoadingMore = true;
// // // // // // // // // // // //     const oldScrollHeight = chatBox.scrollHeight;

// // // // // // // // // // // //     try {
// // // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // // //         offset += LIMIT;
// // // // // // // // // // // //         const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // // // // // // //             Query.orderDesc('createdAt'),
// // // // // // // // // // // //             Query.limit(LIMIT),
// // // // // // // // // // // //             Query.offset(offset)
// // // // // // // // // // // //         ]);

// // // // // // // // // // // //         if (response.documents.length === 0) {
// // // // // // // // // // // //             allLoaded = true;
// // // // // // // // // // // //             if(loader) loader.innerHTML = "<p style='font-size:10px; color:#8696a0;'>No more history.</p>";
// // // // // // // // // // // //             return;
// // // // // // // // // // // //         }

// // // // // // // // // // // //         response.documents.forEach(doc => renderMessage(doc, user, 'top'));
// // // // // // // // // // // //         chatBox.scrollTop = chatBox.scrollHeight - oldScrollHeight;
// // // // // // // // // // // //     } catch (err) { console.log(err); }
// // // // // // // // // // // //     finally {
// // // // // // // // // // // //         isLoadingMore = false;
// // // // // // // // // // // //         if(loader && !allLoaded) loader.style.display = 'none';
// // // // // // // // // // // //     }
// // // // // // // // // // // // }

// // // // // // // // // // // // function renderMessage(doc, user, position = 'bottom') {
// // // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // // //     const isMe = doc.senderId === user.$id;
    
// // // // // // // // // // // //     // 🔥 Added ID to bubble for Real-time deletion
// // // // // // // // // // // //     const bubble = document.createElement('div');
// // // // // // // // // // // //     bubble.className = `bubble ${isMe ? 'my-bubble' : 'friend-bubble'}`;
// // // // // // // // // // // //     bubble.id = `msg-${doc.$id}`; 
    
// // // // // // // // // // // //     let content = doc.imageUrl ? `<img src="${doc.imageUrl}" loading="lazy" onclick="openViewer('${doc.imageUrl}')">` : "";
// // // // // // // // // // // //     content += doc.message ? `<p class="chat-text">${doc.message}</p>` : "";
    
// // // // // // // // // // // //     const time = new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// // // // // // // // // // // //     const deleteBtn = isMe ? `<span class="delete-icon" onclick="deleteMessage('${doc.$id}', '${doc.imageUrl}')"><i class="fa-solid fa-trash"></i></span>` : "";

// // // // // // // // // // // //     bubble.innerHTML = `${content}<div class="bubble-footer">${deleteBtn}<div class="time">${time}</div></div>`;
    
// // // // // // // // // // // //     if (position === 'bottom') {
// // // // // // // // // // // //         chatBox.appendChild(bubble);
// // // // // // // // // // // //         chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
// // // // // // // // // // // //     } else {
// // // // // // // // // // // //         const loader = document.getElementById('load-more-spinner');
// // // // // // // // // // // //         if(loader) loader.after(bubble);
// // // // // // // // // // // //         else chatBox.prepend(bubble);
// // // // // // // // // // // //     }
// // // // // // // // // // // // }

// // // // // // // // // // // // // --- SMOOTH DELETE LOGIC ---
// // // // // // // // // // // // async function deleteMessage(docId, fileUrl) {
// // // // // // // // // // // //     if (!confirm("Bhai, pakka delete karna hai?")) return;
    
// // // // // // // // // // // //     // 1. UI se turant dabba gayab karo (Instant feel)
// // // // // // // // // // // //     const element = document.getElementById(`msg-${docId}`);
// // // // // // // // // // // //     if (element) element.style.opacity = '0.3'; // Thoda faint kar do loading dikhane ke liye

// // // // // // // // // // // //     try {
// // // // // // // // // // // //         // 2. Database se delete karo
// // // // // // // // // // // //         await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, docId);
        
// // // // // // // // // // // //         // 3. Storage se file delete karo
// // // // // // // // // // // //         if (fileUrl) {
// // // // // // // // // // // //             const fileId = fileUrl.split('/').reverse()[1];
// // // // // // // // // // // //             try { await storage.deleteFile(BUCKET_ID, fileId); } catch(e) {}
// // // // // // // // // // // //         }
        
// // // // // // // // // // // //         // 4. UI se poora remove kar do
// // // // // // // // // // // //         if (element) element.remove();
        
// // // // // // // // // // // //     } catch (err) { 
// // // // // // // // // // // //         alert("Delete fail: " + err.message);
// // // // // // // // // // // //         if (element) element.style.opacity = '1'; // Error aaye toh wapas dikhao
// // // // // // // // // // // //     }
// // // // // // // // // // // // }

// // // // // // // // // // // // // --- REAL-TIME SUBSCRIPTION ---
// // // // // // // // // // // // client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`, async (res) => {
// // // // // // // // // // // //     const user = await account.get();
    
// // // // // // // // // // // //     // Naya Message Aane Par
// // // // // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.create")) {
// // // // // // // // // // // //         renderMessage(res.payload, user, 'bottom');
// // // // // // // // // // // //     }
    
// // // // // // // // // // // //     // 🔥 Message Delete Hone Par (Real-time for both sides)
// // // // // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.delete")) {
// // // // // // // // // // // //         const deletedId = res.payload.$id;
// // // // // // // // // // // //         const element = document.getElementById(`msg-${deletedId}`);
// // // // // // // // // // // //         if (element) {
// // // // // // // // // // // //             element.style.transform = "scale(0)"; // Chhota hokar gayab ho
// // // // // // // // // // // //             element.style.transition = "0.3s";
// // // // // // // // // // // //             setTimeout(() => element.remove(), 300);
// // // // // // // // // // // //         }
// // // // // // // // // // // //     }
// // // // // // // // // // // // });

// // // // // // // // // // // // // Initial Start
// // // // // // // // // // // // document.getElementById('chat-box').addEventListener('scroll', (e) => {
// // // // // // // // // // // //     if (e.target.scrollTop === 0) loadMoreMessages();
// // // // // // // // // // // // });
// // // // // // // // // // // // checkAuth();
// // // // // // // // // // // const { Client, Account, Storage, Databases, ID, Query } = Appwrite;

// // // // // // // // // // // // --- CONFIGURATION ---
// // // // // // // // // // // const client = new Client()
// // // // // // // // // // //     .setEndpoint('https://cloud.appwrite.io/v1')
// // // // // // // // // // //     .setProject('69bcc12d00306fe9ce4d');

// // // // // // // // // // // const account = new Account(client);
// // // // // // // // // // // const storage = new Storage(client);
// // // // // // // // // // // const databases = new Databases(client);

// // // // // // // // // // // const BUCKET_ID = '69bcc2cc0025e83e281d'; 
// // // // // // // // // // // const DATABASE_ID = '69bcd743001d1369dedc';
// // // // // // // // // // // const COLLECTION_ID = 'photos';

// // // // // // // // // // // let offset = 0;
// // // // // // // // // // // const LIMIT = 10;
// // // // // // // // // // // let isLoadingMore = false;
// // // // // // // // // // // let allLoaded = false;

// // // // // // // // // // // // --- AUTHENTICATION ---
// // // // // // // // // // // async function checkAuth() {
// // // // // // // // // // //     try {
// // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // //         document.getElementById('user-status').innerText = `Logged in: ${user.email}`;
// // // // // // // // // // //         document.getElementById('login-section').style.display = 'none';
// // // // // // // // // // //         document.getElementById('main-content').style.display = 'flex';
// // // // // // // // // // //         document.getElementById('logout-btn').style.display = 'block';
// // // // // // // // // // //         loadChat(true); 
// // // // // // // // // // //     } catch (err) {
// // // // // // // // // // //         document.getElementById('user-status').innerText = "Access Denied. Please Login.";
// // // // // // // // // // //         document.getElementById('login-section').style.display = 'block';
// // // // // // // // // // //         document.getElementById('main-content').style.display = 'none';
// // // // // // // // // // //     }
// // // // // // // // // // // }

// // // // // // // // // // // async function handleLogin() {
// // // // // // // // // // //     const email = document.getElementById('email').value;
// // // // // // // // // // //     const pass = document.getElementById('password').value;
// // // // // // // // // // //     try {
// // // // // // // // // // //         await account.createEmailPasswordSession(email, pass);
// // // // // // // // // // //         location.reload();
// // // // // // // // // // //     } catch (err) { alert("Login Error: " + err.message); }
// // // // // // // // // // // }

// // // // // // // // // // // async function handleLogout() {
// // // // // // // // // // //     await account.deleteSession('current');
// // // // // // // // // // //     location.reload();
// // // // // // // // // // // }

// // // // // // // // // // // // --- IMAGE PREVIEW LOGIC ---
// // // // // // // // // // // document.getElementById('image-input').addEventListener('change', function(e) {
// // // // // // // // // // //     const file = e.target.files[0];
// // // // // // // // // // //     const previewContainer = document.getElementById('image-preview-container');
// // // // // // // // // // //     const previewImg = document.getElementById('image-preview');
// // // // // // // // // // //     const fileNameDisplay = document.getElementById('file-name-display');

// // // // // // // // // // //     if (file) {
// // // // // // // // // // //         const reader = new FileReader();
// // // // // // // // // // //         reader.onload = function(event) {
// // // // // // // // // // //             previewImg.src = event.target.result;
// // // // // // // // // // //             if(fileNameDisplay) fileNameDisplay.innerText = file.name;
// // // // // // // // // // //             previewContainer.style.display = 'block';
// // // // // // // // // // //         }
// // // // // // // // // // //         reader.readAsDataURL(file);
// // // // // // // // // // //     }
// // // // // // // // // // // });

// // // // // // // // // // // function clearImagePreview() {
// // // // // // // // // // //     document.getElementById('image-input').value = '';
// // // // // // // // // // //     document.getElementById('image-preview').src = '';
// // // // // // // // // // //     const fileNameDisplay = document.getElementById('file-name-display');
// // // // // // // // // // //     if(fileNameDisplay) fileNameDisplay.innerText = '';
// // // // // // // // // // //     document.getElementById('image-preview-container').style.display = 'none';
// // // // // // // // // // // }

// // // // // // // // // // // // --- MESSAGING LOGIC ---
// // // // // // // // // // // async function handleSendMessage() {
// // // // // // // // // // //     const fileInput = document.getElementById('image-input');
// // // // // // // // // // //     const msgInput = document.getElementById('message-input');
// // // // // // // // // // //     const btn = document.getElementById('send-btn');
// // // // // // // // // // //     const file = fileInput.files[0];
// // // // // // // // // // //     const message = msgInput.value.trim();

// // // // // // // // // // //     if (!file && !message) return;

// // // // // // // // // // //     btn.disabled = true;
// // // // // // // // // // //     btn.innerText = "...";

// // // // // // // // // // //     try {
// // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // //         let fileUrl = null;

// // // // // // // // // // //         if (file) {
// // // // // // // // // // //             const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);
// // // // // // // // // // //             fileUrl = storage.getFileView(BUCKET_ID, uploadedFile.$id).href;
// // // // // // // // // // //         }

// // // // // // // // // // //         await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
// // // // // // // // // // //             imageUrl: fileUrl,
// // // // // // // // // // //             message: message,
// // // // // // // // // // //             senderId: user.$id,
// // // // // // // // // // //             isSeen: false, // Default unseen
// // // // // // // // // // //             createdAt: new Date().toISOString()
// // // // // // // // // // //         });

// // // // // // // // // // //         msgInput.value = '';
// // // // // // // // // // //         clearImagePreview();
// // // // // // // // // // //         btn.disabled = false;
// // // // // // // // // // //         btn.innerText = "Send 🚀";
// // // // // // // // // // //     } catch (err) {
// // // // // // // // // // //         alert("Error: " + err.message);
// // // // // // // // // // //         btn.disabled = false;
// // // // // // // // // // //         btn.innerText = "Send 🚀";
// // // // // // // // // // //     }
// // // // // // // // // // // }

// // // // // // // // // // // // Enter to Send
// // // // // // // // // // // document.getElementById('message-input').addEventListener('keydown', function(e) {
// // // // // // // // // // //     if (e.key === 'Enter' && !e.shiftKey) {
// // // // // // // // // // //         e.preventDefault();
// // // // // // // // // // //         handleSendMessage();
// // // // // // // // // // //     }
// // // // // // // // // // // });

// // // // // // // // // // // // --- RENDER & SEEN LOGIC ---
// // // // // // // // // // // async function markAsSeen(docId) {
// // // // // // // // // // //     try {
// // // // // // // // // // //         await databases.updateDocument(DATABASE_ID, COLLECTION_ID, docId, { isSeen: true });
// // // // // // // // // // //     } catch (err) { console.log("Seen update error", err); }
// // // // // // // // // // // }

// // // // // // // // // // // async function loadChat(isInitial = true) {
// // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // //     try {
// // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // //         if (isInitial) {
// // // // // // // // // // //             offset = 0;
// // // // // // // // // // //             allLoaded = false;
// // // // // // // // // // //             const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // // // // // //                 Query.orderDesc('createdAt'),
// // // // // // // // // // //                 Query.limit(LIMIT)
// // // // // // // // // // //             ]);
            
// // // // // // // // // // //             chatBox.innerHTML = '<div id="load-more-spinner" style="display: none; text-align: center; padding: 10px;"><div class="spinner"></div></div>';
            
// // // // // // // // // // //             response.documents.reverse().forEach(doc => {
// // // // // // // // // // //                 renderMessage(doc, user, 'bottom');
// // // // // // // // // // //                 if (doc.senderId !== user.$id && !doc.isSeen) markAsSeen(doc.$id);
// // // // // // // // // // //             });
// // // // // // // // // // //             chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // // // // // //         }
// // // // // // // // // // //     } catch (err) { console.log(err); }
// // // // // // // // // // // }

// // // // // // // // // // // async function loadMoreMessages() {
// // // // // // // // // // //     if (isLoadingMore || allLoaded) return;
// // // // // // // // // // //     isLoadingMore = true;
// // // // // // // // // // //     const loader = document.getElementById('load-more-spinner');
// // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // //     if(loader) loader.style.display = 'block';
// // // // // // // // // // //     const oldScrollHeight = chatBox.scrollHeight;

// // // // // // // // // // //     try {
// // // // // // // // // // //         const user = await account.get();
// // // // // // // // // // //         offset += LIMIT;
// // // // // // // // // // //         const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // // // // // //             Query.orderDesc('createdAt'), Query.limit(LIMIT), Query.offset(offset)
// // // // // // // // // // //         ]);

// // // // // // // // // // //         if (response.documents.length === 0) {
// // // // // // // // // // //             allLoaded = true;
// // // // // // // // // // //             if(loader) loader.innerHTML = "<p style='font-size:10px; color:#8696a0;'>History Ends.</p>";
// // // // // // // // // // //             return;
// // // // // // // // // // //         }

// // // // // // // // // // //         response.documents.forEach(doc => renderMessage(doc, user, 'top'));
// // // // // // // // // // //         chatBox.scrollTop = chatBox.scrollHeight - oldScrollHeight;
// // // // // // // // // // //     } catch (err) { console.log(err); }
// // // // // // // // // // //     finally {
// // // // // // // // // // //         isLoadingMore = false;
// // // // // // // // // // //         if(loader && !allLoaded) loader.style.display = 'none';
// // // // // // // // // // //     }
// // // // // // // // // // // }

// // // // // // // // // // // function renderMessage(doc, user, position = 'bottom') {
// // // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // // //     const isMe = doc.senderId === user.$id;
    
// // // // // // // // // // //     const bubble = document.createElement('div');
// // // // // // // // // // //     bubble.className = `bubble ${isMe ? 'my-bubble' : 'friend-bubble'}`;
// // // // // // // // // // //     bubble.id = `msg-${doc.$id}`; 
    
// // // // // // // // // // //     let content = doc.imageUrl ? `<img src="${doc.imageUrl}" loading="lazy" onclick="openViewer('${doc.imageUrl}')">` : "";
// // // // // // // // // // //     content += doc.message ? `<p class="chat-text">${doc.message}</p>` : "";
    
// // // // // // // // // // //     const time = new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// // // // // // // // // // //     const deleteBtn = isMe ? `<span class="delete-icon" onclick="deleteMessage('${doc.$id}', '${doc.imageUrl}')"><i class="fa-solid fa-trash"></i></span>` : "";
    
// // // // // // // // // // //     // 🔥 Double Ticks Logic
// // // // // // // // // // //     const ticks = isMe ? `<span class="tick-icon ${doc.isSeen ? 'seen' : ''}">${doc.isSeen ? '<i class="fa-solid fa-check-double"></i>' : '<i class="fa-solid fa-check"></i>'}</span>` : "";

// // // // // // // // // // //     bubble.innerHTML = `${content}<div class="bubble-footer">${deleteBtn}<div style="display:flex; align-items:center; gap:3px;"><div class="time">${time}</div>${ticks}</div></div>`;
    
// // // // // // // // // // //     if (position === 'bottom') {
// // // // // // // // // // //         chatBox.appendChild(bubble);
// // // // // // // // // // //         chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // // // // // //     } else {
// // // // // // // // // // //         const loader = document.getElementById('load-more-spinner');
// // // // // // // // // // //         if(loader) loader.after(bubble);
// // // // // // // // // // //         else chatBox.prepend(bubble);
// // // // // // // // // // //     }
// // // // // // // // // // // }

// // // // // // // // // // // // --- SMOOTH DELETE ---
// // // // // // // // // // // async function deleteMessage(docId, fileUrl) {
// // // // // // // // // // //     if (!confirm("Delete?")) return;
// // // // // // // // // // //     const element = document.getElementById(`msg-${docId}`);
// // // // // // // // // // //     try {
// // // // // // // // // // //         await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, docId);
// // // // // // // // // // //         if (fileUrl) {
// // // // // // // // // // //             const fileId = fileUrl.split('/').reverse()[1];
// // // // // // // // // // //             await storage.deleteFile(BUCKET_ID, fileId);
// // // // // // // // // // //         }
// // // // // // // // // // //         if (element) element.remove();
// // // // // // // // // // //     } catch (err) { alert(err.message); }
// // // // // // // // // // // }

// // // // // // // // // // // function openViewer(src) {
// // // // // // // // // // //     document.getElementById('full-image').src = src;
// // // // // // // // // // //     document.getElementById('image-viewer').classList.add("active");
// // // // // // // // // // // }
// // // // // // // // // // // function closeViewer() {
// // // // // // // // // // //     document.getElementById('image-viewer').classList.remove("active");
// // // // // // // // // // // }

// // // // // // // // // // // // --- REAL-TIME SUBSCRIPTION ---
// // // // // // // // // // // client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`, async (res) => {
// // // // // // // // // // //     const user = await account.get();
    
// // // // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.create")) {
// // // // // // // // // // //         renderMessage(res.payload, user, 'bottom');
// // // // // // // // // // //         if (res.payload.senderId !== user.$id) markAsSeen(res.payload.$id);
// // // // // // // // // // //     }
    
// // // // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.update")) {
// // // // // // // // // // //         const doc = res.payload;
// // // // // // // // // // //         const tickElement = document.querySelector(`#msg-${doc.$id} .tick-icon`);
// // // // // // // // // // //         if (tickElement && doc.isSeen) {
// // // // // // // // // // //             tickElement.classList.add('seen');
// // // // // // // // // // //             tickElement.innerHTML = '<i class="fa-solid fa-check-double"></i>';
// // // // // // // // // // //         }
// // // // // // // // // // //     }

// // // // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.delete")) {
// // // // // // // // // // //         const element = document.getElementById(`msg-${res.payload.$id}`);
// // // // // // // // // // //         if (element) element.remove();
// // // // // // // // // // //     }
// // // // // // // // // // // });

// // // // // // // // // // // document.getElementById('chat-box').addEventListener('scroll', (e) => {
// // // // // // // // // // //     if (e.target.scrollTop === 0) loadMoreMessages();
// // // // // // // // // // // });

// // // // // // // // // // // checkAuth();
// // // // // // // // // // const { Client, Account, Storage, Databases, ID, Query } = Appwrite;

// // // // // // // // // // // --- CONFIGURATION ---
// // // // // // // // // // const client = new Client()
// // // // // // // // // //     .setEndpoint('https://cloud.appwrite.io/v1')
// // // // // // // // // //     .setProject('69bcc12d00306fe9ce4d');

// // // // // // // // // // const account = new Account(client);
// // // // // // // // // // const storage = new Storage(client);
// // // // // // // // // // const databases = new Databases(client);

// // // // // // // // // // const BUCKET_ID = '69bcc2cc0025e83e281d'; 
// // // // // // // // // // const DATABASE_ID = '69bcd743001d1369dedc';
// // // // // // // // // // const COLLECTION_ID = 'photos';
// // // // // // // // // // const STATUS_COLLECTION = 'user_status'; // Naya collection status ke liye

// // // // // // // // // // const FRIEND_EMAIL = "saamne_wale_ki_email@gmail.com"; // Yahan apne partner ki email dal de

// // // // // // // // // // let offset = 0;
// // // // // // // // // // const LIMIT = 10;
// // // // // // // // // // let isLoadingMore = false;
// // // // // // // // // // let allLoaded = false;

// // // // // // // // // // // --- AUTH & STATUS SYSTEM ---
// // // // // // // // // // async function checkAuth() {
// // // // // // // // // //     try {
// // // // // // // // // //         const user = await account.get();
// // // // // // // // // //         document.getElementById('user-status').innerText = `Logged in as: ${user.email}`;
// // // // // // // // // //         document.getElementById('chatting-with').innerText = FRIEND_EMAIL;
// // // // // // // // // //         document.getElementById('login-section').style.display = 'none';
// // // // // // // // // //         document.getElementById('main-content').style.display = 'flex';
// // // // // // // // // //         document.getElementById('logout-btn').style.display = 'block';
        
// // // // // // // // // //         // Presence update shuru karo
// // // // // // // // // //         updateMyStatus(user.email);
// // // // // // // // // //         setInterval(() => updateMyStatus(user.email), 30000); // Har 30 sec mein status update
        
// // // // // // // // // //         // Saamne wale ka status check karo
// // // // // // // // // //         checkFriendStatus();
// // // // // // // // // //         setInterval(checkFriendStatus, 10000); // Har 10 sec mein check

// // // // // // // // // //         loadChat(true); 
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //         document.getElementById('login-section').style.display = 'block';
// // // // // // // // // //         document.getElementById('main-content').style.display = 'none';
// // // // // // // // // //     }
// // // // // // // // // // }

// // // // // // // // // // // Apna status update karo
// // // // // // // // // // async function updateMyStatus(email) {
// // // // // // // // // //     try {
// // // // // // // // // //         const list = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', email)]);
// // // // // // // // // //         if (list.total > 0) {
// // // // // // // // // //             await databases.updateDocument(DATABASE_ID, STATUS_COLLECTION, list.documents[0].$id, { lastSeen: new Date().toISOString() });
// // // // // // // // // //         } else {
// // // // // // // // // //             await databases.createDocument(DATABASE_ID, STATUS_COLLECTION, ID.unique(), { userEmail: email, lastSeen: new Date().toISOString() });
// // // // // // // // // //         }
// // // // // // // // // //     } catch (e) { console.log("Status update failed", e); }
// // // // // // // // // // }

// // // // // // // // // // // Saamne wale ka status check karo
// // // // // // // // // // async function checkFriendStatus() {
// // // // // // // // // //     try {
// // // // // // // // // //         const list = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', FRIEND_EMAIL)]);
// // // // // // // // // //         const statusEl = document.getElementById('online-status');
        
// // // // // // // // // //         if (list.total > 0) {
// // // // // // // // // //             const lastSeen = new Date(list.documents[0].lastSeen);
// // // // // // // // // //             const now = new Date();
// // // // // // // // // //             const diff = (now - lastSeen) / 1000; // seconds mein

// // // // // // // // // //             if (diff < 40) { // Agar 40 sec pehle tak active tha toh Online
// // // // // // // // // //                 statusEl.innerText = "● Online";
// // // // // // // // // //                 statusEl.style.color = "#00a884";
// // // // // // // // // //             } else {
// // // // // // // // // //                 statusEl.innerText = "Last seen: " + lastSeen.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// // // // // // // // // //                 statusEl.style.color = "var(--sub)";
// // // // // // // // // //             }
// // // // // // // // // //         }
// // // // // // // // // //     } catch (e) { console.log("Friend status check failed", e); }
// // // // // // // // // // }

// // // // // // // // // // // --- BAAKI PURANA LOGIC (SAME RAHEGA) ---

// // // // // // // // // // async function handleLogin() {
// // // // // // // // // //     const email = document.getElementById('email').value;
// // // // // // // // // //     const pass = document.getElementById('password').value;
// // // // // // // // // //     try {
// // // // // // // // // //         await account.createEmailPasswordSession(email, pass);
// // // // // // // // // //         location.reload();
// // // // // // // // // //     } catch (err) { alert("Login Error: " + err.message); }
// // // // // // // // // // }

// // // // // // // // // // async function handleLogout() {
// // // // // // // // // //     await account.deleteSession('current');
// // // // // // // // // //     location.reload();
// // // // // // // // // // }

// // // // // // // // // // // --- IMAGE PREVIEW LOGIC ---
// // // // // // // // // // document.getElementById('image-input').addEventListener('change', function(e) {
// // // // // // // // // //     const file = e.target.files[0];
// // // // // // // // // //     const previewContainer = document.getElementById('image-preview-container');
// // // // // // // // // //     const previewImg = document.getElementById('image-preview');
// // // // // // // // // //     const fileNameDisplay = document.getElementById('file-name-display');

// // // // // // // // // //     if (file) {
// // // // // // // // // //         const reader = new FileReader();
// // // // // // // // // //         reader.onload = function(event) {
// // // // // // // // // //             previewImg.src = event.target.result;
// // // // // // // // // //             if(fileNameDisplay) fileNameDisplay.innerText = file.name;
// // // // // // // // // //             previewContainer.style.display = 'block';
// // // // // // // // // //         }
// // // // // // // // // //         reader.readAsDataURL(file);
// // // // // // // // // //     }
// // // // // // // // // // });

// // // // // // // // // // function clearImagePreview() {
// // // // // // // // // //     document.getElementById('image-input').value = '';
// // // // // // // // // //     document.getElementById('image-preview').src = '';
// // // // // // // // // //     const fileNameDisplay = document.getElementById('file-name-display');
// // // // // // // // // //     if(fileNameDisplay) fileNameDisplay.innerText = '';
// // // // // // // // // //     document.getElementById('image-preview-container').style.display = 'none';
// // // // // // // // // // }

// // // // // // // // // // // --- MESSAGING LOGIC ---
// // // // // // // // // // async function handleSendMessage() {
// // // // // // // // // //     const fileInput = document.getElementById('image-input');
// // // // // // // // // //     const msgInput = document.getElementById('message-input');
// // // // // // // // // //     const btn = document.getElementById('send-btn');
// // // // // // // // // //     const file = fileInput.files[0];
// // // // // // // // // //     const message = msgInput.value.trim();

// // // // // // // // // //     if (!file && !message) return;

// // // // // // // // // //     btn.disabled = true;
// // // // // // // // // //     btn.innerText = "...";

// // // // // // // // // //     try {
// // // // // // // // // //         const user = await account.get();
// // // // // // // // // //         let fileUrl = null;

// // // // // // // // // //         if (file) {
// // // // // // // // // //             const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);
// // // // // // // // // //             fileUrl = storage.getFileView(BUCKET_ID, uploadedFile.$id).href;
// // // // // // // // // //         }

// // // // // // // // // //         await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
// // // // // // // // // //             imageUrl: fileUrl,
// // // // // // // // // //             message: message,
// // // // // // // // // //             senderId: user.$id,
// // // // // // // // // //             isSeen: false,
// // // // // // // // // //             createdAt: new Date().toISOString()
// // // // // // // // // //         });

// // // // // // // // // //         msgInput.value = '';
// // // // // // // // // //         clearImagePreview();
// // // // // // // // // //         btn.disabled = false;
// // // // // // // // // //         btn.innerText = "Send 🚀";
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //         alert("Error: " + err.message);
// // // // // // // // // //         btn.disabled = false;
// // // // // // // // // //     }
// // // // // // // // // // }

// // // // // // // // // // // Keyboard Shortcut: Enter to Send
// // // // // // // // // // document.getElementById('message-input').addEventListener('keydown', function(e) {
// // // // // // // // // //     if (e.key === 'Enter' && !e.shiftKey) {
// // // // // // // // // //         e.preventDefault();
// // // // // // // // // //         handleSendMessage();
// // // // // // // // // //     }
// // // // // // // // // // });

// // // // // // // // // // // --- SEEN LOGIC ---
// // // // // // // // // // async function markAsSeen(docId) {
// // // // // // // // // //     try {
// // // // // // // // // //         await databases.updateDocument(DATABASE_ID, COLLECTION_ID, docId, { isSeen: true });
// // // // // // // // // //     } catch (err) { console.log("Seen update error", err); }
// // // // // // // // // // }

// // // // // // // // // // // --- RENDER LOGIC ---
// // // // // // // // // // async function loadChat(isInitial = true) {
// // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // //     try {
// // // // // // // // // //         const user = await account.get();
// // // // // // // // // //         if (isInitial) {
// // // // // // // // // //             offset = 0;
// // // // // // // // // //             allLoaded = false;
// // // // // // // // // //             const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // // // // //                 Query.orderDesc('createdAt'),
// // // // // // // // // //                 Query.limit(LIMIT)
// // // // // // // // // //             ]);
            
// // // // // // // // // //             chatBox.innerHTML = '<div id="load-more-spinner" style="display: none; text-align: center; padding: 10px;"><div class="spinner"></div></div>';
            
// // // // // // // // // //             response.documents.reverse().forEach(doc => {
// // // // // // // // // //                 renderMessage(doc, user, 'bottom');
// // // // // // // // // //                 if (doc.senderId !== user.$id && !doc.isSeen) markAsSeen(doc.$id);
// // // // // // // // // //             });
// // // // // // // // // //             chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // // // // //         }
// // // // // // // // // //     } catch (err) { console.log(err); }
// // // // // // // // // // }

// // // // // // // // // // async function loadMoreMessages() {
// // // // // // // // // //     if (isLoadingMore || allLoaded) return;
// // // // // // // // // //     isLoadingMore = true;
// // // // // // // // // //     const loader = document.getElementById('load-more-spinner');
// // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // //     if(loader) loader.style.display = 'block';
// // // // // // // // // //     const oldScrollHeight = chatBox.scrollHeight;

// // // // // // // // // //     try {
// // // // // // // // // //         const user = await account.get();
// // // // // // // // // //         offset += LIMIT;
// // // // // // // // // //         const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // // // // //             Query.orderDesc('createdAt'), Query.limit(LIMIT), Query.offset(offset)
// // // // // // // // // //         ]);

// // // // // // // // // //         if (response.documents.length === 0) {
// // // // // // // // // //             allLoaded = true;
// // // // // // // // // //             if(loader) loader.innerHTML = "<p style='font-size:10px; color:#8696a0;'>No more history.</p>";
// // // // // // // // // //             return;
// // // // // // // // // //         }

// // // // // // // // // //         response.documents.forEach(doc => renderMessage(doc, user, 'top'));
// // // // // // // // // //         chatBox.scrollTop = chatBox.scrollHeight - oldScrollHeight;
// // // // // // // // // //     } catch (err) { console.log(err); }
// // // // // // // // // //     finally {
// // // // // // // // // //         isLoadingMore = false;
// // // // // // // // // //         if(loader && !allLoaded) loader.style.display = 'none';
// // // // // // // // // //     }
// // // // // // // // // // }

// // // // // // // // // // function renderMessage(doc, user, position = 'bottom') {
// // // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // // //     const isMe = doc.senderId === user.$id;
    
// // // // // // // // // //     const bubble = document.createElement('div');
// // // // // // // // // //     bubble.className = `bubble ${isMe ? 'my-bubble' : 'friend-bubble'}`;
// // // // // // // // // //     bubble.id = `msg-${doc.$id}`; 
    
// // // // // // // // // //     let content = doc.imageUrl ? `<img src="${doc.imageUrl}" loading="lazy" onclick="openViewer('${doc.imageUrl}')">` : "";
// // // // // // // // // //     content += doc.message ? `<p class="chat-text">${doc.message}</p>` : "";
    
// // // // // // // // // //     const time = new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// // // // // // // // // //     const deleteBtn = isMe ? `<span class="delete-icon" onclick="deleteMessage('${doc.$id}', '${doc.imageUrl}')"><i class="fa-solid fa-trash"></i></span>` : "";
    
// // // // // // // // // //     const ticks = isMe ? `<span class="tick-icon ${doc.isSeen ? 'seen' : ''}">${doc.isSeen ? '<i class="fa-solid fa-check-double"></i>' : '<i class="fa-solid fa-check"></i>'}</span>` : "";

// // // // // // // // // //     bubble.innerHTML = `${content}<div class="bubble-footer">${deleteBtn}<div style="display:flex; align-items:center; gap:3px;"><div class="time">${time}</div>${ticks}</div></div>`;
    
// // // // // // // // // //     if (position === 'bottom') {
// // // // // // // // // //         chatBox.appendChild(bubble);
// // // // // // // // // //         chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // // // // //     } else {
// // // // // // // // // //         const loader = document.getElementById('load-more-spinner');
// // // // // // // // // //         if(loader) loader.after(bubble);
// // // // // // // // // //         else chatBox.prepend(bubble);
// // // // // // // // // //     }
// // // // // // // // // // }

// // // // // // // // // // // --- SMOOTH DELETE ---
// // // // // // // // // // async function deleteMessage(docId, fileUrl) {
// // // // // // // // // //     if (!confirm("Delete?")) return;
// // // // // // // // // //     const element = document.getElementById(`msg-${docId}`);
// // // // // // // // // //     try {
// // // // // // // // // //         await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, docId);
// // // // // // // // // //         if (fileUrl) {
// // // // // // // // // //             const fileId = fileUrl.split('/').reverse()[1];
// // // // // // // // // //             await storage.deleteFile(BUCKET_ID, fileId);
// // // // // // // // // //         }
// // // // // // // // // //         if (element) element.remove();
// // // // // // // // // //     } catch (err) { alert(err.message); }
// // // // // // // // // // }

// // // // // // // // // // function openViewer(src) {
// // // // // // // // // //     document.getElementById('full-image').src = src;
// // // // // // // // // //     document.getElementById('image-viewer').classList.add("active");
// // // // // // // // // // }
// // // // // // // // // // function closeViewer() {
// // // // // // // // // //     document.getElementById('image-viewer').classList.remove("active");
// // // // // // // // // // }

// // // // // // // // // // // --- REAL-TIME SUBSCRIPTION ---
// // // // // // // // // // client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`, async (res) => {
// // // // // // // // // //     const user = await account.get();
    
// // // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.create")) {
// // // // // // // // // //         renderMessage(res.payload, user, 'bottom');
// // // // // // // // // //         if (res.payload.senderId !== user.$id) markAsSeen(res.payload.$id);
// // // // // // // // // //     }
    
// // // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.update")) {
// // // // // // // // // //         const doc = res.payload;
// // // // // // // // // //         const tickElement = document.querySelector(`#msg-${doc.$id} .tick-icon`);
// // // // // // // // // //         if (tickElement && doc.isSeen) {
// // // // // // // // // //             tickElement.classList.add('seen');
// // // // // // // // // //             tickElement.innerHTML = '<i class="fa-solid fa-check-double"></i>';
// // // // // // // // // //         }
// // // // // // // // // //     }

// // // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.delete")) {
// // // // // // // // // //         const element = document.getElementById(`msg-${res.payload.$id}`);
// // // // // // // // // //         if (element) element.remove();
// // // // // // // // // //     }
// // // // // // // // // // });

// // // // // // // // // // document.getElementById('chat-box').addEventListener('scroll', (e) => {
// // // // // // // // // //     if (e.target.scrollTop === 0) loadMoreMessages();
// // // // // // // // // // });

// // // // // // // // // // checkAuth();
// // // // // // // // // const { Client, Account, Storage, Databases, ID, Query } = Appwrite;

// // // // // // // // // // --- CONFIGURATION ---
// // // // // // // // // const client = new Client()
// // // // // // // // //     .setEndpoint('https://cloud.appwrite.io/v1')
// // // // // // // // //     .setProject('69bcc12d00306fe9ce4d');

// // // // // // // // // const account = new Account(client);
// // // // // // // // // const storage = new Storage(client);
// // // // // // // // // const databases = new Databases(client);

// // // // // // // // // const BUCKET_ID = '69bcc2cc0025e83e281d'; 
// // // // // // // // // const DATABASE_ID = '69bcd743001d1369dedc';
// // // // // // // // // const COLLECTION_ID = 'photos';
// // // // // // // // // const STATUS_COLLECTION = 'user_status';

// // // // // // // // // // 🔥 DONO USERS KI EMAIL YAHAN DAAL DE
// // // // // // // // // const USERS = ["psrvgamestudio@gmail.com", "adhya.access@gallery.in"]; 
// // // // // // // // // let partnerEmail = ""; 

// // // // // // // // // let offset = 0;
// // // // // // // // // const LIMIT = 10;
// // // // // // // // // let isLoadingMore = false;
// // // // // // // // // let allLoaded = false;

// // // // // // // // // // --- AUTH & DYNAMIC PARTNER SYSTEM ---
// // // // // // // // // async function checkAuth() {
// // // // // // // // //     try {
// // // // // // // // //         const user = await account.get();
// // // // // // // // //         const myEmail = user.email;

// // // // // // // // //         // Partner detect karo: Jo meri email nahi hai, wo partner hai
// // // // // // // // //         partnerEmail = USERS.find(email => email !== myEmail);

// // // // // // // // //         // Header Update
// // // // // // // // //         document.getElementById('user-status').innerText = `My Account: ${myEmail}`;
// // // // // // // // //         document.getElementById('chatting-with').innerText = partnerEmail ? partnerEmail : "Private Space";
        
// // // // // // // // //         document.getElementById('login-section').style.display = 'none';
// // // // // // // // //         document.getElementById('main-content').style.display = 'flex';
// // // // // // // // //         document.getElementById('logout-btn').style.display = 'block';
        
// // // // // // // // //         // Presence update
// // // // // // // // //         updateMyStatus(myEmail);
// // // // // // // // //         setInterval(() => updateMyStatus(myEmail), 30000);
        
// // // // // // // // //         // Partner status check
// // // // // // // // //         if(partnerEmail) {
// // // // // // // // //             checkFriendStatus();
// // // // // // // // //             setInterval(checkFriendStatus, 10000);
// // // // // // // // //         }

// // // // // // // // //         loadChat(true); 
// // // // // // // // //     } catch (err) {
// // // // // // // // //         document.getElementById('login-section').style.display = 'block';
// // // // // // // // //         document.getElementById('main-content').style.display = 'none';
// // // // // // // // //     }
// // // // // // // // // }

// // // // // // // // // // Apna status update karo
// // // // // // // // // async function updateMyStatus(email) {
// // // // // // // // //     try {
// // // // // // // // //         const list = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', email)]);
// // // // // // // // //         if (list.total > 0) {
// // // // // // // // //             await databases.updateDocument(DATABASE_ID, STATUS_COLLECTION, list.documents[0].$id, { lastSeen: new Date().toISOString() });
// // // // // // // // //         } else {
// // // // // // // // //             await databases.createDocument(DATABASE_ID, STATUS_COLLECTION, ID.unique(), { userEmail: email, lastSeen: new Date().toISOString() });
// // // // // // // // //         }
// // // // // // // // //     } catch (e) { console.log("Status update failed", e); }
// // // // // // // // // }

// // // // // // // // // // Partner ka status check karo
// // // // // // // // // async function checkFriendStatus() {
// // // // // // // // //     if(!partnerEmail) return;
// // // // // // // // //     try {
// // // // // // // // //         const list = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', partnerEmail)]);
// // // // // // // // //         const statusEl = document.getElementById('online-status');
        
// // // // // // // // //         if (list.total > 0) {
// // // // // // // // //             const lastSeen = new Date(list.documents[0].lastSeen);
// // // // // // // // //             const now = new Date();
// // // // // // // // //             const diff = (now - lastSeen) / 1000; 

// // // // // // // // //             if (diff < 45) { 
// // // // // // // // //                 statusEl.innerText = "● Online";
// // // // // // // // //                 statusEl.style.color = "#00a884";
// // // // // // // // //             } else {
// // // // // // // // //                 statusEl.innerText = "Last seen: " + lastSeen.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// // // // // // // // //                 statusEl.style.color = "var(--sub)";
// // // // // // // // //             }
// // // // // // // // //         }
// // // // // // // // //     } catch (e) { console.log("Friend status check failed", e); }
// // // // // // // // // }

// // // // // // // // // // --- BAAKI MESSAGING LOGIC (AS IT IS) ---

// // // // // // // // // async function handleLogin() {
// // // // // // // // //     const email = document.getElementById('email').value;
// // // // // // // // //     const pass = document.getElementById('password').value;
// // // // // // // // //     try {
// // // // // // // // //         await account.createEmailPasswordSession(email, pass);
// // // // // // // // //         location.reload();
// // // // // // // // //     } catch (err) { alert("Login Error: " + err.message); }
// // // // // // // // // }

// // // // // // // // // async function handleLogout() {
// // // // // // // // //     await account.deleteSession('current');
// // // // // // // // //     location.reload();
// // // // // // // // // }

// // // // // // // // // document.getElementById('image-input').addEventListener('change', function(e) {
// // // // // // // // //     const file = e.target.files[0];
// // // // // // // // //     const previewContainer = document.getElementById('image-preview-container');
// // // // // // // // //     const previewImg = document.getElementById('image-preview');
// // // // // // // // //     const fileNameDisplay = document.getElementById('file-name-display');
// // // // // // // // //     if (file) {
// // // // // // // // //         const reader = new FileReader();
// // // // // // // // //         reader.onload = function(event) {
// // // // // // // // //             previewImg.src = event.target.result;
// // // // // // // // //             if(fileNameDisplay) fileNameDisplay.innerText = file.name;
// // // // // // // // //             previewContainer.style.display = 'block';
// // // // // // // // //         }
// // // // // // // // //         reader.readAsDataURL(file);
// // // // // // // // //     }
// // // // // // // // // });

// // // // // // // // // function clearImagePreview() {
// // // // // // // // //     document.getElementById('image-input').value = '';
// // // // // // // // //     document.getElementById('image-preview').src = '';
// // // // // // // // //     const fileNameDisplay = document.getElementById('file-name-display');
// // // // // // // // //     if(fileNameDisplay) fileNameDisplay.innerText = '';
// // // // // // // // //     document.getElementById('image-preview-container').style.display = 'none';
// // // // // // // // // }

// // // // // // // // // async function handleSendMessage() {
// // // // // // // // //     const fileInput = document.getElementById('image-input');
// // // // // // // // //     const msgInput = document.getElementById('message-input');
// // // // // // // // //     const btn = document.getElementById('send-btn');
// // // // // // // // //     const file = fileInput.files[0];
// // // // // // // // //     const message = msgInput.value.trim();

// // // // // // // // //     if (!file && !message) return;
// // // // // // // // //     btn.disabled = true;
// // // // // // // // //     btn.innerText = "...";

// // // // // // // // //     try {
// // // // // // // // //         const user = await account.get();
// // // // // // // // //         let fileUrl = null;
// // // // // // // // //         if (file) {
// // // // // // // // //             const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);
// // // // // // // // //             fileUrl = storage.getFileView(BUCKET_ID, uploadedFile.$id).href;
// // // // // // // // //         }
// // // // // // // // //         await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
// // // // // // // // //             imageUrl: fileUrl,
// // // // // // // // //             message: message,
// // // // // // // // //             senderId: user.$id,
// // // // // // // // //             isSeen: false,
// // // // // // // // //             createdAt: new Date().toISOString()
// // // // // // // // //         });
// // // // // // // // //         msgInput.value = '';
// // // // // // // // //         clearImagePreview();
// // // // // // // // //         btn.disabled = false;
// // // // // // // // //         btn.innerText = "Send 🚀";
// // // // // // // // //     } catch (err) { alert(err.message); btn.disabled = false; }
// // // // // // // // // }

// // // // // // // // // document.getElementById('message-input').addEventListener('keydown', function(e) {
// // // // // // // // //     if (e.key === 'Enter' && !e.shiftKey) {
// // // // // // // // //         e.preventDefault();
// // // // // // // // //         handleSendMessage();
// // // // // // // // //     }
// // // // // // // // // });

// // // // // // // // // async function markAsSeen(docId) {
// // // // // // // // //     try {
// // // // // // // // //         await databases.updateDocument(DATABASE_ID, COLLECTION_ID, docId, { isSeen: true });
// // // // // // // // //     } catch (err) { }
// // // // // // // // // }

// // // // // // // // // async function loadChat(isInitial = true) {
// // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // //     try {
// // // // // // // // //         const user = await account.get();
// // // // // // // // //         if (isInitial) {
// // // // // // // // //             offset = 0;
// // // // // // // // //             allLoaded = false;
// // // // // // // // //             const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // // // //                 Query.orderDesc('createdAt'), Query.limit(LIMIT)
// // // // // // // // //             ]);
// // // // // // // // //             chatBox.innerHTML = '<div id="load-more-spinner" style="display: none; text-align: center; padding: 10px;"><div class="spinner"></div></div>';
// // // // // // // // //             response.documents.reverse().forEach(doc => {
// // // // // // // // //                 renderMessage(doc, user, 'bottom');
// // // // // // // // //                 if (doc.senderId !== user.$id && !doc.isSeen) markAsSeen(doc.$id);
// // // // // // // // //             });
// // // // // // // // //             chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // // // //         }
// // // // // // // // //     } catch (err) { }
// // // // // // // // // }

// // // // // // // // // async function loadMoreMessages() {
// // // // // // // // //     if (isLoadingMore || allLoaded) return;
// // // // // // // // //     isLoadingMore = true;
// // // // // // // // //     const loader = document.getElementById('load-more-spinner');
// // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // //     if(loader) loader.style.display = 'block';
// // // // // // // // //     const oldScrollHeight = chatBox.scrollHeight;
// // // // // // // // //     try {
// // // // // // // // //         const user = await account.get();
// // // // // // // // //         offset += LIMIT;
// // // // // // // // //         const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // // // //             Query.orderDesc('createdAt'), Query.limit(LIMIT), Query.offset(offset)
// // // // // // // // //         ]);
// // // // // // // // //         if (response.documents.length === 0) {
// // // // // // // // //             allLoaded = true;
// // // // // // // // //             if(loader) loader.innerHTML = "<p style='font-size:10px; color:#8696a0;'>History Ends.</p>";
// // // // // // // // //         } else {
// // // // // // // // //             response.documents.forEach(doc => renderMessage(doc, user, 'top'));
// // // // // // // // //             chatBox.scrollTop = chatBox.scrollHeight - oldScrollHeight;
// // // // // // // // //         }
// // // // // // // // //     } catch (err) { }
// // // // // // // // //     finally {
// // // // // // // // //         isLoadingMore = false;
// // // // // // // // //         if(loader && !allLoaded) loader.style.display = 'none';
// // // // // // // // //     }
// // // // // // // // // }

// // // // // // // // // function renderMessage(doc, user, position = 'bottom') {
// // // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // // //     const isMe = doc.senderId === user.$id;
// // // // // // // // //     const bubble = document.createElement('div');
// // // // // // // // //     bubble.className = `bubble ${isMe ? 'my-bubble' : 'friend-bubble'}`;
// // // // // // // // //     bubble.id = `msg-${doc.$id}`; 
// // // // // // // // //     let content = doc.imageUrl ? `<img src="${doc.imageUrl}" loading="lazy" onclick="openViewer('${doc.imageUrl}')">` : "";
// // // // // // // // //     content += doc.message ? `<p class="chat-text">${doc.message}</p>` : "";
// // // // // // // // //     const time = new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// // // // // // // // //     const deleteBtn = isMe ? `<span class="delete-icon" onclick="deleteMessage('${doc.$id}', '${doc.imageUrl}')"><i class="fa-solid fa-trash"></i></span>` : "";
// // // // // // // // //     const ticks = isMe ? `<span class="tick-icon ${doc.isSeen ? 'seen' : ''}">${doc.isSeen ? '<i class="fa-solid fa-check-double"></i>' : '<i class="fa-solid fa-check"></i>'}</span>` : "";
// // // // // // // // //     bubble.innerHTML = `${content}<div class="bubble-footer">${deleteBtn}<div style="display:flex; align-items:center; gap:3px;"><div class="time">${time}</div>${ticks}</div></div>`;
// // // // // // // // //     if (position === 'bottom') {
// // // // // // // // //         chatBox.appendChild(bubble);
// // // // // // // // //         chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // // // //     } else {
// // // // // // // // //         const loader = document.getElementById('load-more-spinner');
// // // // // // // // //         if(loader) loader.after(bubble); else chatBox.prepend(bubble);
// // // // // // // // //     }
// // // // // // // // // }

// // // // // // // // // async function deleteMessage(docId, fileUrl) {
// // // // // // // // //     if (!confirm("Delete?")) return;
// // // // // // // // //     const element = document.getElementById(`msg-${docId}`);
// // // // // // // // //     try {
// // // // // // // // //         await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, docId);
// // // // // // // // //         if (fileUrl) {
// // // // // // // // //             const fileId = fileUrl.split('/').reverse()[1];
// // // // // // // // //             await storage.deleteFile(BUCKET_ID, fileId);
// // // // // // // // //         }
// // // // // // // // //         if (element) element.remove();
// // // // // // // // //     } catch (err) { }
// // // // // // // // // }

// // // // // // // // // function openViewer(src) {
// // // // // // // // //     document.getElementById('full-image').src = src;
// // // // // // // // //     document.getElementById('image-viewer').classList.add("active");
// // // // // // // // // }
// // // // // // // // // function closeViewer() {
// // // // // // // // //     document.getElementById('image-viewer').classList.remove("active");
// // // // // // // // // }

// // // // // // // // // client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`, async (res) => {
// // // // // // // // //     const user = await account.get();
// // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.create")) {
// // // // // // // // //         renderMessage(res.payload, user, 'bottom');
// // // // // // // // //         if (res.payload.senderId !== user.$id) markAsSeen(res.payload.$id);
// // // // // // // // //     }
// // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.update")) {
// // // // // // // // //         const doc = res.payload;
// // // // // // // // //         const tickElement = document.querySelector(`#msg-${doc.$id} .tick-icon`);
// // // // // // // // //         if (tickElement && doc.isSeen) {
// // // // // // // // //             tickElement.classList.add('seen');
// // // // // // // // //             tickElement.innerHTML = '<i class="fa-solid fa-check-double"></i>';
// // // // // // // // //         }
// // // // // // // // //     }
// // // // // // // // //     if (res.events.includes("databases.*.collections.*.documents.*.delete")) {
// // // // // // // // //         const element = document.getElementById(`msg-${res.payload.$id}`);
// // // // // // // // //         if (element) element.remove();
// // // // // // // // //     }
// // // // // // // // // });

// // // // // // // // // document.getElementById('chat-box').addEventListener('scroll', (e) => {
// // // // // // // // //     if (e.target.scrollTop === 0) loadMoreMessages();
// // // // // // // // // });

// // // // // // // // // checkAuth();
// // // // // // // // const { Client, Account, Storage, Databases, ID, Query } = Appwrite;

// // // // // // // // // --- CONFIGURATION ---
// // // // // // // // const client = new Client()
// // // // // // // //     .setEndpoint('https://cloud.appwrite.io/v1')
// // // // // // // //     .setProject('69bcc12d00306fe9ce4d');

// // // // // // // // const account = new Account(client);
// // // // // // // // const storage = new Storage(client);
// // // // // // // // const databases = new Databases(client);

// // // // // // // // const BUCKET_ID = '69bcc2cc0025e83e281d'; 
// // // // // // // // const DATABASE_ID = '69bcd743001d1369dedc';
// // // // // // // // const COLLECTION_ID = 'photos';
// // // // // // // // const STATUS_COLLECTION = 'user_status';

// // // // // // // // // 🔥 DONO EMAILS YAHAN DALO
// // // // // // // // const USERS = ["psrvgamestudio@gmail.com", "adhya.access@gallery.in"]; 
// // // // // // // // let partnerEmail = ""; 

// // // // // // // // let offset = 0;
// // // // // // // // const LIMIT = 10;
// // // // // // // // let isLoadingMore = false;
// // // // // // // // let allLoaded = false;

// // // // // // // // // --- AUTH & DYNAMIC PARTNER SYSTEM ---
// // // // // // // // async function checkAuth() {
// // // // // // // //     try {
// // // // // // // //         const user = await account.get();
// // // // // // // //         const myEmail = user.email.toLowerCase();
// // // // // // // //         partnerEmail = USERS.find(email => email.toLowerCase() !== myEmail);

// // // // // // // //         document.getElementById('user-status').innerText = `My Account: ${myEmail}`;
// // // // // // // //         document.getElementById('chatting-with').innerText = partnerEmail || "Private Space";
// // // // // // // //         document.getElementById('login-section').style.display = 'none';
// // // // // // // //         document.getElementById('main-content').style.display = 'flex';
// // // // // // // //         document.getElementById('logout-btn').style.display = 'block';
        
// // // // // // // //         // Presence Logic
// // // // // // // //         updateMyStatus(myEmail, true);
// // // // // // // //         setInterval(() => updateMyStatus(myEmail, true), 30000);
// // // // // // // //         if(partnerEmail) {
// // // // // // // //             checkFriendStatus();
// // // // // // // //             setInterval(checkFriendStatus, 10000);
// // // // // // // //         }

// // // // // // // //         loadChat(true); 
// // // // // // // //     } catch (err) {
// // // // // // // //         document.getElementById('login-section').style.display = 'block';
// // // // // // // //         document.getElementById('main-content').style.display = 'none';
// // // // // // // //     }
// // // // // // // // }

// // // // // // // // // --- STATUS LOGIC ---
// // // // // // // // async function updateMyStatus(email, isOnline) {
// // // // // // // //     try {
// // // // // // // //         const list = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', email)]);
// // // // // // // //         const timestamp = isOnline ? new Date().toISOString() : new Date(Date.now() - 60000).toISOString();

// // // // // // // //         if (list.total > 0) {
// // // // // // // //             await databases.updateDocument(DATABASE_ID, STATUS_COLLECTION, list.documents[0].$id, { lastSeen: timestamp });
// // // // // // // //         } else {
// // // // // // // //             await databases.createDocument(DATABASE_ID, STATUS_COLLECTION, ID.unique(), { userEmail: email, lastSeen: timestamp });
// // // // // // // //         }
// // // // // // // //     } catch (e) { console.log(e); }
// // // // // // // // }

// // // // // // // // document.addEventListener('visibilitychange', () => {
// // // // // // // //     account.get().then(user => {
// // // // // // // //         updateMyStatus(user.email, document.visibilityState === 'visible');
// // // // // // // //     });
// // // // // // // // });

// // // // // // // // async function checkFriendStatus() {
// // // // // // // //     if(!partnerEmail) return;
// // // // // // // //     try {
// // // // // // // //         const list = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', partnerEmail)]);
// // // // // // // //         const statusEl = document.getElementById('online-status');
// // // // // // // //         if (list.total > 0) {
// // // // // // // //             const lastSeen = new Date(list.documents[0].lastSeen);
// // // // // // // //             const diff = (new Date() - lastSeen) / 1000; 
// // // // // // // //             if (diff < 45) { 
// // // // // // // //                 statusEl.innerText = "● Online";
// // // // // // // //                 statusEl.style.color = "#00a884";
// // // // // // // //             } else {
// // // // // // // //                 statusEl.innerText = "last seen " + lastSeen.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// // // // // // // //                 statusEl.style.color = "#8696a0";
// // // // // // // //             }
// // // // // // // //         }
// // // // // // // //     } catch (e) { console.log(e); }
// // // // // // // // }

// // // // // // // // // --- MESSAGING LOGIC ---
// // // // // // // // async function handleSendMessage() {
// // // // // // // //     const fileInput = document.getElementById('image-input');
// // // // // // // //     const msgInput = document.getElementById('message-input');
// // // // // // // //     const btn = document.getElementById('send-btn');
// // // // // // // //     const file = fileInput.files[0];
// // // // // // // //     const message = msgInput.value.trim();

// // // // // // // //     if (!file && !message) return;
// // // // // // // //     btn.disabled = true;

// // // // // // // //     try {
// // // // // // // //         const user = await account.get();
// // // // // // // //         let fileUrl = null;
// // // // // // // //         if (file) {
// // // // // // // //             const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), file);
// // // // // // // //             fileUrl = storage.getFileView(BUCKET_ID, uploadedFile.$id).href;
// // // // // // // //         }
// // // // // // // //         await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
// // // // // // // //             imageUrl: fileUrl, message, senderId: user.$id, isSeen: false, createdAt: new Date().toISOString()
// // // // // // // //         });
// // // // // // // //         msgInput.value = '';
// // // // // // // //         clearImagePreview();
// // // // // // // //         btn.disabled = false;
// // // // // // // //     } catch (err) { alert(err.message); btn.disabled = false; }
// // // // // // // // }

// // // // // // // // // Image Preview & Clear
// // // // // // // // document.getElementById('image-input').addEventListener('change', function(e) {
// // // // // // // //     const file = e.target.files[0];
// // // // // // // //     if (file) {
// // // // // // // //         const reader = new FileReader();
// // // // // // // //         reader.onload = (ev) => {
// // // // // // // //             document.getElementById('image-preview').src = ev.target.result;
// // // // // // // //             document.getElementById('file-name-display').innerText = file.name;
// // // // // // // //             document.getElementById('image-preview-container').style.display = 'block';
// // // // // // // //         };
// // // // // // // //         reader.readAsDataURL(file);
// // // // // // // //     }
// // // // // // // // });

// // // // // // // // function clearImagePreview() {
// // // // // // // //     document.getElementById('image-input').value = '';
// // // // // // // //     document.getElementById('image-preview-container').style.display = 'none';
// // // // // // // // }

// // // // // // // // // --- RENDER & REAL-TIME ---
// // // // // // // // async function loadChat(isInitial = true) {
// // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // //     try {
// // // // // // // //         const user = await account.get();
// // // // // // // //         if (isInitial) {
// // // // // // // //             const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.orderDesc('createdAt'), Query.limit(LIMIT)]);
// // // // // // // //             chatBox.innerHTML = '<div id="load-more-spinner" style="display: none; text-align: center; padding: 10px;"><div class="spinner"></div></div>';
// // // // // // // //             response.documents.reverse().forEach(doc => {
// // // // // // // //                 renderMessage(doc, user, 'bottom');
// // // // // // // //                 if (doc.senderId !== user.$id && !doc.isSeen) databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {isSeen: true});
// // // // // // // //             });
// // // // // // // //             chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // // //         }
// // // // // // // //     } catch (err) { console.log(err); }
// // // // // // // // }

// // // // // // // // function renderMessage(doc, user, position = 'bottom') {
// // // // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // // // //     const isMe = doc.senderId === user.$id;
// // // // // // // //     const bubble = document.createElement('div');
// // // // // // // //     bubble.className = `bubble ${isMe ? 'my-bubble' : 'friend-bubble'}`;
// // // // // // // //     bubble.id = `msg-${doc.$id}`; 

// // // // // // // //     let content = doc.imageUrl ? `<img src="${doc.imageUrl}" onclick="openViewer('${doc.imageUrl}')">` : "";
// // // // // // // //     content += doc.message ? `<p class="chat-text">${doc.message}</p>` : "";
    
// // // // // // // //     const time = new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// // // // // // // //     const ticks = isMe ? `<span class="tick-icon ${doc.isSeen ? 'seen' : ''}">${doc.isSeen ? '<i class="fa-solid fa-check-double"></i>' : '<i class="fa-solid fa-check"></i>'}</span>` : "";
// // // // // // // //     const del = isMe ? `<span class="delete-icon" onclick="deleteMessage('${doc.$id}', '${doc.imageUrl}')"><i class="fa-solid fa-trash"></i></span>` : "";

// // // // // // // //     bubble.innerHTML = `${content}<div class="bubble-footer">${del}<div style="display:flex;align-items:center;gap:3px;"><div class="time">${time}</div>${ticks}</div></div>`;
    
// // // // // // // //     position === 'bottom' ? chatBox.appendChild(bubble) : chatBox.prepend(bubble);
// // // // // // // //     if(position === 'bottom') chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // // // }

// // // // // // // // // Real-time Sub
// // // // // // // // client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`, async (res) => {
// // // // // // // //     const user = await account.get();
// // // // // // // //     if (res.events.includes("databases.*.create")) {
// // // // // // // //         renderMessage(res.payload, user, 'bottom');
// // // // // // // //         if (res.payload.senderId !== user.$id) databases.updateDocument(DATABASE_ID, COLLECTION_ID, res.payload.$id, {isSeen: true});
// // // // // // // //     }
// // // // // // // //     if (res.events.includes("databases.*.update")) {
// // // // // // // //         const tick = document.querySelector(`#msg-${res.payload.$id} .tick-icon`);
// // // // // // // //         if (tick && res.payload.isSeen) { tick.classList.add('seen'); tick.innerHTML = '<i class="fa-solid fa-check-double"></i>'; }
// // // // // // // //     }
// // // // // // // //     if (res.events.includes("databases.*.delete")) {
// // // // // // // //         const el = document.getElementById(`msg-${res.payload.$id}`);
// // // // // // // //         if (el) { el.style.transform = "scale(0)"; setTimeout(() => el.remove(), 300); }
// // // // // // // //     }
// // // // // // // // });

// // // // // // // // // Delete & Auth
// // // // // // // // async function deleteMessage(id, url) {
// // // // // // // //     if (!confirm("Delete?")) return;
// // // // // // // //     try {
// // // // // // // //         await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
// // // // // // // //         if (url) await storage.deleteFile(BUCKET_ID, url.split('/').reverse()[1]);
// // // // // // // //     } catch (e) { alert(e.message); }
// // // // // // // // }

// // // // // // // // async function handleLogin() {
// // // // // // // //     try {
// // // // // // // //         await account.createEmailPasswordSession(document.getElementById('email').value, document.getElementById('password').value);
// // // // // // // //         location.reload();
// // // // // // // //     } catch (err) { alert(err.message); }
// // // // // // // // }
// // // // // // // // async function handleLogout() { await account.deleteSession('current'); location.reload(); }

// // // // // // // // function openViewer(s) { document.getElementById('full-image').src = s; document.getElementById('image-viewer').classList.add("active"); }
// // // // // // // // function closeViewer() { document.getElementById('image-viewer').classList.remove("active"); }

// // // // // // // // document.getElementById('message-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSendMessage(); });
// // // // // // // // checkAuth();
// // // // // // // const { Client, Databases, Storage, ID, Query } = Appwrite;

// // // // // // // const client = new Client()
// // // // // // //     .setEndpoint('https://cloud.appwrite.io/v1')
// // // // // // //     .setProject('69bcc12d00306fe9ce4d');

// // // // // // // const databases = new Databases(client);
// // // // // // // const storage = new Storage(client);

// // // // // // // const DATABASE_ID = '69bcd743001d1369dedc';
// // // // // // // const COLLECTION_ID = 'photos';
// // // // // // // const STATUS_COLLECTION = 'user_status';
// // // // // // // const USERS_COLLECTION = 'users_db'; // Tera naya collection

// // // // // // // const BUCKET_ID = '69bcc2cc0025e83e281d'; 
// // // // // // // const USERS_LIST = ["pratham", "adhya"]; // Inhe DB se match rakhna

// // // // // // // let myUser = null;
// // // // // // // let partnerUsername = "";

// // // // // // // // --- LOGIN CHECK ---
// // // // // // // function checkAuth() {
// // // // // // //     const session = localStorage.getItem('chat_user');
// // // // // // //     if (session) {
// // // // // // //         myUser = JSON.parse(session);
// // // // // // //         partnerUsername = USERS_LIST.find(u => u !== myUser.username);
        
// // // // // // //         document.getElementById('user-status').innerText = `Logged in as: ${myUser.username}`;
// // // // // // //         document.getElementById('chatting-with').innerText = partnerUsername || "Private Space";
// // // // // // //         document.getElementById('login-section').style.display = 'none';
// // // // // // //         document.getElementById('main-content').style.display = 'flex';
// // // // // // //         document.getElementById('logout-btn').style.display = 'block';

// // // // // // //         loadChat(true);
// // // // // // //         updateStatus(true);
// // // // // // //     } else {
// // // // // // //         document.getElementById('login-section').style.display = 'block';
// // // // // // //         document.getElementById('main-content').style.display = 'none';
// // // // // // //     }
// // // // // // // }

// // // // // // // // --- SEND MESSAGE ---
// // // // // // // async function handleSendMessage() {
// // // // // // //     const msgInput = document.getElementById('message-input');
// // // // // // //     const fileInput = document.getElementById('image-input');
// // // // // // //     const message = msgInput.value.trim();
// // // // // // //     const file = fileInput.files[0];

// // // // // // //     if (!message && !file) return;

// // // // // // //     try {
// // // // // // //         let fileUrl = null;
// // // // // // //         if (file) {
// // // // // // //             const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), file);
// // // // // // //             fileUrl = storage.getFileView(BUCKET_ID, uploaded.$id).href;
// // // // // // //         }

// // // // // // //         await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
// // // // // // //             message: message,
// // // // // // //             imageUrl: fileUrl,
// // // // // // //             senderId: myUser.username, // Email ki jagah username bhej rahe hain
// // // // // // //             createdAt: new Date().toISOString(),
// // // // // // //             isSeen: false
// // // // // // //         });

// // // // // // //         msgInput.value = '';
// // // // // // //         fileInput.value = '';
// // // // // // //     } catch (err) {
// // // // // // //         alert("Send Error: " + err.message);
// // // // // // //     }
// // // // // // // }

// // // // // // // // --- LOAD CHAT ---
// // // // // // // async function loadChat(isInitial = true) {
// // // // // // //     try {
// // // // // // //         const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // // // // //             Query.orderDesc('createdAt'),
// // // // // // //             Query.limit(20)
// // // // // // //         ]);
        
// // // // // // //         const chatBox = document.getElementById('chat-box');
// // // // // // //         if(isInitial) chatBox.innerHTML = '';
        
// // // // // // //         response.documents.reverse().forEach(doc => renderMessage(doc));
// // // // // // //         chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // //     } catch (err) {
// // // // // // //         console.error("Load Error:", err);
// // // // // // //     }
// // // // // // // }

// // // // // // // function renderMessage(doc) {
// // // // // // //     const isMe = doc.senderId === myUser.username;
// // // // // // //     const chatBox = document.getElementById('chat-box');
    
// // // // // // //     const div = document.createElement('div');
// // // // // // //     div.className = `bubble ${isMe ? 'my-bubble' : 'friend-bubble'}`;
// // // // // // //     div.innerHTML = `
// // // // // // //         ${doc.imageUrl ? `<img src="${doc.imageUrl}" style="max-width:200px">` : ''}
// // // // // // //         <p>${doc.message}</p>
// // // // // // //         <span style="font-size:10px; opacity:0.6">${new Date(doc.createdAt).toLocaleTimeString()}</span>
// // // // // // //     `;
// // // // // // //     chatBox.appendChild(div);
// // // // // // //     chatBox.scrollTop = chatBox.scrollHeight;
// // // // // // // }

// // // // // // // // Real-time listener
// // // // // // // client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`, res => {
// // // // // // //     if (res.events.includes("databases.*.create")) {
// // // // // // //         renderMessage(res.payload);
// // // // // // //     }
// // // // // // // });

// // // // // // // checkAuth();
// // // // // // const { Client, Databases, Storage, ID, Query } = Appwrite;

// // // // // // // --- CONFIGURATION ---
// // // // // // const client = new Client()
// // // // // //     .setEndpoint('https://cloud.appwrite.io/v1')
// // // // // //     .setProject('69bcc12d00306fe9ce4d');

// // // // // // const databases = new Databases(client);
// // // // // // const storage = new Storage(client);

// // // // // // const DATABASE_ID = '69bcd743001d1369dedc';
// // // // // // const COLLECTION_ID = 'photos';
// // // // // // const STATUS_COLLECTION = 'user_status';
// // // // // // const USERS_COLLECTION = 'users_db';
// // // // // // const BUCKET_ID = '69bcc2cc0025e83e281d';

// // // // // // // Apne Users yahan define karein
// // // // // // const USERS_LIST = ["adhya", "pratham"]; 
// // // // // // let myUser = null;
// // // // // // let partnerUsername = "";

// // // // // // // --- 1. AUTH SYSTEM (CUSTOM) ---
// // // // // // async function handleCustomLogin() {
// // // // // //     const userInp = document.getElementById('username').value.trim();
// // // // // //     const passInp = document.getElementById('password').value.trim();

// // // // // //     if (!userInp || !passInp) return alert("Username aur Password dalo bhai!");

// // // // // //     try {
// // // // // //         const res = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION, [
// // // // // //             Query.equal('username', userInp),
// // // // // //             Query.equal('password', passInp)
// // // // // //         ]);

// // // // // //         if (res.total > 0) {
// // // // // //             const data = res.documents[0];
// // // // // //             myUser = { username: data.username, id: data.$id };
// // // // // //             localStorage.setItem('chat_user', JSON.stringify(myUser));
// // // // // //             location.reload();
// // // // // //         } else {
// // // // // //             alert("Galat Entry! Dubara try karo.");
// // // // // //         }
// // // // // //     } catch (err) { alert("DB Error: " + err.message); }
// // // // // // }

// // // // // // function checkAuth() {
// // // // // //     const session = localStorage.getItem('chat_user');
// // // // // //     if (session) {
// // // // // //         myUser = JSON.parse(session);
// // // // // //         partnerUsername = USERS_LIST.find(u => u !== myUser.username);
        
// // // // // //         document.getElementById('login-section').style.display = 'none';
// // // // // //         document.getElementById('main-content').style.display = 'flex';
// // // // // //         document.getElementById('user-status').innerText = `Me: ${myUser.username}`;
// // // // // //         document.getElementById('chatting-with').innerText = partnerUsername || "Private Space";

// // // // // //         loadChat();
// // // // // //         initPresence();
// // // // // //         startRealtime();
// // // // // //     } else {
// // // // // //         document.getElementById('login-section').style.display = 'block';
// // // // // //         document.getElementById('main-content').style.display = 'none';
// // // // // //     }
// // // // // // }

// // // // // // // --- 2. PRESENCE LOGIC (ONLINE/OFFLINE) ---
// // // // // // async function updateMyStatus(isOnline) {
// // // // // //     if (!myUser) return;
// // // // // //     try {
// // // // // //         const list = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', myUser.username)]);
// // // // // //         const timestamp = isOnline ? new Date().toISOString() : new Date(Date.now() - 60000).toISOString();

// // // // // //         if (list.total > 0) {
// // // // // //             await databases.updateDocument(DATABASE_ID, STATUS_COLLECTION, list.documents[0].$id, { lastSeen: timestamp });
// // // // // //         } else {
// // // // // //             await databases.createDocument(DATABASE_ID, STATUS_COLLECTION, ID.unique(), { userEmail: myUser.username, lastSeen: timestamp });
// // // // // //         }
// // // // // //     } catch (e) { console.log("Status Error", e); }
// // // // // // }

// // // // // // function initPresence() {
// // // // // //     updateMyStatus(true);
// // // // // //     setInterval(() => updateMyStatus(true), 30000);
    
// // // // // //     // Partner Status Check
// // // // // //     setInterval(async () => {
// // // // // //         if (!partnerUsername) return;
// // // // // //         const res = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', partnerUsername)]);
// // // // // //         const statusEl = document.getElementById('online-status');
// // // // // //         if (res.total > 0) {
// // // // // //             const lastSeen = new Date(res.documents[0].lastSeen);
// // // // // //             const diff = (new Date() - lastSeen) / 1000;
// // // // // //             if (diff < 45) {
// // // // // //                 statusEl.innerText = "● Online";
// // // // // //                 statusEl.style.color = "#00a884";
// // // // // //             } else {
// // // // // //                 statusEl.innerText = "last seen " + lastSeen.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
// // // // // //                 statusEl.style.color = "#8696a0";
// // // // // //             }
// // // // // //         }
// // // // // //     }, 10000);
// // // // // // }

// // // // // // document.addEventListener('visibilitychange', () => {
// // // // // //     updateMyStatus(document.visibilityState === 'visible');
// // // // // // });

// // // // // // // --- 3. MESSAGING LOGIC ---
// // // // // // async function handleSendMessage() {
// // // // // //     const msgInput = document.getElementById('message-input');
// // // // // //     const fileInput = document.getElementById('image-input');
// // // // // //     const message = msgInput.value.trim();
// // // // // //     const file = fileInput.files[0];

// // // // // //     if (!message && !file) return;

// // // // // //     // Instant UI Update
// // // // // //     const tempId = 'temp-' + Date.now();
// // // // // //     renderMessage({
// // // // // //         $id: tempId, message, senderId: myUser.username, 
// // // // // //         createdAt: new Date().toISOString(), isSeen: false,
// // // // // //         imageUrl: file ? URL.createObjectURL(file) : null
// // // // // //     });
    
// // // // // //     msgInput.value = '';
// // // // // //     document.getElementById('image-preview-container').style.display = 'none';

// // // // // //     try {
// // // // // //         let fileUrl = null;
// // // // // //         if (file) {
// // // // // //             const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), file);
// // // // // //             fileUrl = storage.getFileView(BUCKET_ID, uploaded.$id).href;
// // // // // //         }

// // // // // //         await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
// // // // // //             message, imageUrl: fileUrl, senderId: myUser.username,
// // // // // //             createdAt: new Date().toISOString(), isSeen: false
// // // // // //         });
// // // // // //     } catch (err) { console.log("Send failed", err); }
// // // // // // }

// // // // // // function renderMessage(doc) {
// // // // // //     if (document.getElementById(`msg-${doc.$id}`)) return; // Duplicate check

// // // // // //     const chatBox = document.getElementById('chat-box');
// // // // // //     const isMe = doc.senderId === myUser.username;
// // // // // //     const bubble = document.createElement('div');
// // // // // //     bubble.className = `bubble ${isMe ? 'my-bubble' : 'friend-bubble'}`;
// // // // // //     bubble.id = `msg-${doc.$id}`;

// // // // // //     let content = doc.imageUrl ? `<img src="${doc.imageUrl}" style="max-width:200px; border-radius:10px;" onclick="openViewer('${doc.imageUrl}')">` : "";
// // // // // //     content += doc.message ? `<p class="chat-text">${doc.message}</p>` : "";
    
// // // // // //     const time = new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// // // // // //     const ticks = isMe ? `<span class="tick-icon ${doc.isSeen ? 'seen' : ''}">${doc.isSeen ? '<i class="fa-solid fa-check-double"></i>' : '<i class="fa-solid fa-check"></i>'}</span>` : "";
// // // // // //     const delBtn = isMe ? `<span class="delete-icon" onclick="deleteMsg('${doc.$id}', '${doc.imageUrl}')"><i class="fa-solid fa-trash"></i></span>` : "";

// // // // // //     bubble.innerHTML = `${content}<div class="bubble-footer">${delBtn}<div style="display:flex;align-items:center;gap:3px;">${time}${ticks}</div></div>`;

// // // // // //     chatBox.appendChild(bubble);
// // // // // //     chatBox.scrollTop = chatBox.scrollHeight;

// // // // // //     // Mark as Seen if received
// // // // // //     if (!isMe && !doc.isSeen && !doc.$id.startsWith('temp')) {
// // // // // //         databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, { isSeen: true });
// // // // // //     }
// // // // // // }

// // // // // // // --- 4. REAL-TIME & HELPERS ---
// // // // // // function startRealtime() {
// // // // // //     client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`, res => {
// // // // // //         const doc = res.payload;
// // // // // //         if (res.events.includes("databases.*.create") && doc.senderId !== myUser.username) {
// // // // // //             renderMessage(doc);
// // // // // //         }
// // // // // //         if (res.events.includes("databases.*.update")) {
// // // // // //             const tick = document.querySelector(`#msg-${doc.$id} .tick-icon`);
// // // // // //             if (tick && doc.isSeen) { tick.classList.add('seen'); tick.innerHTML = '<i class="fa-solid fa-check-double"></i>'; }
// // // // // //         }
// // // // // //         if (res.events.includes("databases.*.delete")) {
// // // // // //             const el = document.getElementById(`msg-${doc.$id}`);
// // // // // //             if (el) { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }
// // // // // //         }
// // // // // //     });
// // // // // // }

// // // // // // async function loadChat() {
// // // // // //     const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.orderDesc('createdAt'), Query.limit(30)]);
// // // // // //     document.getElementById('chat-box').innerHTML = '';
// // // // // //     res.documents.reverse().forEach(renderMessage);
// // // // // // }

// // // // // // async function deleteMsg(id, url) {
// // // // // //     if (!confirm("Delete msg?")) return;
// // // // // //     try {
// // // // // //         await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
// // // // // //         if (url && url.includes('storage')) {
// // // // // //             const fileId = url.split('/').reverse()[1];
// // // // // //             await storage.deleteFile(BUCKET_ID, fileId);
// // // // // //         }
// // // // // //     } catch (e) { console.log(e); }
// // // // // // }

// // // // // // function handleLogout() { localStorage.removeItem('chat_user'); location.reload(); }

// // // // // // // Image Preview logic
// // // // // // document.getElementById('image-input').addEventListener('change', function(e) {
// // // // // //     const file = e.target.files[0];
// // // // // //     if (file) {
// // // // // //         document.getElementById('image-preview').src = URL.createObjectURL(file);
// // // // // //         document.getElementById('image-preview-container').style.display = 'block';
// // // // // //     }
// // // // // // });

// // // // // // function openViewer(s) { document.getElementById('full-image').src = s; document.getElementById('image-viewer').classList.add("active"); }
// // // // // // function closeViewer() { document.getElementById('image-viewer').classList.remove("active"); }

// // // // // // document.getElementById('message-input').addEventListener('keydown', (e) => { if(e.key === 'Enter') handleSendMessage(); });

// // // // // // checkAuth();
// // // // // const { Client, Databases, Storage, ID, Query } = Appwrite;

// // // // // // --- CONFIGURATION ---
// // // // // const client = new Client()
// // // // //     .setEndpoint('https://cloud.appwrite.io/v1')
// // // // //     .setProject('69bcc12d00306fe9ce4d');

// // // // // const databases = new Databases(client);
// // // // // const storage = new Storage(client);

// // // // // const DATABASE_ID = '69bcd743001d1369dedc';
// // // // // const COLLECTION_ID = 'photos';
// // // // // const STATUS_COLLECTION = 'user_status';
// // // // // const USERS_COLLECTION = 'users_db';
// // // // // const BUCKET_ID = '69bcc2cc0025e83e281d';

// // // // // // Apne Users yahan match rakho (Database usernames se)
// // // // // const USERS_LIST = ["adhya", "pratham"]; 
// // // // // let myUser = null;
// // // // // let partnerUsername = "";

// // // // // // --- AUTH LOGIC ---
// // // // // async function handleCustomLogin() {
// // // // //     const userInp = document.getElementById('username').value.trim();
// // // // //     const passInp = document.getElementById('password').value.trim();

// // // // //     if (!userInp || !passInp) return alert("Bhai, Details dalo!");

// // // // //     try {
// // // // //         const res = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION, [
// // // // //             Query.equal('username', userInp),
// // // // //             Query.equal('password', passInp)
// // // // //         ]);

// // // // //         if (res.total > 0) {
// // // // //             const data = res.documents[0];
// // // // //             myUser = { username: data.username, id: data.$id };
// // // // //             localStorage.setItem('chat_user', JSON.stringify(myUser));
// // // // //             location.reload();
// // // // //         } else {
// // // // //             alert("Galat Username/Password!");
// // // // //         }
// // // // //     } catch (err) { alert("Error: " + err.message); }
// // // // // }

// // // // // function checkAuth() {
// // // // //     const session = localStorage.getItem('chat_user');
// // // // //     if (session) {
// // // // //         myUser = JSON.parse(session);
// // // // //         partnerUsername = USERS_LIST.find(u => u !== myUser.username);
        
// // // // //         document.getElementById('login-section').style.display = 'none';
// // // // //         document.getElementById('main-content').style.display = 'flex';
// // // // //         document.getElementById('chat-header').style.display = 'block';
// // // // //         document.getElementById('user-status').innerText = `Your ID: ${myUser.username}`;
// // // // //         document.getElementById('chatting-with').innerText = partnerUsername || "Private Space";

// // // // //         loadChat();
// // // // //         initPresence();
// // // // //         startRealtime();
// // // // //     } else {
// // // // //         document.getElementById('login-section').style.display = 'block';
// // // // //         document.getElementById('main-content').style.display = 'none';
// // // // //         document.getElementById('chat-header').style.display = 'none';
// // // // //     }
// // // // // }

// // // // // function handleLogout() {
// // // // //     localStorage.removeItem('chat_user');
// // // // //     location.reload();
// // // // // }

// // // // // // --- ONLINE STATUS ---
// // // // // async function updateMyStatus(isOnline) {
// // // // //     if (!myUser) return;
// // // // //     try {
// // // // //         const list = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', myUser.username)]);
// // // // //         const timestamp = isOnline ? new Date().toISOString() : new Date(Date.now() - 60000).toISOString();

// // // // //         if (list.total > 0) {
// // // // //             await databases.updateDocument(DATABASE_ID, STATUS_COLLECTION, list.documents[0].$id, { lastSeen: timestamp });
// // // // //         } else {
// // // // //             await databases.createDocument(DATABASE_ID, STATUS_COLLECTION, ID.unique(), { userEmail: myUser.username, lastSeen: timestamp });
// // // // //         }
// // // // //     } catch (e) { console.log(e); }
// // // // // }

// // // // // function initPresence() {
// // // // //     updateMyStatus(true);
// // // // //     setInterval(() => updateMyStatus(true), 30000);
    
// // // // //     // Check Partner Status
// // // // //     setInterval(async () => {
// // // // //         if (!partnerUsername) return;
// // // // //         const res = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', partnerUsername)]);
// // // // //         const statusEl = document.getElementById('online-status');
// // // // //         if (res.total > 0) {
// // // // //             const lastSeen = new Date(res.documents[0].lastSeen);
// // // // //             const diff = (new Date() - lastSeen) / 1000;
// // // // //             if (diff < 45) {
// // // // //                 statusEl.innerText = "● Online";
// // // // //                 statusEl.style.color = "#00a884";
// // // // //             } else {
// // // // //                 statusEl.innerText = "last seen " + lastSeen.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
// // // // //                 statusEl.style.color = "#8696a0";
// // // // //             }
// // // // //         }
// // // // //     }, 10000);
// // // // // }

// // // // // document.addEventListener('visibilitychange', () => {
// // // // //     updateMyStatus(document.visibilityState === 'visible');
// // // // // });

// // // // // // --- MESSAGING ---
// // // // // async function handleSendMessage() {
// // // // //     const msgInput = document.getElementById('message-input');
// // // // //     const fileInput = document.getElementById('image-input');
// // // // //     const message = msgInput.value.trim();
// // // // //     const file = fileInput.files[0];

// // // // //     if (!message && !file) return;

// // // // //     // Instant Update
// // // // //     const tempId = 'temp-' + Date.now();
// // // // //     renderMessage({
// // // // //         $id: tempId, message, senderId: myUser.username, 
// // // // //         createdAt: new Date().toISOString(), isSeen: false,
// // // // //         imageUrl: file ? URL.createObjectURL(file) : null
// // // // //     });
    
// // // // //     msgInput.value = '';
// // // // //     clearImagePreview();

// // // // //     try {
// // // // //         let fileUrl = null;
// // // // //         if (file) {
// // // // //             const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), file);
// // // // //             fileUrl = storage.getFileView(BUCKET_ID, uploaded.$id).href;
// // // // //         }

// // // // //         await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
// // // // //             message, imageUrl: fileUrl, senderId: myUser.username,
// // // // //             createdAt: new Date().toISOString(), isSeen: false
// // // // //         });
// // // // //     } catch (err) { console.log(err); }
// // // // // }

// // // // // function renderMessage(doc) {
// // // // //     if (document.getElementById(`msg-${doc.$id}`)) return;

// // // // //     const chatBox = document.getElementById('chat-box');
// // // // //     const isMe = doc.senderId === myUser.username;
// // // // //     const bubble = document.createElement('div');
// // // // //     bubble.className = `bubble ${isMe ? 'my-bubble' : 'friend-bubble'}`;
// // // // //     bubble.id = `msg-${doc.$id}`;

// // // // //     let content = doc.imageUrl ? `<img src="${doc.imageUrl}" style="max-width:100%; border-radius:10px; margin-bottom:5px;" onclick="openViewer('${doc.imageUrl}')">` : "";
// // // // //     content += doc.message ? `<p class="chat-text" style="margin:0;">${doc.message}</p>` : "";
    
// // // // //     const time = new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// // // // //     const ticks = isMe ? `<span class="tick-icon ${doc.isSeen ? 'seen' : ''}" style="margin-left:5px; font-size:10px; color:${doc.isSeen ? '#53bdeb' : '#8696a0'};">${doc.isSeen ? '<i class="fa-solid fa-check-double"></i>' : '<i class="fa-solid fa-check"></i>'}</span>` : "";
// // // // //     const delBtn = isMe ? `<span class="delete-icon" onclick="deleteMsg('${doc.$id}', '${doc.imageUrl}')" style="margin-right:8px; cursor:pointer; opacity:0.5;"><i class="fa-solid fa-trash"></i></span>` : "";

// // // // //     bubble.innerHTML = `
// // // // //         ${content}
// // // // //         <div class="bubble-footer" style="display:flex; justify-content:flex-end; align-items:center; margin-top:4px;">
// // // // //             ${delBtn}
// // // // //             <div style="font-size:9px; opacity:0.6;">${time}</div>
// // // // //             ${ticks}
// // // // //         </div>
// // // // //     `;

// // // // //     chatBox.appendChild(bubble);
// // // // //     chatBox.scrollTop = chatBox.scrollHeight;

// // // // //     // Mark Seen if receiving
// // // // //     if (!isMe && !doc.isSeen && !doc.$id.startsWith('temp')) {
// // // // //         databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, { isSeen: true });
// // // // //     }
// // // // // }

// // // // // function startRealtime() {
// // // // //     client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`, res => {
// // // // //         const doc = res.payload;
// // // // //         if (res.events.includes("databases.*.create") && doc.senderId !== myUser.username) {
// // // // //             renderMessage(doc);
// // // // //         }
// // // // //         if (res.events.includes("databases.*.update")) {
// // // // //             const tick = document.querySelector(`#msg-${doc.$id} .tick-icon`);
// // // // //             if (tick && doc.isSeen) {
// // // // //                 tick.style.color = '#53bdeb';
// // // // //                 tick.innerHTML = '<i class="fa-solid fa-check-double"></i>';
// // // // //             }
// // // // //         }
// // // // //         if (res.events.includes("databases.*.delete")) {
// // // // //             const el = document.getElementById(`msg-${doc.$id}`);
// // // // //             if (el) el.remove();
// // // // //         }
// // // // //     });
// // // // // }

// // // // // async function loadChat() {
// // // // //     const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.orderDesc('createdAt'), Query.limit(40)]);
// // // // //     const chatBox = document.getElementById('chat-box');
// // // // //     chatBox.innerHTML = '';
// // // // //     res.documents.reverse().forEach(renderMessage);
// // // // //     chatBox.scrollTop = chatBox.scrollHeight;
// // // // // }

// // // // // async function deleteMsg(id, url) {
// // // // //     if (!confirm("Message delete karein?")) return;
// // // // //     try {
// // // // //         await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
// // // // //         if (url && url.includes('storage')) {
// // // // //             const fileId = url.split('/').reverse()[1];
// // // // //             await storage.deleteFile(BUCKET_ID, fileId);
// // // // //         }
// // // // //     } catch (e) { alert("Delete failed"); }
// // // // // }

// // // // // // Helpers
// // // // // document.getElementById('image-input').addEventListener('change', function(e) {
// // // // //     const file = e.target.files[0];
// // // // //     if (file) {
// // // // //         document.getElementById('image-preview').src = URL.createObjectURL(file);
// // // // //         document.getElementById('image-preview-container').style.display = 'block';
// // // // //     }
// // // // // });
// // // // // function clearImagePreview() {
// // // // //     document.getElementById('image-input').value = '';
// // // // //     document.getElementById('image-preview-container').style.display = 'none';
// // // // // }
// // // // // function openViewer(s) { document.getElementById('full-image').src = s; document.getElementById('image-viewer').classList.add("active"); }
// // // // // function closeViewer() { document.getElementById('image-viewer').classList.remove("active"); }
// // // // // document.getElementById('message-input').addEventListener('keydown', (e) => { if(e.key === 'Enter') handleSendMessage(); });

// // // // // checkAuth();
// // // // const { Client, Databases, Storage, ID, Query } = Appwrite;

// // // // // --- CONFIGURATION ---
// // // // const client = new Client()
// // // //     .setEndpoint('https://cloud.appwrite.io/v1')
// // // //     .setProject('69bcc12d00306fe9ce4d');

// // // // const databases = new Databases(client);
// // // // const storage = new Storage(client);

// // // // const DATABASE_ID = '69bcd743001d1369dedc';
// // // // const COLLECTION_ID = 'photos';
// // // // const STATUS_COLLECTION = 'user_status';
// // // // const USERS_COLLECTION = 'users_db';
// // // // const BUCKET_ID = '69bcc2cc0025e83e281d';

// // // // // --- PAGINATION & STATE ---
// // // // const USERS_LIST = ["adhya", "pratham"]; // Inhe DB se match rakhna
// // // // let myUser = null;
// // // // let partnerUsername = "";
// // // // let offset = 0;
// // // // const LIMIT = 20;
// // // // let isLoadingMore = false;
// // // // let allLoaded = false;

// // // // // --- 1. AUTH SYSTEM (CUSTOM) ---
// // // // async function handleCustomLogin() {
// // // //     const userInp = document.getElementById('username').value.trim();
// // // //     const passInp = document.getElementById('password').value.trim();

// // // //     if (!userInp || !passInp) return alert("Details dalo!");

// // // //     try {
// // // //         const res = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION, [
// // // //             Query.equal('username', userInp),
// // // //             Query.equal('password', passInp)
// // // //         ]);

// // // //         if (res.total > 0) {
// // // //             const data = res.documents[0];
// // // //             myUser = { username: data.username, id: data.$id };
// // // //             localStorage.setItem('chat_user', JSON.stringify(myUser));
// // // //             location.reload();
// // // //         } else {
// // // //             alert("Galat Username/Password!");
// // // //         }
// // // //     } catch (err) { alert("Error: " + err.message); }
// // // // }

// // // // function checkAuth() {
// // // //     const session = localStorage.getItem('chat_user');
// // // //     if (session) {
// // // //         myUser = JSON.parse(session);
// // // //         partnerUsername = USERS_LIST.find(u => u !== myUser.username);
        
// // // //         document.getElementById('login-section').style.display = 'none';
// // // //         document.getElementById('main-content').style.display = 'flex';
// // // //         document.getElementById('chat-header').style.display = 'block';
// // // //         document.getElementById('user-status').innerText = `Me: ${myUser.username}`;
// // // //         document.getElementById('chatting-with').innerText = partnerUsername || "Private Space";

// // // //         loadChat(); // Initial Load
// // // //         initPresence();
// // // //         startRealtime();
// // // //     } else {
// // // //         document.getElementById('login-section').style.display = 'block';
// // // //         document.getElementById('main-content').style.display = 'none';
// // // //         document.getElementById('chat-header').style.display = 'none';
// // // //     }
// // // // }

// // // // function handleLogout() {
// // // //     localStorage.removeItem('chat_user');
// // // //     location.reload();
// // // // }

// // // // // --- 2. PAGINATION & LOADING LOGIC ---
// // // // async function loadChat() {
// // // //     offset = 0;
// // // //     allLoaded = false;
// // // //     const chatBox = document.getElementById('chat-box');
// // // //     chatBox.innerHTML = '<div id="load-more-spinner" style="text-align:center; padding:10px; font-size:11px; color:#8696a0; display:none;">Loading history...</div>';

// // // //     try {
// // // //         const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // //             Query.orderDesc('createdAt'),
// // // //             Query.limit(LIMIT),
// // // //             Query.offset(offset)
// // // //         ]);

// // // //         // Reverse isliye taaki naye neeche rahein
// // // //         res.documents.reverse().forEach(doc => renderMessage(doc, 'bottom'));
// // // //         chatBox.scrollTop = chatBox.scrollHeight;
// // // //     } catch (err) { console.log(err); }
// // // // }

// // // // async function loadMoreMessages() {
// // // //     if (isLoadingMore || allLoaded) return;
    
// // // //     isLoadingMore = true;
// // // //     const chatBox = document.getElementById('chat-box');
// // // //     const loader = document.getElementById('load-more-spinner');
// // // //     loader.style.display = 'block';

// // // //     const oldHeight = chatBox.scrollHeight;

// // // //     try {
// // // //         offset += LIMIT;
// // // //         const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // // //             Query.orderDesc('createdAt'),
// // // //             Query.limit(LIMIT),
// // // //             Query.offset(offset)
// // // //         ]);

// // // //         if (res.documents.length < LIMIT) {
// // // //             allLoaded = true;
// // // //             loader.innerText = "Beginning of Chat History";
// // // //         } else {
// // // //             loader.style.display = 'none';
// // // //         }

// // // //         // Purane messages top par render karo
// // // //         res.documents.forEach(doc => renderMessage(doc, 'top'));

// // // //         // Scroll fix: User wahi rahe jahan scroll kar raha tha
// // // //         chatBox.scrollTop = chatBox.scrollHeight - oldHeight;

// // // //     } catch (err) { console.log(err); }
// // // //     finally { isLoadingMore = false; }
// // // // }

// // // // // --- 3. RENDERING ENGINE ---
// // // // function renderMessage(doc, position = 'bottom') {
// // // //     if (document.getElementById(`msg-${doc.$id}`)) return;

// // // //     const chatBox = document.getElementById('chat-box');
// // // //     const isMe = doc.senderId === myUser.username;
// // // //     const bubble = document.createElement('div');
// // // //     bubble.className = `bubble ${isMe ? 'my-bubble' : 'friend-bubble'}`;
// // // //     bubble.id = `msg-${doc.$id}`;

// // // //     let content = doc.imageUrl ? `<img src="${doc.imageUrl}" style="max-width:100%; border-radius:10px; margin-bottom:5px;" onclick="openViewer('${doc.imageUrl}')">` : "";
// // // //     content += doc.message ? `<p class="chat-text" style="margin:0;">${doc.message}</p>` : "";
    
// // // //     const time = new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// // // //     const ticks = isMe ? `<span class="tick-icon ${doc.isSeen ? 'seen' : ''}" style="margin-left:5px; font-size:10px; color:${doc.isSeen ? '#53bdeb' : '#8696a0'};">${doc.isSeen ? '<i class="fa-solid fa-check-double"></i>' : '<i class="fa-solid fa-check"></i>'}</span>` : "";
// // // //     const delBtn = isMe ? `<span class="delete-icon" onclick="deleteMsg('${doc.$id}', '${doc.imageUrl}')" style="margin-right:8px; cursor:pointer; opacity:0.5;"><i class="fa-solid fa-trash"></i></span>` : "";

// // // //     bubble.innerHTML = `
// // // //         ${content}
// // // //         <div class="bubble-footer" style="display:flex; justify-content:flex-end; align-items:center; margin-top:4px;">
// // // //             ${delBtn}
// // // //             <div style="font-size:9px; opacity:0.6;">${time}</div>
// // // //             ${ticks}
// // // //         </div>
// // // //     `;

// // // //     if (position === 'bottom') {
// // // //         chatBox.appendChild(bubble);
// // // //         chatBox.scrollTop = chatBox.scrollHeight;
// // // //     } else {
// // // //         const loader = document.getElementById('load-more-spinner');
// // // //         loader.after(bubble);
// // // //     }

// // // //     // Mark Seen
// // // //     if (!isMe && !doc.isSeen && !doc.$id.startsWith('temp')) {
// // // //         databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, { isSeen: true });
// // // //     }
// // // // }

// // // // // --- 4. MESSAGING & REAL-TIME ---
// // // // async function handleSendMessage() {
// // // //     const msgInput = document.getElementById('message-input');
// // // //     const fileInput = document.getElementById('image-input');
// // // //     const message = msgInput.value.trim();
// // // //     const file = fileInput.files[0];

// // // //     if (!message && !file) return;

// // // //     // Local Instant Update
// // // //     const tempId = 'temp-' + Date.now();
// // // //     renderMessage({
// // // //         $id: tempId, message, senderId: myUser.username, 
// // // //         createdAt: new Date().toISOString(), isSeen: false,
// // // //         imageUrl: file ? URL.createObjectURL(file) : null
// // // //     }, 'bottom');
    
// // // //     msgInput.value = '';
// // // //     clearImagePreview();

// // // //     try {
// // // //         let fileUrl = null;
// // // //         if (file) {
// // // //             const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), file);
// // // //             fileUrl = storage.getFileView(BUCKET_ID, uploaded.$id).href;
// // // //         }

// // // //         await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
// // // //             message, imageUrl: fileUrl, senderId: myUser.username,
// // // //             createdAt: new Date().toISOString(), isSeen: false
// // // //         });
// // // //     } catch (err) { console.log(err); }
// // // // }

// // // // function startRealtime() {
// // // //     client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`, res => {
// // // //         const doc = res.payload;
// // // //         if (res.events.includes("databases.*.create") && doc.senderId !== myUser.username) {
// // // //             renderMessage(doc, 'bottom');
// // // //         }
// // // //         if (res.events.includes("databases.*.update")) {
// // // //             const tick = document.querySelector(`#msg-${doc.$id} .tick-icon`);
// // // //             if (tick && doc.isSeen) {
// // // //                 tick.style.color = '#53bdeb';
// // // //                 tick.innerHTML = '<i class="fa-solid fa-check-double"></i>';
// // // //             }
// // // //         }
// // // //         if (res.events.includes("databases.*.delete")) {
// // // //             const el = document.getElementById(`msg-${doc.$id}`);
// // // //             if (el) el.remove();
// // // //         }
// // // //     });
// // // // }

// // // // // --- 5. PRESENCE & HELPERS ---
// // // // async function updateMyStatus(isOnline) {
// // // //     if (!myUser) return;
// // // //     try {
// // // //         const list = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', myUser.username)]);
// // // //         const timestamp = isOnline ? new Date().toISOString() : new Date(Date.now() - 60000).toISOString();
// // // //         if (list.total > 0) {
// // // //             await databases.updateDocument(DATABASE_ID, STATUS_COLLECTION, list.documents[0].$id, { lastSeen: timestamp });
// // // //         } else {
// // // //             await databases.createDocument(DATABASE_ID, STATUS_COLLECTION, ID.unique(), { userEmail: myUser.username, lastSeen: timestamp });
// // // //         }
// // // //     } catch (e) { }
// // // // }

// // // // function initPresence() {
// // // //     updateMyStatus(true);
// // // //     setInterval(() => updateMyStatus(true), 30000);
// // // //     setInterval(async () => {
// // // //         if (!partnerUsername) return;
// // // //         const res = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', partnerUsername)]);
// // // //         const statusEl = document.getElementById('online-status');
// // // //         if (res.total > 0) {
// // // //             const lastSeen = new Date(res.documents[0].lastSeen);
// // // //             const diff = (new Date() - lastSeen) / 1000;
// // // //             if (diff < 45) {
// // // //                 statusEl.innerText = "● Online";
// // // //                 statusEl.style.color = "#00a884";
// // // //             } else {
// // // //                 statusEl.innerText = "last seen " + lastSeen.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
// // // //                 statusEl.style.color = "#8696a0";
// // // //             }
// // // //         }
// // // //     }, 10000);
// // // // }

// // // // // Scroll Listener for Load More
// // // // document.getElementById('chat-box').addEventListener('scroll', (e) => {
// // // //     if (e.target.scrollTop === 0) loadMoreMessages();
// // // // });

// // // // // Image Utils
// // // // document.getElementById('image-input').addEventListener('change', (e) => {
// // // //     const file = e.target.files[0];
// // // //     if (file) {
// // // //         document.getElementById('image-preview').src = URL.createObjectURL(file);
// // // //         document.getElementById('image-preview-container').style.display = 'block';
// // // //     }
// // // // });
// // // // function clearImagePreview() {
// // // //     document.getElementById('image-input').value = '';
// // // //     document.getElementById('image-preview-container').style.display = 'none';
// // // // }
// // // // async function deleteMsg(id, url) {
// // // //     if (!confirm("Delete?")) return;
// // // //     try {
// // // //         await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
// // // //         if (url && url.includes('storage')) await storage.deleteFile(BUCKET_ID, url.split('/').reverse()[1]);
// // // //     } catch (e) { }
// // // // }
// // // // function openViewer(s) { document.getElementById('full-image').src = s; document.getElementById('image-viewer').classList.add("active"); }
// // // // function closeViewer() { document.getElementById('image-viewer').classList.remove("active"); }
// // // // document.getElementById('message-input').addEventListener('keydown', (e) => { if(e.key === 'Enter') handleSendMessage(); });
// // // // document.addEventListener('visibilitychange', () => updateMyStatus(document.visibilityState === 'visible'));

// // // // checkAuth();
// // // const { Client, Databases, Storage, ID, Query } = Appwrite;

// // // // --- CONFIGURATION ---
// // // const client = new Client()
// // //     .setEndpoint('https://cloud.appwrite.io/v1')
// // //     .setProject('69bcc12d00306fe9ce4d');

// // // const databases = new Databases(client);
// // // const storage = new Storage(client);

// // // const DATABASE_ID = '69bcd743001d1369dedc';
// // // const COLLECTION_ID = 'photos';
// // // const STATUS_COLLECTION = 'user_status';
// // // const USERS_COLLECTION = 'users_db';
// // // const BUCKET_ID = '69bcc2cc0025e83e281d';

// // // // --- PAGINATION & STATE ---
// // // const USERS_LIST = ["adhya", "pratham"]; 
// // // let myUser = null;
// // // let partnerUsername = "";
// // // let offset = 0;
// // // const LIMIT = 20;
// // // let isLoadingMore = false;
// // // let allLoaded = false;

// // // // --- 1. AUTH SYSTEM (CUSTOM) ---
// // // async function handleCustomLogin() {
// // //     const userInp = document.getElementById('username').value.trim();
// // //     const passInp = document.getElementById('password').value.trim();

// // //     if (!userInp || !passInp) return alert("Details dalo!");

// // //     try {
// // //         const res = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION, [
// // //             Query.equal('username', userInp),
// // //             Query.equal('password', passInp)
// // //         ]);

// // //         if (res.total > 0) {
// // //             const data = res.documents[0];
// // //             myUser = { username: data.username, id: data.$id };
// // //             localStorage.setItem('chat_user', JSON.stringify(myUser));
// // //             location.reload();
// // //         } else {
// // //             alert("Galat Username/Password!");
// // //         }
// // //     } catch (err) { alert("Error: " + err.message); }
// // // }

// // // function checkAuth() {
// // //     const session = localStorage.getItem('chat_user');
// // //     if (session) {
// // //         myUser = JSON.parse(session);
// // //         partnerUsername = USERS_LIST.find(u => u !== myUser.username);
        
// // //         document.getElementById('login-section').style.display = 'none';
// // //         document.getElementById('main-content').style.display = 'flex';
// // //         document.getElementById('chat-header').style.display = 'block';
// // //         document.getElementById('user-status').innerText = `Me: ${myUser.username}`;
// // //         document.getElementById('chatting-with').innerText = partnerUsername || "Private Space";

// // //         loadChat(); // Initial Load
// // //         initPresence();
// // //         startRealtime();
// // //     } else {
// // //         document.getElementById('login-section').style.display = 'block';
// // //         document.getElementById('main-content').style.display = 'none';
// // //         document.getElementById('chat-header').style.display = 'none';
// // //     }
// // // }

// // // function handleLogout() {
// // //     localStorage.removeItem('chat_user');
// // //     location.reload();
// // // }

// // // // --- 2. PAGINATION & LOADING LOGIC ---
// // // async function loadChat() {
// // //     offset = 0;
// // //     allLoaded = false;
// // //     const chatBox = document.getElementById('chat-box');
// // //     chatBox.innerHTML = '<div id="load-more-spinner" style="text-align:center; padding:10px; font-size:11px; color:#8696a0; display:none;">Loading history...</div>';

// // //     try {
// // //         const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // //             Query.orderDesc('createdAt'),
// // //             Query.limit(LIMIT),
// // //             Query.offset(offset)
// // //         ]);

// // //         // Reverse isliye taaki naye neeche rahein
// // //         res.documents.reverse().forEach(doc => renderMessage(doc, 'bottom'));
// // //         chatBox.scrollTop = chatBox.scrollHeight;
// // //     } catch (err) { console.log(err); }
// // // }

// // // async function loadMoreMessages() {
// // //     if (isLoadingMore || allLoaded) return;
    
// // //     isLoadingMore = true;
// // //     const chatBox = document.getElementById('chat-box');
// // //     const loader = document.getElementById('load-more-spinner');
// // //     loader.style.display = 'block';

// // //     const oldHeight = chatBox.scrollHeight;

// // //     try {
// // //         offset += LIMIT;
// // //         const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
// // //             Query.orderDesc('createdAt'),
// // //             Query.limit(LIMIT),
// // //             Query.offset(offset)
// // //         ]);

// // //         if (res.documents.length < LIMIT) {
// // //             allLoaded = true;
// // //             loader.innerText = "Beginning of Chat History";
// // //         } else {
// // //             loader.style.display = 'none';
// // //         }

// // //         // Purane messages top par render karo
// // //         res.documents.forEach(doc => renderMessage(doc, 'top'));

// // //         // Scroll fix: User wahi rahe jahan scroll kar raha tha
// // //         chatBox.scrollTop = chatBox.scrollHeight - oldHeight;

// // //     } catch (err) { console.log(err); }
// // //     finally { isLoadingMore = false; }
// // // }

// // // // --- 3. RENDERING ENGINE ---
// // // function renderMessage(doc, position = 'bottom') {
// // //     if (document.getElementById(`msg-${doc.$id}`)) return;

// // //     const chatBox = document.getElementById('chat-box');
// // //     const isMe = doc.senderId === myUser.username;
// // //     const bubble = document.createElement('div');
// // //     bubble.className = `bubble ${isMe ? 'my-bubble' : 'friend-bubble'}`;
// // //     bubble.id = `msg-${doc.$id}`;

// // //     let content = doc.imageUrl ? `<img src="${doc.imageUrl}" style="max-width:100%; border-radius:10px; margin-bottom:5px;" onclick="openViewer('${doc.imageUrl}')">` : "";
// // //     content += doc.message ? `<p class="chat-text" style="margin:0;">${doc.message}</p>` : "";
    
// // //     const time = new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// // //     const ticks = isMe ? `<span class="tick-icon ${doc.isSeen ? 'seen' : ''}" style="margin-left:5px; font-size:10px; color:${doc.isSeen ? '#53bdeb' : '#8696a0'};">${doc.isSeen ? '<i class="fa-solid fa-check-double"></i>' : '<i class="fa-solid fa-check"></i>'}</span>` : "";
// // //     const delBtn = isMe ? `<span class="delete-icon" onclick="deleteMsg('${doc.$id}', '${doc.imageUrl}')" style="margin-right:8px; cursor:pointer; opacity:0.5;"><i class="fa-solid fa-trash"></i></span>` : "";

// // //     bubble.innerHTML = `
// // //         ${content}
// // //         <div class="bubble-footer" style="display:flex; justify-content:flex-end; align-items:center; margin-top:4px;">
// // //             ${delBtn}
// // //             <div style="font-size:9px; opacity:0.6;">${time}</div>
// // //             ${ticks}
// // //         </div>
// // //     `;

// // //     if (position === 'bottom') {
// // //         chatBox.appendChild(bubble);
// // //         chatBox.scrollTop = chatBox.scrollHeight;
// // //     } else {
// // //         const loader = document.getElementById('load-more-spinner');
// // //         loader.after(bubble);
// // //     }

// // //     // Mark Seen
// // //     if (!isMe && !doc.isSeen && !doc.$id.startsWith('temp')) {
// // //         databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, { isSeen: true });
// // //     }
// // // }

// // // // --- 4. MESSAGING & REAL-TIME ---
// // // async function handleSendMessage() {
// // //     const msgInput = document.getElementById('message-input');
// // //     const fileInput = document.getElementById('image-input');
// // //     const message = msgInput.value.trim();
// // //     const file = fileInput.files[0];

// // //     if (!message && !file) return;

// // //     // Local Instant Update
// // //     const tempId = 'temp-' + Date.now();
// // //     renderMessage({
// // //         $id: tempId, message, senderId: myUser.username, 
// // //         createdAt: new Date().toISOString(), isSeen: false,
// // //         imageUrl: file ? URL.createObjectURL(file) : null
// // //     }, 'bottom');
    
// // //     msgInput.value = '';
// // //     clearImagePreview();

// // //     try {
// // //         let fileUrl = null;
// // //         if (file) {
// // //             const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), file);
// // //             fileUrl = storage.getFileView(BUCKET_ID, uploaded.$id).href;
// // //         }

// // //         await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
// // //             message, imageUrl: fileUrl, senderId: myUser.username,
// // //             createdAt: new Date().toISOString(), isSeen: false
// // //         });
// // //     } catch (err) { console.log(err); }
// // // }

// // // function startRealtime() {
// // //     client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`, res => {
// // //         const doc = res.payload;
// // //         if (res.events.includes("databases.*.create") && doc.senderId !== myUser.username) {
// // //             renderMessage(doc, 'bottom');
// // //         }
// // //         if (res.events.includes("databases.*.update")) {
// // //             const tick = document.querySelector(`#msg-${doc.$id} .tick-icon`);
// // //             if (tick && doc.isSeen) {
// // //                 tick.style.color = '#53bdeb';
// // //                 tick.innerHTML = '<i class="fa-solid fa-check-double"></i>';
// // //             }
// // //         }
// // //         if (res.events.includes("databases.*.delete")) {
// // //             const el = document.getElementById(`msg-${doc.$id}`);
// // //             if (el) el.remove();
// // //         }
// // //     });
// // // }

// // // // --- 5. PRESENCE & HELPERS ---
// // // async function updateMyStatus(isOnline) {
// // //     if (!myUser) return;
// // //     try {
// // //         const list = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', myUser.username)]);
// // //         const timestamp = isOnline ? new Date().toISOString() : new Date(Date.now() - 60000).toISOString();
// // //         if (list.total > 0) {
// // //             await databases.updateDocument(DATABASE_ID, STATUS_COLLECTION, list.documents[0].$id, { lastSeen: timestamp });
// // //         } else {
// // //             await databases.createDocument(DATABASE_ID, STATUS_COLLECTION, ID.unique(), { userEmail: myUser.username, lastSeen: timestamp });
// // //         }
// // //     } catch (e) { }
// // // }

// // // function initPresence() {
// // //     updateMyStatus(true);
// // //     setInterval(() => updateMyStatus(true), 30000);
// // //     setInterval(async () => {
// // //         if (!partnerUsername) return;
// // //         const res = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', partnerUsername)]);
// // //         const statusEl = document.getElementById('online-status');
// // //         if (res.total > 0) {
// // //             const lastSeen = new Date(res.documents[0].lastSeen);
// // //             const diff = (new Date() - lastSeen) / 1000;
// // //             if (diff < 45) {
// // //                 statusEl.innerText = "● Online";
// // //                 statusEl.style.color = "#00a884";
// // //             } else {
// // //                 statusEl.innerText = "last seen " + lastSeen.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
// // //                 statusEl.style.color = "#8696a0";
// // //             }
// // //         }
// // //     }, 10000);
// // // }

// // // // Scroll Listener for Load More
// // // document.getElementById('chat-box').addEventListener('scroll', (e) => {
// // //     if (e.target.scrollTop === 0) loadMoreMessages();
// // // });

// // // // Image Utils
// // // document.getElementById('image-input').addEventListener('change', (e) => {
// // //     const file = e.target.files[0];
// // //     if (file) {
// // //         document.getElementById('image-preview').src = URL.createObjectURL(file);
// // //         document.getElementById('image-preview-container').style.display = 'block';
// // //     }
// // // });
// // // function clearImagePreview() {
// // //     document.getElementById('image-input').value = '';
// // //     document.getElementById('image-preview-container').style.display = 'none';
// // // }
// // // async function deleteMsg(id, url) {
// // //     if (!confirm("Delete?")) return;
// // //     try {
// // //         await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
// // //         if (url && url.includes('storage')) await storage.deleteFile(BUCKET_ID, url.split('/').reverse()[1]);
// // //     } catch (e) { }
// // // }
// // // function openViewer(s) { document.getElementById('full-image').src = s; document.getElementById('image-viewer').classList.add("active"); }
// // // function closeViewer() { document.getElementById('image-viewer').classList.remove("active"); }
// // // document.getElementById('message-input').addEventListener('keydown', (e) => { if(e.key === 'Enter') handleSendMessage(); });
// // // document.addEventListener('visibilitychange', () => updateMyStatus(document.visibilityState === 'visible'));

// // // checkAuth();
// // const { Client, Databases, Storage, ID, Query } = Appwrite;

// // // --- CONFIGURATION ---
// // const client = new Client()
// //     .setEndpoint('https://cloud.appwrite.io/v1')
// //     .setProject('69bcc12d00306fe9ce4d');

// // const databases = new Databases(client);
// // const storage = new Storage(client);

// // const DATABASE_ID = '69bcd743001d1369dedc';
// // const COLLECTION_ID = 'photos';
// // const STATUS_COLLECTION = 'user_status';
// // const USERS_COLLECTION = 'users_db';
// // const BUCKET_ID = '69bcc2cc0025e83e281d';

// // const USERS_LIST = ["adhya", "pratham"]; 
// // let myUser = null;
// // let partnerUsername = "";
// // let offset = 0;
// // const LIMIT = 20;

// // // --- 1. AUTH SYSTEM ---
// // async function handleCustomLogin() {
// //     const userInp = document.getElementById('username').value.trim();
// //     const passInp = document.getElementById('password').value.trim();
// //     if (!userInp || !passInp) return alert("Details dalo bhai!");
// //     try {
// //         const res = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION, [
// //             Query.equal('username', userInp), Query.equal('password', passInp)
// //         ]);
// //         if (res.total > 0) {
// //             myUser = { username: res.documents[0].username, id: res.documents[0].$id };
// //             localStorage.setItem('chat_user', JSON.stringify(myUser));
// //             location.reload();
// //         } else { alert("Galat Details!"); }
// //     } catch (err) { alert(err.message); }
// // }

// // function checkAuth() {
// //     const session = localStorage.getItem('chat_user');
// //     if (session) {
// //         myUser = JSON.parse(session);
// //         partnerUsername = USERS_LIST.find(u => u !== myUser.username);
// //         document.getElementById('login-section').style.display = 'none';
// //         document.getElementById('main-content').style.display = 'flex';
// //         document.getElementById('chat-header').style.display = 'block';
// //         document.getElementById('user-status').innerText = `Me: ${myUser.username}`;
// //         document.getElementById('chatting-with').innerText = partnerUsername || "Private Space";
// //         loadChat();
// //         initInstantPresence(); 
// //         startRealtime();
// //     } else {
// //         document.getElementById('login-section').style.display = 'block';
// //         document.getElementById('main-content').style.display = 'none';
// //     }
// // }

// // // --- 2. 🔥 INSTANT PRESENCE LOGIC (4s DELAY) ---
// // async function updateStatus(isOnline) {
// //     if (!myUser) return;
// //     try {
// //         const list = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', myUser.username)]);
// //         // Offline hote hi time ko 1 min peeche bhejenge taaki Partner ko turant 'Last Seen' dikhe
// //         const timestamp = isOnline ? new Date().toISOString() : new Date(Date.now() - 65000).toISOString();

// //         if (list.total > 0) {
// //             await databases.updateDocument(DATABASE_ID, STATUS_COLLECTION, list.documents[0].$id, { lastSeen: timestamp });
// //         } else {
// //             await databases.createDocument(DATABASE_ID, STATUS_COLLECTION, ID.unique(), { userEmail: myUser.username, lastSeen: timestamp });
// //         }
// //     } catch (e) { console.log("Presence Update Fail", e); }
// // }

// // function initInstantPresence() {
// //     updateStatus(true); // Online on load

// //     // Har 20s mein heartbeat (taaki session timeout na ho)
// //     setInterval(() => {
// //         if (document.visibilityState === 'visible') updateStatus(true);
// //     }, 20000);

// //     // Tab switch pe instant action
// //     document.addEventListener('visibilitychange', () => {
// //         updateStatus(document.visibilityState === 'visible');
// //     });

// //     // Page close pe instant offline
// //     window.addEventListener('beforeunload', () => updateStatus(false));

// //     // Partner Status Checker (Set to 4 Seconds as requested)
// //     setInterval(checkPartnerStatus, 4000); 
// // }

// // async function checkPartnerStatus() {
// //     if (!partnerUsername) return;
// //     try {
// //         const res = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', partnerUsername)]);
// //         const statusEl = document.getElementById('online-status');
// //         if (res.total > 0) {
// //             const data = res.documents[0];
// //             const lastSeen = new Date(data.lastSeen);
// //             const diff = (new Date() - lastSeen) / 1000;

// //             if (diff < 40) { // Agar 40s se kam ka gap hai toh Online
// //                 statusEl.innerText = "● Online";
// //                 statusEl.style.color = "#00a884";
// //             } else {
// //                 statusEl.innerText = "last seen " + lastSeen.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
// //                 statusEl.style.color = "#8696a0";
// //             }
// //         }
// //     } catch (e) { console.log("Check Status Error", e); }
// // }

// // // --- 3. REAL-TIME SUBSCRIPTION ---
// // function startRealtime() {
// //     // Message & Status Dono ke liye subscribe
// //     client.subscribe([
// //         `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`,
// //         `databases.${DATABASE_ID}.collections.${STATUS_COLLECTION}.documents`
// //     ], res => {
// //         const doc = res.payload;
        
// //         // New Message
// //         if (res.events.includes("databases.*.create") && doc.senderId !== myUser.username) {
// //             if(doc.message || doc.imageUrl) renderMessage(doc, 'bottom');
// //         }
        
// //         // Seen Update (Blue Ticks)
// //         if (res.events.includes("databases.*.update") && doc.senderId === myUser.username) {
// //             const tick = document.querySelector(`#msg-${doc.$id} .tick-icon`);
// //             if (tick && doc.isSeen) { tick.style.color = '#53bdeb'; tick.innerHTML = '<i class="fa-solid fa-check-double"></i>'; }
// //         }

// //         // Real-time Status Update (If partner updates status)
// //         if (res.events.includes("databases.*.update") && doc.userEmail === partnerUsername) {
// //             checkPartnerStatus(); // Turant refresh karo status
// //         }

// //         // Delete Message
// //         if (res.events.includes("databases.*.delete")) document.getElementById(`msg-${doc.$id}`)?.remove();
// //     });
// // }

// // // --- 4. MESSAGING LOGIC ---
// // async function handleSendMessage() {
// //     const msgInput = document.getElementById('message-input');
// //     const fileInput = document.getElementById('image-input');
// //     const message = msgInput.value.trim();
// //     const file = fileInput.files[0];
// //     if (!message && !file) return;

// //     const tempId = 'temp-' + Date.now();
// //     renderMessage({ $id: tempId, message, senderId: myUser.username, createdAt: new Date().toISOString(), isSeen: false, imageUrl: file ? URL.createObjectURL(file) : null });
// //     msgInput.value = '';
// //     document.getElementById('image-preview-container').style.display = 'none';

// //     try {
// //         let fileUrl = null;
// //         if (file) {
// //             const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), file);
// //             fileUrl = storage.getFileView(BUCKET_ID, uploaded.$id).href;
// //         }
// //         await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), { message, imageUrl: fileUrl, senderId: myUser.username, createdAt: new Date().toISOString(), isSeen: false });
// //     } catch (err) { console.log(err); }
// // }

// // function renderMessage(doc, pos = 'bottom') {
// //     if (document.getElementById(`msg-${doc.$id}`)) return;
// //     const chatBox = document.getElementById('chat-box');
// //     const isMe = doc.senderId === myUser.username;
// //     const div = document.createElement('div');
// //     div.className = `bubble ${isMe ? 'my-bubble' : 'friend-bubble'}`;
// //     div.id = `msg-${doc.$id}`;
    
// //     let img = doc.imageUrl ? `<img src="${doc.imageUrl}" style="max-width:100%; border-radius:10px; margin-bottom:5px;" onclick="openViewer('${doc.imageUrl}')">` : "";
// //     let time = new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
// //     let ticks = isMe ? `<span class="tick-icon ${doc.isSeen ? 'seen' : ''}" style="margin-left:5px; font-size:10px; color:${doc.isSeen ? '#53bdeb' : '#8696a0'};">${doc.isSeen ? '<i class="fa-solid fa-check-double"></i>' : '<i class="fa-solid fa-check"></i>'}</span>` : "";
// //     let del = isMe ? `<span onclick="deleteMsg('${doc.$id}', '${doc.imageUrl}')" style="margin-right:8px; cursor:pointer; opacity:0.3;"><i class="fa-solid fa-trash"></i></span>` : "";

// //     div.innerHTML = `${img}<p style="margin:0;">${doc.message || ""}</p><div style="display:flex; justify-content:flex-end; align-items:center; margin-top:4px; font-size:9px; opacity:0.6;">${del}${time}${ticks}</div>`;
    
// //     pos === 'bottom' ? chatBox.appendChild(div) : document.getElementById('load-more-spinner').after(div);
// //     if(pos === 'bottom') chatBox.scrollTop = chatBox.scrollHeight;

// //     if (!isMe && !doc.isSeen && !doc.$id.startsWith('temp')) databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, { isSeen: true });
// // }

// // async function loadChat() {
// //     const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.orderDesc('createdAt'), Query.limit(LIMIT)]);
// //     document.getElementById('chat-box').innerHTML = '<div id="load-more-spinner" style="display:none; text-align:center; font-size:10px; color:gray; padding:10px;">Loading History...</div>';
// //     res.documents.reverse().forEach(d => renderMessage(d, 'bottom'));
// // }

// // async function deleteMsg(id, url) {
// //     if (confirm("Delete Message?")) {
// //         try {
// //             await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
// //             if (url?.includes('storage')) await storage.deleteFile(BUCKET_ID, url.split('/').reverse()[1]);
// //         } catch(e) { console.log(e); }
// //     }
// // }

// // // --- HELPERS ---
// // document.getElementById('image-input').addEventListener('change', e => {
// //     document.getElementById('image-preview').src = URL.createObjectURL(e.target.files[0]);
// //     document.getElementById('image-preview-container').style.display = 'block';
// // });
// // function handleLogout() { localStorage.removeItem('chat_user'); location.reload(); }
// // function openViewer(s) { document.getElementById('full-image').src = s; document.getElementById('image-viewer').classList.add("active"); }
// // function closeViewer() { document.getElementById('image-viewer').classList.remove("active"); }
// // document.getElementById('message-input').addEventListener('keydown', e => { if(e.key === 'Enter') handleSendMessage(); });

// // checkAuth();
// const { Client, Databases, Storage, ID, Query } = Appwrite;

// // --- CONFIGURATION ---
// const client = new Client()
//     .setEndpoint('https://cloud.appwrite.io/v1')
//     .setProject('69bcc12d00306fe9ce4d');

// const databases = new Databases(client);
// const storage = new Storage(client);

// const DATABASE_ID = '69bcd743001d1369dedc';
// const COLLECTION_ID = 'photos';
// const STATUS_COLLECTION = 'user_status';
// const USERS_COLLECTION = 'users_db';
// const BUCKET_ID = '69bcc2cc0025e83e281d';

// const USERS_LIST = ["adhya", "pratham"]; 
// let myUser = null;
// let partnerUsername = "";
// let typingTimeout;

// // --- AUTH SYSTEM ---
// async function handleCustomLogin() {
//     const userInp = document.getElementById('username').value.trim();
//     const passInp = document.getElementById('password').value.trim();
//     try {
//         const res = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION, [
//             Query.equal('username', userInp), Query.equal('password', passInp)
//         ]);
//         if (res.total > 0) {
//             myUser = { username: res.documents[0].username, id: res.documents[0].$id };
//             localStorage.setItem('chat_user', JSON.stringify(myUser));
//             location.reload();
//         } else { alert("Galat Details!"); }
//     } catch (err) { alert(err.message); }
// }

// function checkAuth() {
//     const session = localStorage.getItem('chat_user');
//     if (session) {
//         myUser = JSON.parse(session);
//         partnerUsername = USERS_LIST.find(u => u !== myUser.username);
//         document.getElementById('login-section').style.display = 'none';
//         document.getElementById('main-content').style.display = 'flex';
//         document.getElementById('chat-header').style.display = 'block';
//         document.getElementById('user-status').innerText = `Me: ${myUser.username}`;
//         document.getElementById('chatting-with').innerText = partnerUsername || "Private Space";
//         loadChat();
//         initPresence();
//         startRealtime();
//     } else {
//         document.getElementById('login-section').style.display = 'block';
//         document.getElementById('main-content').style.display = 'none';
//     }
// }

// // --- PRESENCE & TYPING LOGIC ---
// async function updateStatus(isOnline, isTyping = false) {
//     if (!myUser) return;
//     try {
//         const list = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', myUser.username)]);
//         const timestamp = isOnline ? new Date().toISOString() : new Date(Date.now() - 65000).toISOString();

//         if (list.total > 0) {
//             await databases.updateDocument(DATABASE_ID, STATUS_COLLECTION, list.documents[0].$id, { 
//                 lastSeen: timestamp,
//                 isTyping: isTyping 
//             });
//         } else {
//             await databases.createDocument(DATABASE_ID, STATUS_COLLECTION, ID.unique(), { 
//                 userEmail: myUser.username, 
//                 lastSeen: timestamp,
//                 isTyping: isTyping 
//             });
//         }
//     } catch (e) { console.log(e); }
// }

// function initPresence() {
//     updateStatus(true);
//     setInterval(() => { if (document.visibilityState === 'visible') updateStatus(true); }, 25000);
//     document.addEventListener('visibilitychange', () => updateStatus(document.visibilityState === 'visible'));
//     window.addEventListener('beforeunload', () => updateStatus(false));
//     setInterval(checkPartnerStatus, 4000);
// }

// async function checkPartnerStatus() {
//     if (!partnerUsername) return;
//     try {
//         const res = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', partnerUsername)]);
//         const statusEl = document.getElementById('online-status');
//         const typingEl = document.getElementById('typing-indicator');

//         if (res.total > 0) {
//             const data = res.documents[0];
//             const lastSeen = new Date(data.lastSeen);
//             const diff = (new Date() - lastSeen) / 1000;

//             if (diff < 40) {
//                 statusEl.innerText = "● Online";
//                 statusEl.style.color = "#00a884";
//                 typingEl.style.display = data.isTyping ? "block" : "none";
//             } else {
//                 statusEl.innerText = "last seen " + lastSeen.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
//                 statusEl.style.color = "#8696a0";
//                 typingEl.style.display = "none";
//             }
//         }
//     } catch (e) {}
// }

// // Typing Detection Logic
// document.getElementById('message-input').addEventListener('input', () => {
//     updateStatus(true, true); // Send typing: true
//     clearTimeout(typingTimeout);
//     typingTimeout = setTimeout(() => {
//         updateStatus(true, false); // Send typing: false after 2s of silence
//     }, 2000);
// });

// // --- MESSAGING & REAL-TIME ---
// function startRealtime() {
//     client.subscribe([
//         `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`,
//         `databases.${DATABASE_ID}.collections.${STATUS_COLLECTION}.documents`
//     ], res => {
//         const doc = res.payload;
//         if (res.events.includes("databases.*.create") && doc.senderId !== myUser.username) renderMessage(doc, 'bottom');
//         if (res.events.includes("databases.*.update")) {
//             if (doc.userEmail === partnerUsername) checkPartnerStatus(); // Instant Typing/Online Update
//             const tick = document.querySelector(`#msg-${doc.$id} .tick-icon`);
//             if (tick && doc.isSeen) { tick.style.color = '#53bdeb'; tick.innerHTML = '✔✔'; }
//         }
//         if (res.events.includes("databases.*.delete")) document.getElementById(`msg-${doc.$id}`)?.remove();
//     });
// }

// async function handleSendMessage() {
//     const msgInput = document.getElementById('message-input');
//     const fileInput = document.getElementById('image-input');
//     const message = msgInput.value.trim();
//     const file = fileInput.files[0];
//     if (!message && !file) return;

//     renderMessage({ $id: 'temp-'+Date.now(), message, senderId: myUser.username, createdAt: new Date().toISOString(), isSeen: false, imageUrl: file ? URL.createObjectURL(file) : null });
//     msgInput.value = '';
//     updateStatus(true, false); // Typing stop on send
//     document.getElementById('image-preview-container').style.display = 'none';

//     try {
//         let fileUrl = null;
//         if (file) {
//             const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), file);
//             fileUrl = storage.getFileView(BUCKET_ID, uploaded.$id).href;
//         }
//         await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), { message, imageUrl: fileUrl, senderId: myUser.username, createdAt: new Date().toISOString(), isSeen: false });
//     } catch (err) { console.log(err); }
// }

// function renderMessage(doc, pos = 'bottom') {
//     if (document.getElementById(`msg-${doc.$id}`)) return;
//     const chatBox = document.getElementById('chat-box');
//     const isMe = doc.senderId === myUser.username;
//     const div = document.createElement('div');
//     div.className = `bubble ${isMe ? 'my-bubble' : 'friend-bubble'}`;
//     div.id = `msg-${doc.$id}`;
    
//     let img = doc.imageUrl ? `<img src="${doc.imageUrl}" style="max-width:100%; border-radius:10px; margin-bottom:5px;" onclick="openViewer('${doc.imageUrl}')">` : "";
//     let time = new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
//     let ticks = isMe ? `<span class="tick-icon ${doc.isSeen ? 'seen' : ''}" style="margin-left:5px; font-size:10px;">${doc.isSeen ? '✔✔' : '✔'}</span>` : "";

//     div.innerHTML = `${img}<p style="margin:0;">${doc.message || ""}</p><div style="display:flex; justify-content:flex-end; align-items:center; margin-top:4px; font-size:9px; opacity:0.6;">${time}${ticks}</div>`;
//     chatBox.appendChild(div);
//     chatBox.scrollTop = chatBox.scrollHeight;

//     if (!isMe && !doc.isSeen && !doc.$id.startsWith('temp')) databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, { isSeen: true });
// }

// async function loadChat() {
//     const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.orderDesc('createdAt'), Query.limit(20)]);
//     document.getElementById('chat-box').innerHTML = '';
//     res.documents.reverse().forEach(d => renderMessage(d, 'bottom'));
// }

// function handleLogout() { localStorage.removeItem('chat_user'); location.reload(); }
// function openViewer(s) { document.getElementById('full-image').src = s; document.getElementById('image-viewer').classList.add("active"); }
// function closeViewer() { document.getElementById('image-viewer').classList.remove("active"); }
// document.getElementById('message-input').addEventListener('keydown', e => { if(e.key === 'Enter') handleSendMessage(); });

// checkAuth();
const { Client, Databases, Storage, ID, Query } = Appwrite;

// --- 1. CONFIGURATION ---
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('69bcc12d00306fe9ce4d');

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = '69bcd743001d1369dedc';
const COLLECTION_ID = 'photos';
const STATUS_COLLECTION = 'user_status';
const USERS_COLLECTION = 'users_db';
const BUCKET_ID = '69bcc2cc0025e83e281d';

// Apne Predefined Users yahan dalo
const USERS_LIST = ["adhya", "pratham"]; 
let myUser = null;
let partnerUsername = "";
let offset = 0;
const LIMIT = 20;
let isLoadingMore = false;
let allLoaded = false;
let typingTimeout;

// --- 2. AUTH SYSTEM (CUSTOM DB LOGIN) ---
async function handleCustomLogin() {
    const userInp = document.getElementById('username').value.trim();
    const passInp = document.getElementById('password').value.trim();

    if (!userInp || !passInp) return alert("Bhai details toh dalo!");

    try {
        const res = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION, [
            Query.equal('username', userInp),
            Query.equal('password', passInp)
        ]);

        if (res.total > 0) {
            const data = res.documents[0];
            myUser = { username: data.username, id: data.$id };
            localStorage.setItem('chat_user', JSON.stringify(myUser));
            location.reload();
        } else {
            alert("Galat Entry! Username ya Password galat hai.");
        }
    } catch (err) { alert("Login Error: " + err.message); }
}

function checkAuth() {
    const session = localStorage.getItem('chat_user');
    if (session) {
        myUser = JSON.parse(session);
        partnerUsername = USERS_LIST.find(u => u !== myUser.username);
        
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('main-content').style.display = 'flex';
        document.getElementById('chat-header').style.display = 'block';
        document.getElementById('user-status').innerText = `ID: ${myUser.username}`;
        document.getElementById('chatting-with').innerText = partnerUsername || "Private Space";

        loadChat();
        initInstantPresence();
        startRealtime();
    } else {
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('main-content').style.display = 'none';
        document.getElementById('chat-header').style.display = 'none';
    }
}

function handleLogout() {
    updateStatus(false); // Offline karke logout
    localStorage.removeItem('chat_user');
    location.reload();
}

// --- 3. INSTANT PRESENCE & TYPING LOGIC ---
async function updateStatus(isOnline, isTyping = false) {
    if (!myUser) return;
    try {
        const list = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', myUser.username)]);
        // Offline hote hi time ko 65s peeche bhejte hain taaki partner ko turant offline dikhe
        const timestamp = isOnline ? new Date().toISOString() : new Date(Date.now() - 65000).toISOString();

        if (list.total > 0) {
            await databases.updateDocument(DATABASE_ID, STATUS_COLLECTION, list.documents[0].$id, { 
                lastSeen: timestamp,
                isTyping: isTyping 
            });
        } else {
            await databases.createDocument(DATABASE_ID, STATUS_COLLECTION, ID.unique(), { 
                userEmail: myUser.username, 
                lastSeen: timestamp,
                isTyping: isTyping 
            });
        }
    } catch (e) { console.log("Status Error", e); }
}

function initInstantPresence() {
    updateStatus(true); // Online on load
    setInterval(() => { if (document.visibilityState === 'visible') updateStatus(true); }, 20000);
    
    document.addEventListener('visibilitychange', () => updateStatus(document.visibilityState === 'visible'));
    window.addEventListener('beforeunload', () => updateStatus(false));
    
    setInterval(checkPartnerStatus, 4000); // 4 Second delay for partner status
}

async function checkPartnerStatus() {
    if (!partnerUsername) return;
    try {
        const res = await databases.listDocuments(DATABASE_ID, STATUS_COLLECTION, [Query.equal('userEmail', partnerUsername)]);
        const statusEl = document.getElementById('online-status');
        const typingEl = document.getElementById('typing-indicator');

        if (res.total > 0) {
            const data = res.documents[0];
            const lastSeen = new Date(data.lastSeen);
            const diff = (new Date() - lastSeen) / 1000;

            if (diff < 40) {
                statusEl.innerText = "● Online";
                statusEl.style.color = "#00a884";
                if(typingEl) typingEl.style.display = data.isTyping ? "block" : "none";
            } else {
                statusEl.innerText = "last seen " + lastSeen.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
                statusEl.style.color = "#8696a0";
                if(typingEl) typingEl.style.display = "none";
            }
        }
    } catch (e) {}
}

// Typing Event Listener
document.getElementById('message-input').addEventListener('input', () => {
    updateStatus(true, true);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => updateStatus(true, false), 2000);
});

// --- 4. MESSAGING & PAGINATION ---
// async function loadChat() {
//     offset = 0;
//     allLoaded = false;
//     const chatBox = document.getElementById('chat-box');
//     chatBox.innerHTML = '<div id="load-more-spinner" style="text-align:center; padding:10px; font-size:10px; color:gray; display:none;">Loading old messages...</div>';

//     try {
//         const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
//             Query.orderDesc('createdAt'),
//             Query.limit(LIMIT),
//             Query.offset(offset)
//         ]);
//         res.documents.reverse().forEach(doc => renderMessage(doc, 'bottom'));
//         chatBox.scrollTop = chatBox.scrollHeight;
//     } catch (err) { console.log(err); }
// }

// async function loadMoreMessages() {
//     if (isLoadingMore || allLoaded) return;
//     isLoadingMore = true;
//     const chatBox = document.getElementById('chat-box');
//     const loader = document.getElementById('load-more-spinner');
//     loader.style.display = 'block';
//     const oldHeight = chatBox.scrollHeight;

//     try {
//         offset += LIMIT;
//         const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
//             Query.orderDesc('createdAt'),
//             Query.limit(LIMIT),
//             Query.offset(offset)
//         ]);

//         if (res.documents.length < LIMIT) {
//             allLoaded = true;
//             loader.innerText = "Chat Start";
//         } else { loader.style.display = 'none'; }

//         res.documents.forEach(doc => renderMessage(doc, 'top'));
//         chatBox.scrollTop = chatBox.scrollHeight - oldHeight;
//     } catch (err) { console.log(err); }
//     finally { isLoadingMore = false; }
// }
async function loadChat() {
    offset = 0;
    allLoaded = false;
    const chatBox = document.getElementById('chat-box');
    
    // Yahan text ki jagah spinner ka div daal diya
    chatBox.innerHTML = `
        <div id="load-more-spinner" style="display:none;">
            <span class="loader"></span>
        </div>`;

    try {
        const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.orderDesc('createdAt'),
            Query.limit(LIMIT),
            Query.offset(offset)
        ]);
        res.documents.reverse().forEach(doc => renderMessage(doc, 'bottom'));
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (err) { console.log(err); }
}

async function loadMoreMessages() {
    if (isLoadingMore || allLoaded) return;
    isLoadingMore = true;
    
    const chatBox = document.getElementById('chat-box');
    const loader = document.getElementById('load-more-spinner');
    loader.style.display = 'flex'; // Spinner dikhao

    const oldHeight = chatBox.scrollHeight;

    try {
        offset += LIMIT;
        const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.orderDesc('createdAt'),
            Query.limit(LIMIT),
            Query.offset(offset)
        ]);

        if (res.documents.length < LIMIT) {
            allLoaded = true;
            loader.innerHTML = "<span style='font-size:10px; color:gray;'>Beginning of chat</span>";
        } else {
            loader.style.display = 'none'; // Load hone ke baad chhupa do
        }

        res.documents.forEach(doc => renderMessage(doc, 'top'));
        chatBox.scrollTop = chatBox.scrollHeight - oldHeight;
    } catch (err) { 
        console.log(err);
        loader.style.display = 'none';
    } finally { 
        isLoadingMore = false; 
    }
}
async function handleSendMessage() {
    const msgInput = document.getElementById('message-input');
    const fileInput = document.getElementById('image-input');
    const message = msgInput.value.trim();
    const file = fileInput.files[0];
    if (!message && !file) return;

    // Instant UI Update
    const tempId = 'temp-' + Date.now();
    renderMessage({ $id: tempId, message, senderId: myUser.username, createdAt: new Date().toISOString(), isSeen: false, imageUrl: file ? URL.createObjectURL(file) : null }, 'bottom');
    
    msgInput.value = '';
    updateStatus(true, false); // Typing stop
    clearImagePreview();

    try {
        let fileUrl = null;
        if (file) {
            const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), file);
            fileUrl = storage.getFileView(BUCKET_ID, uploaded.$id).href;
        }
        await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), { 
            message, imageUrl: fileUrl, senderId: myUser.username, 
            createdAt: new Date().toISOString(), isSeen: false 
        });
    } catch (err) { console.log(err); }
}

function renderMessage(doc, pos = 'bottom') {
    if (document.getElementById(`msg-${doc.$id}`)) return;
    const chatBox = document.getElementById('chat-box');
    const isMe = doc.senderId === myUser.username;
    const div = document.createElement('div');
    div.className = `bubble ${isMe ? 'my-bubble' : 'friend-bubble'}`;
    div.id = `msg-${doc.$id}`;
    
    let img = doc.imageUrl ? `<img src="${doc.imageUrl}" style="max-width:100%; border-radius:10px; margin-bottom:5px;" onclick="openViewer('${doc.imageUrl}')">` : "";
    let time = new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    let ticks = isMe ? `<span class="tick-icon ${doc.isSeen ? 'seen' : ''}" style="margin-left:5px; font-size:10px; color:${doc.isSeen ? '#53bdeb' : '#8696a0'};">${doc.isSeen ? '✔✔' : '✔'}</span>` : "";
    let del = isMe ? `<span onclick="deleteMsg('${doc.$id}', '${doc.imageUrl}')" style="margin-right:8px; cursor:pointer; opacity:0.3;"><i class="fa-solid fa-trash"></i></span>` : "";

    div.innerHTML = `${img}<p style="margin:0;">${doc.message || ""}</p><div style="display:flex; justify-content:flex-end; align-items:center; margin-top:4px; font-size:9px; opacity:0.6;">${del}${time}${ticks}</div>`;
    
    pos === 'bottom' ? chatBox.appendChild(div) : document.getElementById('load-more-spinner').after(div);
    if(pos === 'bottom') chatBox.scrollTop = chatBox.scrollHeight;

    if (!isMe && !doc.isSeen && !doc.$id.startsWith('temp')) databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, { isSeen: true });
}

// --- 5. REAL-TIME SUBSCRIPTION ---
function startRealtime() {
    client.subscribe([
        `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`,
        `databases.${DATABASE_ID}.collections.${STATUS_COLLECTION}.documents`
    ], res => {
        const doc = res.payload;
        if (res.events.includes("databases.*.create") && doc.senderId !== myUser.username) {
            renderMessage(doc, 'bottom');
        }
        if (res.events.includes("databases.*.update")) {
            if (doc.userEmail === partnerUsername) checkPartnerStatus(); 
            const tick = document.querySelector(`#msg-${doc.$id} .tick-icon`);
            if (tick && doc.isSeen) { tick.style.color = '#53bdeb'; tick.innerHTML = '✔✔'; }
        }
        if (res.events.includes("databases.*.delete")) document.getElementById(`msg-${doc.$id}`)?.remove();
    });
}

// --- HELPERS & UI ---
document.getElementById('chat-box').addEventListener('scroll', (e) => {
    if (e.target.scrollTop === 0) loadMoreMessages();
});

document.getElementById('image-input').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
        document.getElementById('image-preview').src = URL.createObjectURL(file);
        document.getElementById('image-preview-container').style.display = 'block';
    }
});

function clearImagePreview() {
    document.getElementById('image-input').value = '';
    document.getElementById('image-preview-container').style.display = 'none';
}

async function deleteMsg(id, url) {
    if (!confirm("Delete this message?")) return;
    try {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
        if (url?.includes('storage')) await storage.deleteFile(BUCKET_ID, url.split('/').reverse()[1]);
    } catch (e) { console.log(e); }
}

function openViewer(s) { document.getElementById('full-image').src = s; document.getElementById('image-viewer').classList.add("active"); }
function closeViewer() { document.getElementById('image-viewer').classList.remove("active"); }
document.getElementById('message-input').addEventListener('keydown', e => { if(e.key === 'Enter') handleSendMessage(); });

checkAuth();