/* ===============================
   PREMIUM AGENCY WEBSITE - JAVASCRIPT
   Modern interactions & animations
   + Cookie Banner, Welcome Banner, Chatbot, WhatsApp, Calendar
   =============================== */

/* ===============================
   COOKIE BANNER FUNCTIONALITY
   =============================== */
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieDecline = document.getElementById('cookieDecline');

function showCookieBanner() {
  const cookieConsent = localStorage.getItem('cookieConsent');
  if (!cookieConsent) {
    setTimeout(() => {
      cookieBanner.classList.add('show');
    }, 1000);
  }
}

document.querySelectorAll('.work-image img').forEach(img => {
  if (img.complete) {
    img.parentElement.classList.add('loaded');
  } else {
    img.addEventListener('load', () => {
      img.parentElement.classList.add('loaded');
    });
  }
});

function hideCookieBanner() {
  cookieBanner.classList.remove('show');
}

if (cookieAccept) {
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    hideCookieBanner();
  });
}

if (cookieDecline) {
  cookieDecline.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    hideCookieBanner();
  });
}

/* ===============================
   WELCOME BANNER WITH CONFETTI
   =============================== */
const welcomeBanner = document.getElementById('welcomeBanner');
const welcomeClose = document.getElementById('welcomeClose');
const confettiContainer = document.getElementById('confettiContainer');

function createConfetti() {
  const colors = ['#5865f2', '#00cccc', '#ff4444', '#00c853', '#ffd700'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 3 + 's';
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
    confettiContainer.appendChild(confetti);
  }
}

function showWelcomeBanner() {
  const hasVisited = sessionStorage.getItem('hasVisited');
  if (!hasVisited) {
    setTimeout(() => {
      welcomeBanner.classList.add('show');
      createConfetti();
      sessionStorage.setItem('hasVisited', 'true');
    }, 500);
  }
}

function hideWelcomeBanner() {
  welcomeBanner.classList.remove('show');
  setTimeout(() => {
    confettiContainer.innerHTML = '';
  }, 500);
}

if (welcomeClose) {
  welcomeClose.addEventListener('click', hideWelcomeBanner);
}

if (welcomeBanner) {
  welcomeBanner.addEventListener('click', (e) => {
    if (e.target === welcomeBanner) {
      hideWelcomeBanner();
    }
  });
}

/* ===============================
   CHATBOT FUNCTIONALITY
   =============================== */
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const quickReplies = document.querySelectorAll('.quick-reply');
const chatbotBadge = document.querySelector('.chatbot-badge');

let isChatbotOpen = false;

function toggleChatbot() {
  isChatbotOpen = !isChatbotOpen;
  chatbotContainer.classList.toggle('show', isChatbotOpen);
  if (isChatbotOpen && chatbotBadge) {
    chatbotBadge.style.display = 'none';
  }
}

function closeChatbot() {
  isChatbotOpen = false;
  chatbotContainer.classList.remove('show');
}

