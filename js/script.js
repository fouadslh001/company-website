// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initVideoPlayer();
    initScrollAnimations();
    initImageErrorHandling();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                
                // Reset hamburger menu
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Header background on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.9)';
        }
    });
}

// Video player functionality
function initVideoPlayer() {
    const video = document.getElementById('hero-video');
    const videoContainer = document.querySelector('.hero-video');
    
    if (video) {
        // Handle video loading errors
        video.addEventListener('error', function(e) {
            console.error('Video failed to load:', e);
            showVideoError();
        });

        // Handle video loading
        video.addEventListener('loadstart', function() {
            console.log('Video loading started');
        });

        video.addEventListener('canplay', function() {
            console.log('Video can start playing');
            hideVideoError();
        });

        // Handle video ended (loop fallback)
        video.addEventListener('ended', function() {
            video.currentTime = 0;
            video.play().catch(e => {
                console.error('Video autoplay failed:', e);
            });
        });

        // Attempt to play video (handle autoplay restrictions)
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Autoplay prevented:', error);
                // Video autoplay was prevented
                // Show play button or handle gracefully
                video.muted = true;
                video.play().catch(e => {
                    console.error('Muted autoplay also failed:', e);
                    showVideoError();
                });
            });
        }

        // Add click to play/pause functionality
        videoContainer.addEventListener('click', function(e) {
            if (e.target === video || e.target === videoContainer) {
                if (video.paused) {
                    video.play().catch(e => console.error('Play failed:', e));
                } else {
                    video.pause();
                }
            }
        });

        // Handle visibility change (pause when tab is not active)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                video.pause();
            } else {
                video.play().catch(e => console.error('Resume play failed:', e));
            }
        });
    }
}

// Show video error message
function showVideoError() {
    const videoContainer = document.querySelector('.hero-video');
    let errorDiv = videoContainer.querySelector('.video-error');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'video-error';
        errorDiv.innerHTML = `
            <h3>Video Unavailable</h3>
            <p>The background video could not be loaded. The page will continue to function normally.</p>
        `;
        videoContainer.appendChild(errorDiv);
    }
    
    errorDiv.style.display = 'block';
}

// Hide video error message
function hideVideoError() {
    const errorDiv = document.querySelector('.video-error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements and observe them
    const animateElements = document.querySelectorAll('.service-card, .brand-item, .contact-item, .about-text, .welcome-text, .ceo-section');
    
    animateElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// Image error handling
function initImageErrorHandling() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
            
            // Create a placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'image-error';
            placeholder.style.width = this.offsetWidth + 'px' || '200px';
            placeholder.style.height = this.offsetHeight + 'px' || '100px';
            placeholder.textContent = 'Image not available';
            
            // Replace the image with placeholder
            if (this.parentNode) {
                this.parentNode.insertBefore(placeholder, this);
                this.style.display = 'none';
            }
        });

        // Handle successful image load
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });

        // Set initial opacity for fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
}

// Utility function for smooth scrolling
function smoothScrollTo(targetPosition, duration = 1000) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Handle form submissions (if any forms are added later)
function handleFormSubmission(formElement) {
    formElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Add form handling logic here
        console.log('Form submitted');
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for your message. We will get back to you soon.';
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(successMessage);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    });
}

// Performance optimization: Lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Error boundary for JavaScript errors
window.addEventListener('error', function(e) {
    console.error('JavaScript error occurred:', e.error);
    
    // Optionally show user-friendly error message
    // Don't show technical errors to users in production
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault(); // Prevent the default browser behavior
});

// Resize handler for responsive adjustments
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Handle any resize-specific logic here
        console.log('Window resized');
    }, 250);
});

// Page visibility API for performance optimization
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause any animations or videos
        console.log('Page hidden');
    } else {
        // Page is visible, resume animations or videos
        console.log('Page visible');
    }
});
