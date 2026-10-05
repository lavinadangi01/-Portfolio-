/**
 * Lavina Dangi Portfolio — Interactive Application Logic
 */

document.addEventListener('DOMContentLoaded', function() {
  // 1. Sticky Header
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // 2. Mobile Menu Toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', function() {
      mobileDrawer.classList.toggle('open');
      mobileBtn.textContent = mobileDrawer.classList.contains('open') ? '✕' : '☰';
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileBtn.textContent = '☰';
      });
    });
  }

  // 3. Dynamic Typing Effect for Hero Tagline
  const roles = [
    "Computer Science Student @ JECRC",
    "Creative Marketing Intern",
    "Shopify Developer (112+ Assets)",
    "Founder @ Zipp"
  ];
  const typingTarget = document.getElementById('typing-role');
  if (typingTarget) {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeLoop() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typingTarget.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingTarget.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 110;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 2200; // Pause at full word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400; // Pause before typing new word
      }

      setTimeout(typeLoop, typingSpeed);
    }
    typeLoop();
  }

  // 4. Scroll Reveal via Intersection Observer
  const revealElements = document.querySelectorAll('.reveal-fade');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // 5. Active Link Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', function() {
    let currentId = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // 6. 3D Tilt Effect on Framed Profile Card
  const profileCard = document.querySelector('.profile-card');
  if (profileCard) {
    profileCard.addEventListener('mousemove', function(e) {
      const rect = profileCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      profileCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    profileCard.addEventListener('mouseleave', function() {
      profileCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  }

  // 7. Interactive Contact Form Submission with Toast
  const contactForm = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status-msg');

  if (contactForm && statusMsg) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending Message...</span> <span style="animation: spinSlow 1s linear infinite;">✦</span>`;

      // Simulate sending with clean client feedback
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        statusMsg.className = 'form-status-msg success';
        statusMsg.innerHTML = `✨ <strong>Message sent successfully!</strong> Thank you for reaching out. I'll get back to you shortly!`;
        contactForm.reset();

        setTimeout(() => {
          statusMsg.style.display = 'none';
        }, 8000);
      }, 1000);
    });
  }

  // 8. Modal Management (Pixellab Media & Zipp)
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Close modals on clicking backdrop
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(overlay => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });
});
