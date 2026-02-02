// Admin Panel JS for Real-Time Chat, Inquiries, Appointments
let socket = io();
let currentChatUserId = null;
let adminActiveChats = {};

// Sidebar navigation
const sidebarLinks = document.querySelectorAll('.sidebar ul li');
const views = document.querySelectorAll('.view');
sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    sidebarLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    views.forEach(v => v.classList.remove('active'));
    document.getElementById(link.dataset.view).classList.add('active');
  });
});

// --- Live Chats ---
const chatList = document.getElementById('chatList');
const chatWindow = document.getElementById('chatWindow');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

// Fetch active chats from server
function fetchActiveChats() {
  fetch('/api/chats/active')
    .then(res => res.json())
    .then(data => {
      chatList.innerHTML = '';
      data.chats.forEach(chat => {
        let li = document.createElement('li');
        li.textContent = chat.username || chat.userId;
        li.onclick = () => openChat(chat.userId);
        if (chat.userId === currentChatUserId) li.classList.add('active');
        chatList.appendChild(li);
      });
    });
}

function openChat(userId) {
  currentChatUserId = userId;
  chatWindow.style.display = 'flex';
  fetch(`/api/chats/${userId}`)
    .then(res => res.json())
    .then(data => {
      chatMessages.innerHTML = '';
      data.messages.forEach(msg => {
        let div = document.createElement('div');
        div.textContent = `${msg.sender === 'admin' ? 'You' : 'Visitor'}: ${msg.text}`;
        chatMessages.appendChild(div);
      });
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  // Notify server: admin is active on this chat
  socket.emit('admin_active', { userId });
  adminActiveChats[userId] = true;
}

chatForm.onsubmit = function(e) {
  e.preventDefault();
  if (!chatInput.value.trim() || !currentChatUserId) return;
  socket.emit('admin_message', { userId: currentChatUserId, text: chatInput.value });
  let div = document.createElement('div');
  div.textContent = `You: ${chatInput.value}`;
  chatMessages.appendChild(div);
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

// Listen for new visitor messages
socket.on('visitor_message', ({ userId, text }) => {
  if (userId === currentChatUserId) {
    let div = document.createElement('div');
    div.textContent = `Visitor: ${text}`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  fetchActiveChats();
});

// Listen for chat list updates
socket.on('update_chat_list', fetchActiveChats);

// On admin tab close, notify server
window.addEventListener('beforeunload', () => {
  if (currentChatUserId) {
    socket.emit('admin_inactive', { userId: currentChatUserId });
    adminActiveChats[currentChatUserId] = false;
  }
});

// Initial load
fetchActiveChats();

// --- Inquiries Table ---
fetch('/api/inquiries').then(res => res.json()).then(data => {
  const tbody = document.querySelector('#inquiriesTable tbody');
  tbody.innerHTML = '';
  data.forEach(row => {
    let tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.name}</td><td>${row.email}</td><td>${row.subject}</td><td>${row.message}</td><td>${new Date(row.createdAt).toLocaleString()}</td>`;
    tbody.appendChild(tr);
  });
});

// --- Appointments Table ---
fetch('/api/appointments/all').then(res => res.json()).then(data => {
  const tbody = document.querySelector('#appointmentsTable tbody');
  tbody.innerHTML = '';
  data.forEach(row => {
    let tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.name}</td><td>${row.email}</td><td>${row.phone}</td><td>${row.type}</td><td>${row.date}</td><td>${row.slot.start} - ${row.slot.end}</td><td>${row.message}</td>`;
    tbody.appendChild(tr);
  });
});