function addMessage(message, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chatbot-message ${isUser ? 'user-message' : 'bot-message'}`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  const p = document.createElement('p');
  p.textContent = message;
  
  contentDiv.appendChild(p);
  messageDiv.appendChild(contentDiv);
  chatbotMessages.appendChild(messageDiv);
  
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function getBotResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  if (message.includes('service') || message.includes('what do you do')) {
    return 'We offer Web Development, App Development, Digital Marketing, Influencer Marketing, IT Tech Solutions, and UI/UX Design. Which service interests you?';
  } else if (message.includes('project') || message.includes('start')) {
    return 'Excellent! To start a project, please book an appointment with our team. Click the "Book Meeting" button to schedule a consultation.';
  } else if (message.includes('appointment') || message.includes('meeting') || message.includes('book')) {
    setTimeout(() => {
      document.getElementById('appointmentModal').classList.add('show');
      closeChatbot();
    }, 1000);
    return 'Opening the appointment scheduler for you...';
  } else if (message.includes('price') || message.includes('cost')) {
    return 'Our pricing varies based on project requirements. Book a free consultation to discuss your specific needs and get a detailed quote.';
  } else if (message.includes('contact') || message.includes('email') || message.includes('phone')) {
    return 'You can reach us at:\n📧 contact@ayurvia.com\n📞 +91 7207310635\nOr use WhatsApp button on this page!';
  } else if (message.includes('portfolio') || message.includes('work')) {
    return 'Check out our Featured Projects section on this page! We\'ve worked with healthcare platforms, service websites, and business applications.';
  } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return 'Hello! How can I assist you today? Feel free to ask about our services, projects, or book an appointment.';
  } else if (message.includes('thank')) {
    return 'You\'re welcome! Is there anything else I can help you with?';
  } else {
    return 'I\'m here to help! You can ask me about our services, start a project, or book an appointment. What would you like to know?';
  }
}

function sendMessage() {
  const message = chatbotInput.value.trim();
  if (message) {
    addMessage(message, true);
    chatbotInput.value = '';
    
    setTimeout(() => {
      const response = getBotResponse(message);
      addMessage(response, false);
    }, 500);
  }
}

if (chatbotToggle) {
  chatbotToggle.addEventListener('click', toggleChatbot);
}

if (chatbotClose) {
  chatbotClose.addEventListener('click', closeChatbot);
}

if (chatbotSend) {
  chatbotSend.addEventListener('click', sendMessage);
}

if (chatbotInput) {
  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
}

quickReplies.forEach(button => {
  button.addEventListener('click', () => {
    const message = button.getAttribute('data-message');
    addMessage(message, true);
    
    setTimeout(() => {
      const response = getBotResponse(message);
      addMessage(response, false);
    }, 500);
  });
});

/* ===============================
   APPOINTMENT MODAL FUNCTIONALITY
   =============================== */
const appointmentModal = document.getElementById('appointmentModal');
const appointmentClose = document.getElementById('appointmentClose');
const appointmentForm = document.getElementById('appointmentForm');

function openAppointmentModal() {
  appointmentModal.classList.add('show');
}

function closeAppointmentModal() {
  appointmentModal.classList.remove('show');
}

if (appointmentClose) {
  appointmentClose.addEventListener('click', closeAppointmentModal);
}

if (appointmentModal) {
  appointmentModal.addEventListener('click', (e) => {
    if (e.target === appointmentModal) {
      closeAppointmentModal();
    }
  });
}

if (appointmentForm) {
  appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('appointmentName').value,
      email: document.getElementById('appointmentEmail').value,
      phone: document.getElementById('appointmentPhone').value,
      date: document.getElementById('appointmentDate').value,
      time: document.getElementById('appointmentTime').value,
      message: document.getElementById('appointmentMessage').value
    };
    
    console.log('Appointment Data:', formData);
    
    // Here you would typically send this data to your server
    // For now, we'll just show a success message
    alert('Thank you! Your appointment request has been submitted. We\'ll contact you shortly to confirm.');
    
    appointmentForm.reset();
    closeAppointmentModal();
  });
}

// Set minimum date for appointment to today
const appointmentDateInput = document.getElementById('appointmentDate');
if (appointmentDateInput) {
  const today = new Date().toISOString().split('T')[0];
  appointmentDateInput.setAttribute('min', today);
}

/* ===============================
   INITIALIZE ALL NEW FEATURES
   =============================== */
window.addEventListener('DOMContentLoaded', () => {
  showWelcomeBanner();
  showCookieBanner();
  
  const logo = document.getElementById('mainLogo');
  if (logo) {
    setTimeout(() => {
      logo.classList.add('play');
    }, 300);
  }
});

/* ===============================
   ORIGINAL FUNCTIONALITY (PRESERVED)
   =============================== */

/* ===============================
   HEADER SCROLL EFFECT
   =============================== */
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

/* ===============================
   MENU TOGGLE (HAMBURGER)
   =============================== */

const hamburger = document.getElementById('hamburger');
const menuPanel = document.getElementById('menuPanel');
const menuBackdrop = document.getElementById('menuBackdrop');
const menuClose = document.getElementById('menuClose');

function openMenu() {
  menuPanel.classList.add('active');
  menuBackdrop.classList.add('active');
  hamburger.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Accessibility
  hamburger.setAttribute('aria-expanded', 'true');
  menuPanel.setAttribute('aria-hidden', 'false');
  menuBackdrop.setAttribute('aria-hidden', 'false');
  
  // Focus trap
  menuClose.focus();
}

function closeMenu() {
  menuPanel.classList.remove('active');
  menuBackdrop.classList.remove('active');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
  
  // Accessibility
  hamburger.setAttribute('aria-expanded', 'false');
  menuPanel.setAttribute('aria-hidden', 'true');
  menuBackdrop.setAttribute('aria-hidden', 'true');
  
  // Return focus to hamburger
  hamburger.focus();
}

if (hamburger) hamburger.addEventListener('click', openMenu);
if (menuClose) menuClose.addEventListener('click', closeMenu);
if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (menuPanel.classList.contains('active')) {
      closeMenu();
    }
    if (isChatbotOpen) {
      closeChatbot();
    }
    if (appointmentModal.classList.contains('show')) {
      closeAppointmentModal();
    }
    if (welcomeBanner.classList.contains('show')) {
      hideWelcomeBanner();
    }
  }
});

// Close menu when clicking menu links
const menuLinks = document.querySelectorAll('.menu-link');
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

/* ===============================
   TRUST MARQUEE ANIMATION
   =============================== */
const trustTrack = document.getElementById('trustTrack');

// Pause animation on hover
if (trustTrack) {
  trustTrack.addEventListener('mouseenter', () => {
    trustTrack.style.animationPlayState = 'paused';
  });
  
  trustTrack.addEventListener('mouseleave', () => {
    trustTrack.style.animationPlayState = 'running';
  });
}

/* ===============================
   SCROLL REVEAL (INTERSECTION OBSERVER)
   =============================== */

const revealElements = document.querySelectorAll(
  '.hero-content, .trust-inner, .services-inner, .work-inner, .final-cta-inner, .clients-header, .clients-stats'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  }
);

revealElements.forEach(el => {
  el.classList.add('reveal-hidden');
  revealObserver.observe(el);
});

/* ===============================
   WORK ITEMS PREMIUM ANIMATION
   =============================== */

const workItems = document.querySelectorAll('.work-item');

// Spotlight mouse tracking effect
workItems.forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    item.style.setProperty('--mouse-x', `${x}%`);
    item.style.setProperty('--mouse-y', `${y}%`);
  });
});

const workObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 150);
        workObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1
  }
);

workItems.forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(30px)';
  item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  workObserver.observe(item);
});

/* ===============================
   SERVICE CARDS HOVER EFFECT
   =============================== */

const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.background = 'rgba(255, 255, 255, 1)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.background = 'var(--white)';
  });
});

/* ===============================
   SMOOTH SCROLL (ANCHORS)
   =============================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Don't prevent default for empty hash
    if (href === '#' || href === '#!') {
      e.preventDefault();
      return;
    }
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      
      const headerOffset = 100;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      closeMenu();
    }
  });
});

/* ===============================
   CTA BUTTONS RIPPLE EFFECT
   =============================== */

const ctaButtons = document.querySelectorAll('.cta-btn, .hero-cta, .final-cta-btn, .cta-primary');

ctaButtons.forEach(button => {
  button.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    Object.assign(ripple.style, {
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.6)',
      transform: 'scale(0)',
      animation: 'ripple 0.6s ease-out',
      pointerEvents: 'none'
    });
    
    this.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

/* ===============================
   STATS COUNTER ANIMATION
   =============================== */

const statNumbers = document.querySelectorAll('.stat-number');

const animateCounter = (element) => {
  const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;
  
  const updateCounter = () => {
    current += increment;
    if (current < target) {
      const value = Math.floor(current);
      element.textContent = value + (element.textContent.includes('+') ? '+' : '');
      requestAnimationFrame(updateCounter);
    } else {
      // Restore original format
      const originalText = element.getAttribute('data-original');
      if (originalText) {
        element.textContent = originalText;
      }
    }
  };
  
  // Store original text
  element.setAttribute('data-original', element.textContent);
  updateCounter();
};

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.5
  }
);

statNumbers.forEach(stat => {
  statsObserver.observe(stat);
});

/* ===============================
   PARALLAX EFFECT ON SCROLL
   =============================== */

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.hero-badge, .clients-badge');
  
  parallaxElements.forEach(el => {
    const speed = 0.3;
    el.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

/* ===============================
   LAZY LOAD IMAGES (IF IMPLEMENTED)
   =============================== */

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

/* ===============================
   CONSOLE EASTER EGG
   =============================== */

console.log(
  '%c👋 Hello Developer!',
  'font-size: 20px; font-weight: bold; color: #5865f2;'
);
console.log(
  '%cInterested in working with us? Get in touch at contact@ayurvia.com',
  'font-size: 14px; color: #333;'
);

/* ===============================
   PERFORMANCE OPTIMIZATION
   =============================== */

// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimize scroll listener
const optimizedScroll = debounce(() => {
  // Scroll-based logic runs here
}, 100);

window.addEventListener('scroll', optimizedScroll);

/* ===============================
   PRELOADER (IF NEEDED)
   =============================== */

window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 1000);
  }
});

/* ===============================
   ACCESSIBILITY ENHANCEMENTS
   =============================== */

// Skip to main content
const skipLink = document.querySelector('.skip-link');
if (skipLink) {
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const main = document.querySelector('main') || document.querySelector('.hero');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Announce page changes for screen readers
const announcePageChange = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    announcement.remove();
  }, 1000);
};

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    
    // Basic validation
    let isValid = true;
    const requiredFields = contactForm.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    });
    
    if (isValid) {
      // Submit form (implement your submission logic)
      console.log('Form submitted successfully');
      announcePageChange('Form submitted successfully');
      contactForm.reset();
    } else {
      announcePageChange('Please fill in all required fields');
    }
  });
}

const yearElement = document.querySelector('.footer-legal span');
if (yearElement) {
  const currentYear = new Date().getFullYear();
  yearElement.textContent = `© ${currentYear} Ayurvia Infotech. All rights reserved.`;
}