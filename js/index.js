/* ===============================
   3D TILT EFFECT LOGIC
   =============================== */
const tiltCards = document.querySelectorAll('.premium-card');

if(tiltCards.length > 0) {
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; 
      const y = e.clientY - rect.top;
            
      // Subtle Tilt Calculation
      const xRotate = -((y - rect.height / 2) / 25); 
      const yRotate = (x - rect.width / 2) / 25;
            
      card.style.transform = `perspective(1000px) rotateX(${xRotate}deg) rotateY(${yRotate}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}
/* ===============================
   PREMIUM AGENCY WEBSITE - JAVASCRIPT
   COMPLETE VERSION - ALL FEATURES WORKING
   =============================== */

/* ===============================
   GLOBAL SCROLL SPEED CONFIG
   =============================== */
const SCROLL_SPEED = {
  services: 0.5,
  servicesHover: 0.08,
  trustedScroll: 0.35,
  trustedHover: 0.12,
  workThrottle: 700
};

/* ===============================
   COOKIE BANNER
   =============================== */
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieDecline = document.getElementById('cookieDecline');

if (cookieBanner && !sessionStorage.getItem('cookieConsent')) {
  setTimeout(() => cookieBanner.classList.add('show'), 1000);
}

cookieAccept?.addEventListener('click', () => {
  sessionStorage.setItem('cookieConsent', 'accepted');
  cookieBanner.classList.remove('show');
});

cookieDecline?.addEventListener('click', () => {
  sessionStorage.setItem('cookieConsent', 'declined');
  cookieBanner.classList.remove('show');
});

/* ===============================
   WELCOME BANNER
   =============================== */
const welcomeBanner = document.getElementById('welcomeBanner');
const welcomeClose = document.getElementById('welcomeClose');

if (welcomeBanner && !sessionStorage.getItem('hasVisited')) {
  setTimeout(() => {
    welcomeBanner.classList.add('show');
    sessionStorage.setItem('hasVisited', 'true');
  }, 500);
}

welcomeClose?.addEventListener('click', () =>
  welcomeBanner.classList.remove('show')
);

/* ===============================
   2. CHATBOT & USER LOGIN SYSTEM
   =============================== */
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const chatbotMessages = document.getElementById('chatbotMessages');

// Login Elements
const loginModal = document.getElementById('loginModal');
const visitorNameInput = document.getElementById('visitorName');
const visitorEmailInput = document.getElementById('visitorEmail');
const visitorLoginBtn = document.getElementById('visitorLoginBtn');

let socket = null;
let currentUser = null;

// 1. CHECK LOGIN STATUS ON LOAD
const storedUser = sessionStorage.getItem('ayurviaUser');

if (storedUser) {
    // User is already logged in -> Connect immediately
    currentUser = JSON.parse(storedUser);
    connectSocket(currentUser);
}
// Note: Login modal will only show when user clicks chatbot toggle

// 2. HANDLE LOGIN CLICK
function isGmailAddress(email) {
    if (!email || typeof email !== 'string') return false;
    const trimmed = email.trim().toLowerCase();
    return trimmed.endsWith('@gmail.com');
}

if(visitorLoginBtn) {
    visitorLoginBtn.addEventListener('click', () => {
        const name = visitorNameInput.value.trim();
        const email = visitorEmailInput.value.trim();

        if(!name || !email) {
            alert("Please fill in both fields.");
            return;
        }

        if (!isGmailAddress(email)) {
            alert("Please enter a valid Gmail address. Only addresses ending in @gmail.com are accepted.");
            return;
        }

        // Save to Session
        currentUser = { name, email };
        sessionStorage.setItem('ayurviaUser', JSON.stringify(currentUser));
        
        // Hide Modal & Connect
        loginModal.style.display = 'none';
        connectSocket(currentUser);
        
        // Automatically open chatbot after login
        if (chatbotContainer) chatbotContainer.classList.add('show');
    });
}

// 3. CONNECT TO SERVER
function connectSocket(user) {
    if (typeof io !== 'undefined') {
        socket = io();
        // 1. Send User Data to Server
        socket.emit('user_join', user);
        // 2. Listen for Real-time Messages
        socket.on('receive_message', (data) => {
            addMessageToUI(data.text, 'bot-message');
        });
        // 3. NEW: Listen for Chat History (Restore old chat)
        socket.on('chat_history', (messages) => {
            const box = document.getElementById('chatbotMessages');
            if(box) {
                box.innerHTML = ''; // Clear the default "Welcome" message
                messages.forEach(msg => {
                    // Determine style: 'user' -> right side, 'bot'/'admin' -> left side
                    let className = 'bot-message';
                    if (msg.sender === 'user') className = 'user-message';
                    addMessageToUI(msg.text, className);
                });
            }
        });
    }
}

// Toggle UI - Show login modal if not logged in, otherwise show chatbot
if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
        // Check if user is logged in
        const storedUser = sessionStorage.getItem('ayurviaUser');
        
        if (!storedUser) {
            // User not logged in -> Show login modal
            if(loginModal) loginModal.style.display = 'flex';
        } else {
            // User is logged in -> Show chatbot
            if (chatbotContainer) chatbotContainer.classList.add('show');
        }
    });
}
if (chatbotClose) chatbotClose.addEventListener('click', () => chatbotContainer.classList.remove('show'));

function sendMessage() {
    const text = chatbotInput.value.trim();
    if (!text) return;
    addMessageToUI(text, 'user-message');
    if (socket) socket.emit('send_message', { message: text });
    chatbotInput.value = '';
}

if (chatbotSend) chatbotSend.addEventListener('click', sendMessage);
if (chatbotInput) chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function addMessageToUI(text, className) {
    if (!chatbotMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chatbot-message', className);
    msgDiv.innerHTML = `<div class="message-content"><p>${text}</p></div>`;
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// --- Chatbot Quick Replies ---
document.querySelectorAll('.chatbot-quick-replies .quick-reply').forEach(btn => {
  btn.addEventListener('click', function() {
    const msg = btn.getAttribute('data-message');
    if (msg && chatbotInput) {
      chatbotInput.value = msg;
      sendMessage();
    }
  });
});

/* ===============================
   WORK CAROUSEL (CIRCULAR)
   =============================== */
const workCarousel = document.getElementById('workCarousel');
const workSlides = document.querySelectorAll('.work-slide');
const workIndicatorsContainer = document.getElementById('workIndicators');
const prevSlideBtn = document.getElementById('prevSlide');
const nextSlideBtn = document.getElementById('nextSlide');

let currentSlide = 0;
const totalSlides = workSlides.length;
let autoplayInterval;

workSlides.forEach((_, index) => {
  const indicator = document.createElement('div');
  indicator.className = 'work-indicator';
  indicator.addEventListener('click', () => goToSlide(index));
  workIndicatorsContainer.appendChild(indicator);
});

const indicators = document.querySelectorAll('.work-indicator');

function updateSlides() {
  workSlides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentSlide);
    slide.classList.toggle('prev', i < currentSlide);
  });
  indicators.forEach((i, idx) =>
    i.classList.toggle('active', idx === currentSlide)
  );
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlides();
  resetAutoplay();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlides();
  resetAutoplay();
}

function goToSlide(i) {
  currentSlide = i;
  updateSlides();
  resetAutoplay();
}

function startAutoplay() {
  autoplayInterval = setInterval(nextSlide, 5000);
}

function resetAutoplay() {
  clearInterval(autoplayInterval);
  startAutoplay();
}

prevSlideBtn?.addEventListener('click', prevSlide);
nextSlideBtn?.addEventListener('click', nextSlide);

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

let touchStartX = 0;
let touchEndX = 0;

workCarousel?.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});
workCarousel?.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchEndX < touchStartX - 50) nextSlide();
  if (touchEndX > touchStartX + 50) prevSlide();
});

startAutoplay();

/* ===============================
   FEATURED PROJECTS – SMOOTH SCROLL LOCK
   =============================== */
const workSection = document.getElementById('work');
let workActive = false;
let lastScrollTime = 0;
let isScrollLocked = false;

if (workSection && window.innerWidth >= 1024) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      workActive = entry.isIntersecting;
      if (!workActive) {
        isScrollLocked = false;
      }
    },
    { threshold: 0.5 }
  );
  
  observer.observe(workSection);

  window.addEventListener('wheel', (e) => {
    if (!workActive) return;

    const now = Date.now();
    if (now - lastScrollTime < SCROLL_SPEED.workThrottle) {
      e.preventDefault();
      return;
    }

    if (e.deltaY > 0) {
      if (currentSlide < totalSlides - 1) {
        e.preventDefault();
        nextSlide();
        lastScrollTime = now;
        isScrollLocked = true;
      } else {
        isScrollLocked = false;
      }
    } else if (e.deltaY < 0) {
      if (currentSlide > 0) {
        e.preventDefault();
        prevSlide();
        lastScrollTime = now;
        isScrollLocked = true;
      } else {
        isScrollLocked = false;
      }
    }
  }, { passive: false });
}

/* ===============================
   SERVICES – AUTO + CURSOR SCROLL
   =============================== */
const servicesWrapper = document.querySelector('.services-scroll-wrapper');
const servicesGrid = document.getElementById('servicesGrid');

if (servicesWrapper && servicesGrid) {
  const items = [...servicesGrid.children];
  items.forEach(el => servicesGrid.appendChild(el.cloneNode(true)));

  let scrollPosition = 0;
  let isHovering = false;

  function autoScroll() {
    if (!isHovering) {
      scrollPosition += SCROLL_SPEED.services;
      servicesWrapper.scrollLeft = scrollPosition;

      if (scrollPosition >= servicesGrid.scrollWidth / 2) {
        scrollPosition = 0;
        servicesWrapper.scrollLeft = 0;
      }
    }
    requestAnimationFrame(autoScroll);
  }

  autoScroll();

  servicesWrapper.addEventListener('mouseenter', () => {
    isHovering = true;
  });

  servicesWrapper.addEventListener('mousemove', e => {
    isHovering = true;
    const rect = servicesWrapper.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const target = (servicesGrid.scrollWidth / 2) * percent;

    scrollPosition = scrollPosition + (target - scrollPosition) * SCROLL_SPEED.servicesHover;
    servicesWrapper.scrollLeft = scrollPosition;
  });

  servicesWrapper.addEventListener('mouseleave', () => {
    isHovering = false;
  });
}

/* ===============================
   TRUSTED BY – AUTO + HOVER SCROLL (FIXED)
   =============================== */
const trustTrack = document.getElementById('trustTrack');

if (trustTrack) {
  let trustScrollPos = 0;
  let isTrustHovering = false;

  function autoTrustScroll() {
    if (!isTrustHovering) {
      trustScrollPos += SCROLL_SPEED.trustedScroll;
      trustTrack.scrollLeft = trustScrollPos;

      if (trustScrollPos >= trustTrack.scrollWidth / 2) {
        trustScrollPos = 0;
        trustTrack.scrollLeft = 0;
      }
    }
    requestAnimationFrame(autoTrustScroll);
  }

  autoTrustScroll();

  trustTrack.addEventListener('mouseenter', () => {
    isTrustHovering = true;
  });

  trustTrack.addEventListener('mousemove', (e) => {
    isTrustHovering = true;
    const rect = trustTrack.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const target = (trustTrack.scrollWidth / 2) * percent;

    trustScrollPos = trustScrollPos + (target - trustScrollPos) * SCROLL_SPEED.trustedHover;
    trustTrack.scrollLeft = trustScrollPos;
  });

  trustTrack.addEventListener('mouseleave', () => {
    isTrustHovering = false;
  });
}

/* ===============================
   STATS COUNTER
   =============================== */
const statNumbers = document.querySelectorAll('.stat-number');

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.done) {
      entry.target.dataset.done = 'true';
      const target = parseInt(entry.target.textContent);
      let current = 0;
      const step = target / 100;

      const run = () => {
        current += step;
        if (current < target) {
          entry.target.textContent = Math.floor(current);
          requestAnimationFrame(run);
        } else {
          entry.target.textContent = target;
        }
      };
      run();
    }
  });
});

statNumbers.forEach(n => statsObserver.observe(n));

/* ===============================
   MENU TOGGLE
   =============================== */
const hamburger = document.getElementById('hamburger');
const menuPanel = document.getElementById('menuPanel');
const menuBackdrop = document.getElementById('menuBackdrop');
const menuClose = document.getElementById('menuClose');

hamburger?.addEventListener('click', () => {
  menuPanel.classList.add('active');
  menuBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
});

menuClose?.addEventListener('click', closeMenu);
menuBackdrop?.addEventListener('click', closeMenu);

function closeMenu() {
  menuPanel.classList.remove('active');
  menuBackdrop.classList.remove('active');
  document.body.style.overflow = '';
}

/* ===============================
   FOOTER YEAR
   =============================== */
const yearEl = document.querySelector('.footer-legal span');
if (yearEl) {
  yearEl.textContent = `© ${new Date().getFullYear()} Ayurvia Infotech. All rights reserved.`;
}

/* ===============================
   APPOINTMENT BOOKING SYSTEM
   =============================== */

let selectedAppointmentType = null;
let selectedAppointmentDate = null;
let selectedAppointmentSlot = null;

const appointmentModal = document.getElementById('appointmentModal');
const appointmentBackdrop = document.getElementById('appointmentBackdrop');
const appointmentFloatBtn = document.getElementById('appointmentFloatBtn');
const appointmentCloseBtn = document.getElementById('appointmentClose');
const appointmentForm = document.getElementById('appointmentForm');
const meetingTypeButtons = document.querySelectorAll('.meeting-type-btn');
const appointmentDateInput = document.getElementById('appointmentDate');
const timeSlotsContainer = document.getElementById('timeSlots');

/* ===============================
   APPOINTMENT RULES ENGINE
   =============================== */

const APPOINTMENT_RULES = {
  zoom: {
    duration: 60,
    startHour: 10,
    endHour: 17,
    lunchBlocked: true,
    allowLunch: false,
    gapAfter: 0
  },
  inperson: {
    duration: 120,
    startHour: 10,
    endHour: 17,
    lunchBlocked: true,
    allowLunch: false,
    gapAfter: 60
  },
  telecall: {
    duration: 60,
    startHour: 10,
    endHour: 21,
    lunchBlocked: false,
    allowLunch: true,
    gapAfter: 0
  }
};

const BUSINESS_DAYS = [1, 2, 3, 4, 5];
const LUNCH_START = 13;
const LUNCH_END = 15;

function isBusinessDay(date) {
  return BUSINESS_DAYS.includes(date.getDay());
}

function formatTime(totalMinutes) {
  let hours = Math.floor(totalMinutes / 60);
  let minutes = totalMinutes % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;
  minutes = minutes.toString().padStart(2, '0');

  return `${hours}:${minutes} ${ampm}`;
}

function generateAppointmentSlots(type, date) {
  if (!APPOINTMENT_RULES[type]) return [];
  if (!isBusinessDay(date)) return [];

  const rule = APPOINTMENT_RULES[type];
  const slots = [];

  let currentMinutes = rule.startHour * 60;
  const endMinutes = rule.endHour * 60;
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

  while (currentMinutes + rule.duration <= endMinutes) {
    // Skip past slots if today
    if (isToday && currentMinutes < currentTotalMinutes) {
      currentMinutes += rule.duration + rule.gapAfter;
      continue;
    }
    const hour = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;

    const slotStart = hour + minutes / 60;
    const slotEnd = slotStart + rule.duration / 60;

    if (
      rule.lunchBlocked &&
      slotStart < LUNCH_END &&
      slotEnd > LUNCH_START
    ) {
      currentMinutes = LUNCH_END * 60;
      continue;
    }

    slots.push({
      start: formatTime(currentMinutes),
      end: formatTime(currentMinutes + rule.duration)
    });

    currentMinutes += rule.duration + rule.gapAfter;
  }

  return slots;
}

function renderAppointmentSlots() {
  if (!timeSlotsContainer) return;

  timeSlotsContainer.innerHTML = '';
  selectedAppointmentSlot = null;

  if (!selectedAppointmentType || !selectedAppointmentDate) {
    timeSlotsContainer.innerHTML =
      '<p class="slot-hint">Select meeting type and date to see available slots</p>';
    return;
  }

  const slots = generateAppointmentSlots(
    selectedAppointmentType,
    new Date(selectedAppointmentDate)
  );

  if (slots.length === 0) {
    timeSlotsContainer.innerHTML =
      '<p class="no-slots">No slots available for this date. Please select a business day (Mon-Fri).</p>';
    return;
  }

  slots.forEach(slot => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'time-slot-btn';
    btn.textContent = `${slot.start} — ${slot.end}`;

    btn.addEventListener('click', () => {
      document
        .querySelectorAll('.time-slot-btn')
        .forEach(b => b.classList.remove('active'));

      btn.classList.add('active');
      selectedAppointmentSlot = slot;
    });

    timeSlotsContainer.appendChild(btn);
  });
}

function initializeDatePicker() {
  if (!appointmentDateInput) return;
  
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  
  appointmentDateInput.min = `${yyyy}-${mm}-${dd}`;

  // Disable weekends visually and block selection
  appointmentDateInput.addEventListener('input', (e) => {
    const date = new Date(e.target.value);
    if (date.getDay() === 0 || date.getDay() === 6) {
      alert('We do not accept appointments on Saturday or Sunday. Please select a weekday.');
      e.target.value = '';
      renderAppointmentSlots();
    }
  });
}

function openAppointmentModal() {
  appointmentModal?.classList.add('show');
  appointmentBackdrop?.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeAppointmentModal() {
  appointmentModal?.classList.remove('show');
  appointmentBackdrop?.classList.remove('show');
  document.body.style.overflow = '';
}

/* ===============================
   APPOINTMENT EVENT LISTENERS
   =============================== */

appointmentFloatBtn?.addEventListener('click', openAppointmentModal);

appointmentCloseBtn?.addEventListener('click', closeAppointmentModal);

appointmentBackdrop?.addEventListener('click', closeAppointmentModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && appointmentModal?.classList.contains('show')) {
    closeAppointmentModal();
  }
});

meetingTypeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    meetingTypeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    selectedAppointmentType = btn.dataset.type;
    renderAppointmentSlots();
  });
});

appointmentDateInput?.addEventListener('change', (e) => {
  selectedAppointmentDate = e.target.value;
  renderAppointmentSlots();
});

appointmentForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!selectedAppointmentType) {
    alert('Please select a meeting type');
    return;
  }

  if (!selectedAppointmentDate) {
    alert('Please select a date');
    return;
  }

  if (!selectedAppointmentSlot) {
    alert('Please select a time slot');
    return;
  }

  const appointmentData = {
    name: document.getElementById('appointmentName').value,
    email: document.getElementById('appointmentEmail').value,
    phone: document.getElementById('appointmentPhone').value,
    type: selectedAppointmentType,
    date: selectedAppointmentDate,
    slot: selectedAppointmentSlot,
    message: document.getElementById('appointmentMessage').value || 'No additional message'
  };

  try {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });

    const result = await response.json();

    if (result.success) {
      alert('Appointment request submitted successfully!\n\nWe will contact you shortly to confirm your booking.');
      
      appointmentForm.reset();
      meetingTypeButtons.forEach(b => b.classList.remove('active'));
      selectedAppointmentType = null;
      selectedAppointmentDate = null;
      selectedAppointmentSlot = null;
      renderAppointmentSlots();
      
      closeAppointmentModal();
    } else {
      alert('Failed to book appointment. Please try again.');
    }
  } catch (error) {
    console.error('Error submitting appointment:', error);
    alert('Failed to book appointment. Please try again later.');
  }
});

initializeDatePicker();

// This function runs automatically when you log in with Google
window.handleGoogleLogin = (response) => {
    // Decode the token
    const responsePayload = decodeJwt(response.credential);
    console.log("✅ Google User Verified:", responsePayload.name);

    // Log them in
    completeLogin({
        name: responsePayload.name,
        email: responsePayload.email
    });
};

// Helper: Decode JWT
function decodeJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Helper: Complete Login
function completeLogin(user) {
    if (!user.name || !user.email) return;
    currentUser = user;
    sessionStorage.setItem('ayurviaUser', JSON.stringify(user));
    if (document.getElementById('loginModal')) {
        document.getElementById('loginModal').style.display = 'none';
    }
    // Connect to chat
    connectSocket(user);
    // Automatically open chatbot after login
    if (chatbotContainer) chatbotContainer.classList.add('show');
}

/* ===============================
   GOOGLE SIGN-IN INITIALIZATION
   =============================== */
/* 
   HOW TO GET YOUR GOOGLE CLIENT ID:
   1. Go to https://console.cloud.google.com/
   2. Create a new project or select an existing one
   3. Enable "Google+ API" or "Google Identity Services"
   4. Go to "Credentials" in the left sidebar
   5. Click "Create Credentials" > "OAuth 2.0 Client ID"
   6. Select "Web application"
   7. Add your website URL to "Authorized JavaScript origins"
      - For local testing: http://localhost:3000 (or your port)
      - For production: https://yourdomain.com
   8. Add redirect URIs if needed
   9. Copy the Client ID and paste it below
*/
function initializeGoogleSignIn() {
    // Wait for Google API to load
    if (typeof google === 'undefined' || !google.accounts) {
        setTimeout(initializeGoogleSignIn, 100);
        return;
    }

    // Initialize Google Sign-In
    google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Replace with your actual Client ID from Google Cloud Console
        callback: window.handleGoogleLogin,
        auto_select: false,
        cancel_on_tap_outside: true
    });

    // Render the button
    const container = document.getElementById('googleSignInBtnContainer');
    if (container) {
        google.accounts.id.renderButton(
            container,
            {
                theme: 'outline',
                size: 'large',
                width: container.offsetWidth || 350,
                text: 'continue_with',
                shape: 'rectangular',
                logo_alignment: 'left'
            }
        );
    }
}

// Initialize Google Sign-In when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGoogleSignIn);
} else {
    initializeGoogleSignIn();
}

/* ===============================
   SPLIT SCROLL OBSERVER (Fixed & Reliable)
   =============================== */
const projectItems = document.querySelectorAll('.project-item');
const dynamicTitle = document.getElementById('dynamicTitle');
const dynamicCat = document.getElementById('dynamicCat');

if (projectItems.length > 0 && dynamicTitle) {
    
  const observerOptions = {
    root: null,
    // This creates a narrow "trigger zone" in the middle of the screen.
    // The event fires immediately when an image enters this zone.
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Only run logic if the element is entering the center zone
      if (entry.isIntersecting) {
        const newTitle = entry.target.getAttribute('data-title');
        const newCat = entry.target.getAttribute('data-cat');

        // Only update if the content is actually different
        if (dynamicTitle.textContent !== newTitle) {
          // Smooth fade-out
          dynamicTitle.style.opacity = '0';
          dynamicCat.style.opacity = '0';

          // Wait for fade-out, then update text and fade-in
          setTimeout(() => {
            dynamicTitle.textContent = newTitle;
            dynamicCat.textContent = newCat;
            dynamicTitle.style.opacity = '1';
            dynamicCat.style.opacity = '1';
          }, 300); // Match the CSS transition time
        }
      }
    });
  }, observerOptions);

  projectItems.forEach(item => observer.observe(item));
}
