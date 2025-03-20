// DOM elements cache
const header = document.getElementById('header');
const skillsGrid = document.querySelector('.skills-grid');
const skillCards = document.querySelectorAll('.skill-card');
const showMoreBtn = document.getElementById('show-more-skills');
const testimonialsSlider = document.getElementById('testimonials-slider');
const prevBtn = document.getElementById('prev-testimonial');
const nextBtn = document.getElementById('next-testimonial');
const animatedElements = document.querySelectorAll('.animate-fadeIn, .animate-slideLeft, .animate-slideRight');
const sectionTitles = document.querySelectorAll('.section-title');
const contactForm = document.querySelector('.contact-form');

// Testimonial slider variables
let currentSlide = 0;
const totalSlides = document.querySelectorAll('.testimonial').length;
let testimonialInterval;

// Performance optimization: Throttle scroll events
function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}

// Handle show more/less for skills section
function updateSkillCards() {
  if (!skillsGrid || !showMoreBtn) return;
  
  // Get computed styles to determine how many cards are in a row
  const gridComputedStyle = window.getComputedStyle(skillsGrid);
  const gridTemplateColumns = gridComputedStyle.getPropertyValue('grid-template-columns');
  const columnsCount = gridTemplateColumns.split(' ').length;
  
  // Cards to show initially (2 rows)
  const cardsToShow = columnsCount * 2;
  
  // Hide cards beyond the first 2 rows
  skillCards.forEach((card, index) => {
    if (index >= cardsToShow) {
      card.classList.add('hidden');
    }
  });
  
  // Show/hide the button if there are cards to hide
  if (skillCards.length <= cardsToShow) {
    showMoreBtn.style.display = 'none';
  } else {
    showMoreBtn.style.display = 'inline-flex';
  }
}

// Toggle show more/less
function toggleShowMore() {
  showMoreBtn.classList.toggle('active');
  
  if (showMoreBtn.classList.contains('active')) {
    // Show all cards with quick sequential animation
    skillCards.forEach((card, index) => {
      if (card.classList.contains('hidden')) {
        card.classList.remove('hidden');
        
        // Override any existing animation delays with faster ones
        const originalDelay = card.style.animationDelay || '0s';
        
        // Store original delay as data attribute for later restoration
        card.dataset.originalDelay = originalDelay;
        
        // Apply quick sequential animation delay based on position
        const quickDelay = 0.05 * (index % 4); // Stagger by groups of 4
        card.style.animationDelay = `${quickDelay}s`;
        card.style.animationPlayState = 'running';
        card.style.opacity = '0';
        
        // Force a reflow to restart the animation
        void card.offsetWidth;
        card.style.opacity = '';
      }
    });
    showMoreBtn.innerHTML = 'Show Less <span class="arrow-down">↓</span>';
  } else {
    // Hide cards beyond the first 2 rows
    const gridComputedStyle = window.getComputedStyle(skillsGrid);
    const gridTemplateColumns = gridComputedStyle.getPropertyValue('grid-template-columns');
    const columnsCount = gridTemplateColumns.split(' ').length;
    const cardsToShow = columnsCount * 2;
    
    skillCards.forEach((card, index) => {
      // Restore original animation delay
      if (card.dataset.originalDelay) {
        card.style.animationDelay = card.dataset.originalDelay;
      }
      
      if (index >= cardsToShow) {
        card.classList.add('hidden');
      }
    });
    
    showMoreBtn.innerHTML = 'Show More <span class="arrow-down">↓</span>';
  }
}

// Scroll header effect
function handleScroll() {
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  checkIfInView();
}

// Animated counter with more efficient implementation
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  counters.forEach(counter => {
    const targetText = counter.textContent;
    const hasPlus = targetText.includes('+');
    const targetValue = parseFloat(targetText.replace('+', ''));
    const duration = 1500; // ms
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    
    let frame = 0;
    let currentValue = 0;
    
    // Use requestAnimationFrame for smoother animation
    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      
      // Ease in-out function for smoother animation
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
      currentValue = Math.ceil(ease * targetValue);
      counter.textContent = currentValue + (hasPlus ? '+' : '');
      
      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        counter.textContent = targetText;
      }
    };
    
    requestAnimationFrame(animate);
  });
}

// Check if elements are in viewport for animations
function checkIfInView() {
  const windowHeight = window.innerHeight;
  const windowTop = window.scrollY;
  const windowBottom = windowTop + windowHeight;
  
  // Handle animated elements
  animatedElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top + windowTop;
    const elementBottom = elementTop + element.offsetHeight;
    
    if (elementTop <= windowBottom - 100 && elementBottom >= windowTop) {
      element.style.animationDelay = element.getAttribute('style') ? element.getAttribute('style').replace('animation-delay: ', '') : '0s';
      element.style.animationPlayState = 'running';
    }
  });
  
  // Handle section titles
  sectionTitles.forEach(title => {
    const titleTop = title.getBoundingClientRect().top + windowTop;
    
    if (titleTop <= windowBottom - 100) {
      title.classList.add('visible');
    }
  });
}

// Go to specific testimonial slide
function goToSlide(slideIndex) {
  if (slideIndex < 0) {
    currentSlide = totalSlides - 1;
  } else if (slideIndex >= totalSlides) {
    currentSlide = 0;
  } else {
    currentSlide = slideIndex;
  }
  
  if (testimonialsSlider) {
    testimonialsSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
  }
}

// Handle smooth scrolling for internal links
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Handle form submission
function setupFormSubmission() {
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('.submit-btn');
    submitBtn.textContent = 'Sending...';
    
    setTimeout(() => {
      submitBtn.textContent = 'Not yet implemented!';
      window.location.href = "mailto:studiopvppro@gmail.org";
      contactForm.reset();
      
      setTimeout(() => {
        submitBtn.textContent = 'Send Message';
      }, 3000);
    }, 1500);
  });
}

// Initialize intersection observer for counters
function setupIntersectionObservers() {
  const aboutSection = document.getElementById('about');
  
  if (!aboutSection) return;
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  });
  
  observer.observe(aboutSection);
}

// Initialize auto-slide for testimonials
function startTestimonialAutoSlide() {
  if (testimonialsSlider) {
    // Clear any existing interval before starting a new one
    if (testimonialInterval) {
      clearInterval(testimonialInterval);
    }
    
    testimonialInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5000);
  }
}

// Load event listeners
function setupEventListeners() {
  // Throttled scroll event
  window.addEventListener('scroll', throttle(handleScroll, 100));
  
  // Resize event (throttled)
  window.addEventListener('resize', throttle(updateSkillCards, 200));
  
  // Show more button
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', toggleShowMore);
  }
  
  // Testimonial navigation
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      
      // Reset auto-slide timer when user interacts
      if (testimonialInterval) {
        clearInterval(testimonialInterval);
        startTestimonialAutoSlide();
      }
    });
    
    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      
      // Reset auto-slide timer when user interacts
      if (testimonialInterval) {
        clearInterval(testimonialInterval);
        startTestimonialAutoSlide();
      }
    });
  }
}

// Preload critical images
function preloadCriticalImages() {
  const imagesToPreload = ['favicon.png'];
  
  imagesToPreload.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Preload critical images
  preloadCriticalImages();
  
  // Initialize UI components
  updateSkillCards();
  checkIfInView();
  setupSmoothScrolling();
  setupFormSubmission();
  setupIntersectionObservers();
  startTestimonialAutoSlide();
  setupEventListeners();
});