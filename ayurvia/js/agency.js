/* ===============================
   ABOUT US PAGE - JAVASCRIPT
   Enhanced interactions & animations
   =============================== */

/* ===============================
   ANIMATED COUNTER FOR STATS
   =============================== */
const animateValue = (element, start, end, duration, suffix = '') => {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      element.textContent = end + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, 16);
};

/* ===============================
   SCROLL REVEAL ANIMATIONS
   =============================== */
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const revealOnScroll = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 100);
      revealOnScroll.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply to all major sections
const revealElements = document.querySelectorAll(
  '.about-hero-inner, .about-story-inner, .values-header, .value-card, .team-header, .team-member, .process-header, .process-step, .about-cta-inner'
);

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  revealOnScroll.observe(el);
});

/* ===============================
   VALUE CARDS STAGGER ANIMATION
   =============================== */
const valueCards = document.querySelectorAll('.value-card');

const valueObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 150);
      valueObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

valueCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(40px)';
  valueObserver.observe(card);
});

// Add visible class styles dynamically
valueCards.forEach(card => {
  card.addEventListener('animationend', () => {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  });
});

/* ===============================
   TEAM MEMBER CARDS ANIMATION
   =============================== */
const teamMembers = document.querySelectorAll('.team-member');

const teamObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'scale(1)';
      }, index * 120);
      teamObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

teamMembers.forEach(member => {
  member.style.opacity = '0';
  member.style.transform = 'scale(0.9)';
  member.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
  teamObserver.observe(member);
});

/* ===============================
   PROCESS TIMELINE PROGRESSIVE REVEAL
   =============================== */
const processSteps = document.querySelectorAll('.process-step');

const processObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      
      // Animate the number with rotation
      const stepNumber = entry.target.querySelector('.step-number');
      if (stepNumber) {
        stepNumber.style.animation = 'revealNumber 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
      }
      
      processObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

processSteps.forEach((step, index) => {
  step.style.opacity = '0';
  step.style.transform = 'translateX(-30px)';
  step.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  
  // Add delay based on index
  step.style.transitionDelay = `${index * 0.15}s`;
  
  processObserver.observe(step);
});

// Add the animation styles dynamically
const style = document.createElement('style');
style.textContent = `
  .process-step.revealed {
    opacity: 1 !important;
    transform: translateX(0) !important;
  }
  
  @keyframes revealNumber {
    0% {
      opacity: 0;
      transform: scale(0.5) rotate(-180deg);
    }
    100% {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
  }
`;
document.head.appendChild(style);

/* ===============================
   STORY IMAGES PARALLAX EFFECT
   =============================== */
const storyImages = document.querySelectorAll('.story-img');

window.addEventListener('scroll', () => {
  if (window.innerWidth > 768) {
    const scrolled = window.pageYOffset;
    
    storyImages.forEach((img, index) => {
      const rect = img.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        const speed = 0.05 * (index + 1);
        const yPos = -(scrolled - rect.top) * speed;
        img.style.transform = `translateY(${yPos}px)`;
      }
    });
  }
});

/* ===============================
   SMOOTH HOVER EFFECTS FOR IMAGES
   =============================== */
storyImages.forEach(img => {
  img.addEventListener('mouseenter', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;
    
    this.style.transform = `perspective(1000px) rotateY(${deltaX * 5}deg) rotateX(${-deltaY * 5}deg) scale(1.05)`;
  });
  
  img.addEventListener('mouseleave', function() {
    this.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
  });
});

/* ===============================
   BADGE PULSE ANIMATION
   =============================== */
const heroBadge = document.querySelector('.about-hero-badge');

if (heroBadge) {
  setInterval(() => {
    heroBadge.style.animation = 'none';
    setTimeout(() => {
      heroBadge.style.animation = 'badgePulse 2s ease-in-out';
    }, 10);
  }, 5000);
}

/* ===============================
   VALUE CARDS TILT EFFECT
   =============================== */
valueCards.forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;
    
    this.style.transform = `perspective(1000px) rotateY(${deltaX * 3}deg) rotateX(${-deltaY * 3}deg) translateY(-8px)`;
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)';
  });
});

/* ===============================
   TEAM MEMBER PHOTO ANIMATION
   =============================== */
teamMembers.forEach(member => {
  const photo = member.querySelector('.member-photo');
  
  member.addEventListener('mouseenter', function() {
    photo.style.transform = 'scale(1.15) rotate(5deg)';
  });
  
  member.addEventListener('mouseleave', function() {
    photo.style.transform = 'scale(1) rotate(0deg)';
  });
});

/* ===============================
   CTA BUTTON ENHANCED EFFECT
   =============================== */
const ctaButton = document.querySelector('.about-cta-btn');

if (ctaButton) {
  ctaButton.addEventListener('mouseenter', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.left = e.clientX - rect.left + 'px';
    ripple.style.top = e.clientY - rect.top + 'px';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.animation = 'ctaRipple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';
    
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
}

// Add ripple animation
const ctaStyle = document.createElement('style');
ctaStyle.textContent = `
  @keyframes ctaRipple {
    0% {
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      width: 300px;
      height: 300px;
      opacity: 0;
    }
  }
`;
document.head.appendChild(ctaStyle);

/* ===============================
   SECTION ENTRANCE ANIMATIONS
   =============================== */
const sections = document.querySelectorAll('.about-hero, .about-story, .about-values, .about-team, .about-process, .about-cta');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('section-visible');
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => {
  section.classList.add('section-hidden');
  sectionObserver.observe(section);
});

// Add section animation styles
const sectionStyle = document.createElement('style');
sectionStyle.textContent = `
  .section-hidden {
    opacity: 0;
    transform: translateY(20px);
  }
  
  .section-visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
`;
document.head.appendChild(sectionStyle);

/* ===============================
   PERFORMANCE OPTIMIZATION
   =============================== */

// Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
  
  scrollTimeout = window.requestAnimationFrame(() => {
    // Scroll-based animations run here
  });
});

// Lazy load images if they exist
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
        }
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '50px' });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

/* ===============================
   ACCESSIBILITY ENHANCEMENTS
   =============================== */

// Focus management for keyboard users
const focusableElements = document.querySelectorAll(
  'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
);

focusableElements.forEach(el => {
  el.addEventListener('focus', function() {
    this.style.outline = '2px solid var(--primary)';
    this.style.outlineOffset = '4px';
  });
  
  el.addEventListener('blur', function() {
    this.style.outline = '';
    this.style.outlineOffset = '';
  });
});

// Announce page load for screen readers
const announcePageLoad = () => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  announcement.textContent = 'About Us page loaded successfully';
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    announcement.remove();
  }, 1000);
};

// Call on page load
window.addEventListener('load', announcePageLoad);

/* ===============================
   CONSOLE MESSAGE
   =============================== */
console.log(
  '%c✨ About Auryvia Infotech',
  'font-size: 24px; font-weight: bold; color: #5865f2; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);'
);
console.log(
  '%cInterested in joining our team? Send your portfolio to careers@auryvia.com',
  'font-size: 14px; color: #333; font-weight: 500;'
);

/* ===============================
   PRELOAD CRITICAL RESOURCES
   =============================== */
window.addEventListener('DOMContentLoaded', () => {
  // Preload any critical images or resources here
  const criticalImages = [
    // Add image paths if needed
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
});

/* ===============================
   DYNAMIC COPYRIGHT YEAR
   =============================== */
const copyrightYear = document.getElementById('copyrightYear');
if (copyrightYear) {
  const currentYear = new Date().getFullYear();
  copyrightYear.textContent = `© ${currentYear} Auryvia Infotech. All rights reserved.`;
}