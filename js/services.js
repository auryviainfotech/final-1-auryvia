/* ===============================
   SERVICES PAGE - JAVASCRIPT
   Modern interactions & animations
   =============================== */

/* ===============================
   LOGO ANIMATION ON LOAD
   =============================== */
window.addEventListener('DOMContentLoaded', () => {
  const logo = document.getElementById('mainLogo');
  if (logo) {
    setTimeout(() => {
      logo.classList.add('play');
    }, 300);
  }
});

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
  if (e.key === 'Escape' && menuPanel.classList.contains('active')) {
    closeMenu();
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
   SERVICE CARD SCROLL TO DETAIL
   =============================== */
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
  card.addEventListener('click', () => {
    const targetId = card.getAttribute('data-target');
    const section = document.getElementById(targetId);

    if (section) {
      const headerOffset = 120;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/* ===============================
   SERVICE CARD HOVER EFFECTS
   =============================== */
serviceCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    // Add subtle scale effect
    this.style.transform = 'translateY(-8px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

/* ===============================
   SCROLL REVEAL (INTERSECTION OBSERVER)
   =============================== */

const revealElements = document.querySelectorAll(
  '.services-hero-content, .service-card, .service-detail, .process-step, .final-cta-inner'
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
   SERVICE CARDS STAGGER ANIMATION
   =============================== */

const serviceCardsForAnimation = document.querySelectorAll('.service-card');

const serviceCardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        serviceCardObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1
  }
);

serviceCardsForAnimation.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  serviceCardObserver.observe(card);
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
      
      const headerOffset = 120;
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

const ctaButtons = document.querySelectorAll('.cta-btn, .final-cta-btn, .service-card');

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
   PROCESS STEP ANIMATION
   =============================== */

const processSteps = document.querySelectorAll('.process-step');

const processObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 150);
        processObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2
  }
);

processSteps.forEach(step => {
  step.style.opacity = '0';
  step.style.transform = 'translateY(30px)';
  step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  processObserver.observe(step);
});

/* ===============================
   FEATURE ITEMS HOVER EFFECT
   =============================== */

const featureItems = document.querySelectorAll('.feature-item');

featureItems.forEach(item => {
  item.addEventListener('mouseenter', function() {
    this.style.transform = 'translateX(8px)';
  });
  
  item.addEventListener('mouseleave', function() {
    this.style.transform = 'translateX(0)';
  });
});

/* ===============================
   DETAIL BADGE ANIMATION
   =============================== */

const detailBadges = document.querySelectorAll('.detail-badge');

const badgeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'scale(1)';
        badgeObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.5
  }
);

detailBadges.forEach(badge => {
  badge.style.opacity = '0';
  badge.style.transform = 'scale(0.8)';
  badge.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  badgeObserver.observe(badge);
});

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
  // Additional scroll-based logic can run here
}, 100);

window.addEventListener('scroll', optimizedScroll);

/* ===============================
   ACCESSIBILITY ENHANCEMENTS
   =============================== */

// Skip to main content
const skipLink = document.querySelector('.skip-link');
if (skipLink) {
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const main = document.querySelector('.services-hero');
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

/* ===============================
   ACTIVE SERVICE HIGHLIGHT
   =============================== */

// Highlight active service section in viewport
const serviceDetails = document.querySelectorAll('.service-detail');

const highlightObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Find corresponding service card
        const targetId = entry.target.id;
        const correspondingCard = document.querySelector(`[data-target="${targetId}"]`);
        
        // Remove active class from all cards
        serviceCards.forEach(card => card.classList.remove('active-section'));
        
        // Add active class to corresponding card
        if (correspondingCard) {
          correspondingCard.classList.add('active-section');
        }
      }
    });
  },
  {
    threshold: 0.3,
    rootMargin: '-100px 0px -60% 0px'
  }
);

serviceDetails.forEach(detail => {
  highlightObserver.observe(detail);
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
   DYNAMIC YEAR IN FOOTER
   =============================== */

const yearElement = document.querySelector('.footer-legal span');
if (yearElement) {
  const currentYear = new Date().getFullYear();
  yearElement.textContent = `© ${currentYear} Ayurvia Infotech. All rights reserved.`;
}

/* ===============================
   BACK TO TOP BUTTON (OPTIONAL)
   =============================== */

// Uncomment to enable back to top button
/*
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '↑';
backToTopBtn.className = 'back-to-top';
backToTopBtn.setAttribute('aria-label', 'Back to top');
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 500) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
*/

/* ===============================
   KEYBOARD NAVIGATION ENHANCEMENT
   =============================== */

// Allow service cards to be activated with Enter/Space
serviceCards.forEach(card => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

/* ===============================
   FORM VALIDATION (IF CONTACT FORM EXISTS)
   =============================== */

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

/* ===============================
   INTERSECTION OBSERVER POLYFILL CHECK
   =============================== */

if (!('IntersectionObserver' in window)) {
  console.warn('IntersectionObserver is not supported. Consider adding a polyfill.');
  // Fallback: immediately show all elements
  revealElements.forEach(el => {
    el.classList.add('reveal-visible');
  });
}