/* ===============================
   CONTACT PAGE - JAVASCRIPT
   Modern interactions & animations
   =============================== */
document.addEventListener('DOMContentLoaded', () => {
  const successBanner = document.getElementById('successBanner');
  if (successBanner) {
    successBanner.classList.remove('show');
  }
});

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
   VISIT US CARD - OPEN LOCATION
   =============================== */
const visitUsCard = document.getElementById('visitUsCard');
if (visitUsCard) {
  visitUsCard.addEventListener('click', () => {
    window.open('https://maps.app.goo.gl/JAeif6ABDCKsdBqZA', '_blank');
  });
}

/* ===============================
   SUCCESS BANNER FUNCTIONS
   =============================== */
const successBanner = document.getElementById('successBanner');
const successClose = document.getElementById('successClose');
const successMessage = document.getElementById('successMessage');
const newsletterMessage = document.getElementById('newsletterMessage');

function showSuccessBanner(isNewsletterSubscribed) {
  // Update newsletter message visibility
  if (isNewsletterSubscribed) {
    newsletterMessage.style.display = 'block';
  } else {
    newsletterMessage.style.display = 'none';
  }
  
  // Show banner
  successBanner.classList.add('show');
  
  // Auto hide after 8 seconds
  setTimeout(() => {
    hideSuccessBanner();
  }, 8000);
}

function hideSuccessBanner() {
  successBanner.classList.remove('show');
}

if (successClose) {
  successClose.addEventListener('click', hideSuccessBanner);
}

/* ===============================
   FORM VALIDATION & SUBMISSION
   =============================== */

const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation functions
const validators = {
  name: (value) => {
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    return null;
  },
  
  email: (value) => {
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },
  
  subject: (value) => {
    if (value.trim().length < 3) {
      return 'Subject must be at least 3 characters';
    }
    return null;
  },
  
  message: (value) => {
    if (value.trim().length < 10) {
      return 'Message must be at least 10 characters';
    }
    return null;
  }
};

// Show error message
function showError(fieldName, message) {
  const field = document.getElementById(fieldName);
  const errorSpan = document.getElementById(`${fieldName}-error`);
  const formGroup = field.closest('.form-group');
  
  field.classList.add('error');
  formGroup.classList.add('has-error');
  
  if (errorSpan) {
    errorSpan.textContent = message;
  }
}

// Clear error message
function clearError(fieldName) {
  const field = document.getElementById(fieldName);
  const errorSpan = document.getElementById(`${fieldName}-error`);
  const formGroup = field.closest('.form-group');
  
  field.classList.remove('error');
  formGroup.classList.remove('has-error');
  
  if (errorSpan) {
    errorSpan.textContent = '';
  }
}

// Validate field
function validateField(fieldName, value) {
  const validator = validators[fieldName];
  if (!validator) return true;
  
  const error = validator(value);
  if (error) {
    showError(fieldName, error);
    return false;
  } else {
    clearError(fieldName);
    return true;
  }
}

// Real-time validation on blur
if (contactForm) {
  const fields = ['name', 'email', 'subject', 'message'];
  
  fields.forEach(fieldName => {
    const field = document.getElementById(fieldName);
    if (field) {
      // Validate on blur
      field.addEventListener('blur', () => {
        if (field.value.trim()) {
          validateField(fieldName, field.value);
        }
      });
      
      // Clear error on input
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
          clearError(fieldName);
        }
      });
    }
  });
}

// Form submission with backend integration
if (contactForm && submitBtn) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Hide previous success message
    hideSuccessBanner();
    
    // Validate all fields
    let isValid = true;
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      company: document.getElementById('company').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
      newsletter: document.getElementById('newsletter').checked
    };
    
    // Validate required fields
    ['name', 'email', 'subject', 'message'].forEach(fieldName => {
      if (!validateField(fieldName, formData[fieldName])) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      // Scroll to first error
      const firstError = contactForm.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }
    
    // Change button state to loading
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    submitBtn.classList.add('loading');
    submitBtn.querySelector('.btn-text').textContent = 'Sending';
    submitBtn.disabled = true;
    
    try {
      // Get API URL from window config
      const apiUrl = window.API_URL || 'http://localhost:3000';
      
      // Send to backend API
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Success state
        submitBtn.classList.remove('loading');
        submitBtn.querySelector('.btn-text').textContent = 'Sent!';
        submitBtn.style.background = 'var(--success)';
        
        // Show success banner with newsletter info
        showSuccessBanner(formData.newsletter);
        // Reset form
        contactForm.reset();
        
        // Scroll to top to see banner
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.querySelector('.btn-text').textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
        
        // Analytics tracking (if needed)
        console.log('Form submitted successfully:', formData);
        
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Error state
      submitBtn.classList.remove('loading');
      submitBtn.querySelector('.btn-text').textContent = 'Error - Try Again';
      submitBtn.style.background = 'var(--error)';
      
      // Show error alert
      alert('Failed to send message. Please try again or contact us directly at auryvia.infotech@gmail.com');
      
      setTimeout(() => {
        submitBtn.querySelector('.btn-text').textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    }
  });
}

