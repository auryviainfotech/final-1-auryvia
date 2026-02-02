/* ===============================
   WORK PAGE - JAVASCRIPT
   Enhanced interactions & animations
   =============================== */

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
        entry.target.classList.add('work-visible');
        entry.target.classList.remove('work-hidden');
      }, index * 100);
      revealOnScroll.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply to all major sections
const revealElements = document.querySelectorAll(
  '.work-hero-inner, .featured-project, .gallery-header, .approach-header'
);

revealElements.forEach(el => {
  el.classList.add('work-hidden');
  revealOnScroll.observe(el);
});

/* ===============================
   PROJECT CARDS STAGGER ANIMATION
   =============================== */
const projectCards = document.querySelectorAll('.project-card');

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 120);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

projectCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  cardObserver.observe(card);
});

/* ===============================
   APPROACH STEPS ANIMATION
   =============================== */
const approachSteps = document.querySelectorAll('.approach-step');

const stepObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 150);
      stepObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

approachSteps.forEach(step => {
  step.style.opacity = '0';
  step.style.transform = 'translateY(30px)';
  step.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  stepObserver.observe(step);
});

/* ===============================
   FEATURED PROJECT INTERACTION
   =============================== */
const featuredMedia = document.querySelector('.featured-media');

if (featuredMedia) {
  featuredMedia.addEventListener('click', function() {
    // Add click animation
    this.style.transform = 'scale(0.98)';
    setTimeout(() => {
      this.style.transform = '';
    }, 200);
    
    // In a real implementation, this would open a project detail page or modal
    console.log('Featured project clicked');
  });
}

/* ===============================
   PROJECT CARD TILT EFFECT
   =============================== */
projectCards.forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;
    
    this.style.transform = `perspective(1000px) rotateY(${deltaX * 3}deg) rotateX(${-deltaY * 3}deg) translateY(-12px)`;
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)';
  });
  
  card.addEventListener('click', function() {
    const category = this.dataset.category;
    console.log(`Project clicked: ${category}`);
    // In a real implementation, navigate to project detail page
  });
});

/* ===============================
   TECH TAGS INTERACTION
   =============================== */
const techTags = document.querySelectorAll('.tech-tag');

techTags.forEach(tag => {
  tag.addEventListener('click', function(e) {
    e.stopPropagation();
    
    // Visual feedback
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = '';
    }, 150);
    
    const techName = this.textContent;
    console.log(`Filter by technology: ${techName}`);
    // In a real implementation, filter projects by technology
  });
});

/* ===============================
   HIGHLIGHT ITEMS HOVER EFFECT
   =============================== */
const highlightItems = document.querySelectorAll('.highlight-item');

highlightItems.forEach(item => {
  item.addEventListener('mouseenter', function() {
    const icon = this.querySelector('svg');
    if (icon) {
      icon.style.transform = 'scale(1.2) rotate(5deg)';
      icon.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
  });
  
  item.addEventListener('mouseleave', function() {
    const icon = this.querySelector('svg');
    if (icon) {
      icon.style.transform = 'scale(1) rotate(0deg)';
    }
  });
});

/* ===============================
   APPROACH STEP ICON ANIMATION
   =============================== */
approachSteps.forEach(step => {
  const icon = step.querySelector('.step-icon');
  
  step.addEventListener('mouseenter', function() {
    if (icon) {
      const svg = icon.querySelector('svg');
      if (svg) {
        svg.style.animation = 'iconBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      }
    }
  });
  
  step.addEventListener('mouseleave', function() {
    if (icon) {
      const svg = icon.querySelector('svg');
      if (svg) {
        svg.style.animation = '';
      }
    }
  });
});

// Add icon bounce animation
const style = document.createElement('style');
style.textContent = `
  @keyframes iconBounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }
`;
document.head.appendChild(style);

/* ===============================
   PARALLAX EFFECT ON SCROLL
   =============================== */
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      parallaxEffect();
      ticking = false;
    });
    ticking = true;
  }
});

function parallaxEffect() {
  const scrolled = window.pageYOffset;
  
  // Parallax for hero badge
  const heroBadge = document.querySelector('.work-hero-badge');
  if (heroBadge) {
    const speed = 0.3;
    heroBadge.style.transform = `translateY(${scrolled * speed}px)`;
  }
  
  // Parallax for featured project
  if (window.innerWidth > 768) {
    const featuredImage = document.querySelector('.featured-image');
    if (featuredImage) {
      const rect = featuredImage.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const speed = 0.05;
        const yPos = -(scrolled - rect.top) * speed;
        featuredImage.style.transform = `translateY(${yPos}px) scale(1.1)`;
      }
    }
  }
}

/* ===============================
   PROJECT STATUS BADGE ANIMATION
   =============================== */
const statusBadges = document.querySelectorAll('.project-status.new');

statusBadges.forEach(badge => {
  setInterval(() => {
    badge.style.animation = 'none';
    setTimeout(() => {
      badge.style.animation = 'badgePulse 2s ease-in-out';
    }, 10);
  }, 3000);
});

// Add badge pulse animation
const badgeStyle = document.createElement('style');
badgeStyle.textContent = `
  @keyframes badgePulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(88, 101, 242, 0.3);
    }
  }
`;
document.head.appendChild(badgeStyle);

/* ===============================
   CTA BUTTON RIPPLE EFFECT
   =============================== */
const ctaButton = document.querySelector('.work-cta-btn');

if (ctaButton) {
  ctaButton.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.left = e.clientX - rect.left + 'px';
    ripple.style.top = e.clientY - rect.top + 'px';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.animation = 'rippleEffect 0.6s ease-out';
    ripple.style.pointerEvents = 'none';
    
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
}

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleEffect {
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
document.head.appendChild(rippleStyle);

/* ===============================
   CATEGORY FILTER (PLACEHOLDER)
   =============================== */
function filterProjects(category) {
  console.log(`Filtering projects by: ${category}`);
  
  projectCards.forEach(card => {
    const cardCategory = card.dataset.category;
    
    if (category === 'all' || cardCategory === category) {
      card.style.display = 'block';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 10);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });
}

/* ===============================
   SMOOTH SCROLL FOR INTERNAL LINKS
   =============================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
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
    }
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
   PERFORMANCE OPTIMIZATION
   =============================== */

// Debounce function for resize events
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

// Optimize resize listener
const optimizedResize = debounce(() => {
  // Reset transforms on mobile
  if (window.innerWidth <= 768) {
    projectCards.forEach(card => {
      card.style.transform = '';
    });
  }
}, 250);

window.addEventListener('resize', optimizedResize);

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
  announcement.textContent = 'Work page loaded successfully. Explore our portfolio of projects.';
  
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
  '%c✨ Explore Our Work',
  'font-size: 24px; font-weight: bold; color: #5865f2; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);'
);
console.log(
  '%cLike what you see? Let\'s discuss your project at contact@auryvia.com',
  'font-size: 14px; color: #333; font-weight: 500;'
);

/* ===============================
   DYNAMIC COPYRIGHT YEAR
   =============================== */
const copyrightYear = document.getElementById('copyrightYear');
if (copyrightYear) {
  const currentYear = new Date().getFullYear();
  copyrightYear.textContent = `© ${currentYear} Auryvia Infotech. All rights reserved.`;
}

/* ===============================
   VIEW PROJECT ANALYTICS (PLACEHOLDER)
   =============================== */
function trackProjectView(projectName) {
  console.log(`Project viewed: ${projectName}`);
  // In a real implementation, send analytics event
}

// Track featured project views
if (featuredMedia) {
  const featuredObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        trackProjectView('Patient Management System');
        featuredObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  featuredObserver.observe(featuredMedia);
}