/* ===============================
   INPUT FOCUS EFFECTS
   =============================== */

const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
  // Add focus class to parent
  input.addEventListener('focus', () => {
    input.parentElement.classList.add('focused');
  });
  
  input.addEventListener('blur', () => {
    input.parentElement.classList.remove('focused');
  });
  
  // Add has-value class when input has content
  input.addEventListener('input', () => {
    if (input.value.length > 0) {
      input.parentElement.classList.add('has-value');
    } else {
      input.parentElement.classList.remove('has-value');
    }
  });
  
  // Check initial value
  if (input.value.length > 0) {
    input.parentElement.classList.add('has-value');
  }
});

/* ===============================
   SCROLL REVEAL ANIMATIONS
   =============================== */

const revealElements = document.querySelectorAll(
  '.contact-hero-content, .info-card, .contact-form-wrapper, .faq-item'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
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
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  revealObserver.observe(el);
});

/* ===============================
   INFO CARDS STAGGER ANIMATION
   =============================== */

const infoCards = document.querySelectorAll('.info-card');

infoCards.forEach((card, index) => {
  setTimeout(() => {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, index * 150);
});

/* ===============================
   FAQ ITEMS STAGGER ANIMATION
   =============================== */

const faqItems = document.querySelectorAll('.faq-item');

const faqObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        faqObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2
  }
);

faqItems.forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(30px)';
  item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  faqObserver.observe(item);
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
   RIPPLE EFFECT FOR BUTTONS
   =============================== */

const rippleButtons = document.querySelectorAll('.cta-btn, .submit-btn, .social-link');

rippleButtons.forEach(button => {
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
   CONSOLE EASTER EGG
   =============================== */

console.log(
  '%c👋 Hello Developer!',
  'font-size: 20px; font-weight: bold; color: #5865f2;'
);
console.log(
  '%cInterested in working with us? Fill out the form or email us at auryvia.infotech@gmail.com',
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
    const main = document.querySelector('.contact-hero');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Announce form state changes for screen readers
const announceFormState = (message) => {
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
   DYNAMIC YEAR IN FOOTER
   =============================== */

const yearElement = document.querySelector('.footer-legal span');
if (yearElement) {
  const currentYear = new Date().getFullYear();
  yearElement.textContent = `© ${currentYear} Ayurvia Infotech. All rights reserved.`;
}

/* ===============================
   FORM FIELD AUTOFILL DETECTION
   =============================== */

// Detect browser autofill and add class
formInputs.forEach(input => {
  // Check for autofill on animation start
  input.addEventListener('animationstart', (e) => {
    if (e.animationName === 'onAutoFillStart') {
      input.parentElement.classList.add('has-value');
    }
  });
});

// Add CSS for autofill detection
const style = document.createElement('style');
style.textContent = `
  @keyframes onAutoFillStart { from { /*dummy*/ } to { /*dummy*/ } }
  input:-webkit-autofill { animation-name: onAutoFillStart; }
`;
document.head.appendChild(style);

/* ===============================
   KEYBOARD NAVIGATION ENHANCEMENT
   =============================== */

// Allow social links to be activated with Enter/Space
const socialLinks = document.querySelectorAll('.social-link');

socialLinks.forEach(link => {
  link.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      link.click();
    }
  });
});

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
   INTERSECTION OBSERVER POLYFILL CHECK
   =============================== */

if (!('IntersectionObserver' in window)) {
  console.warn('IntersectionObserver is not supported. Consider adding a polyfill.');
  // Fallback: immediately show all elements
  revealElements.forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
}