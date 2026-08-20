// ============ NEURAL NETWORK PARTICLE SYSTEM ============
(function() {
  const canvas = document.getElementById('neural-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const PARTICLE_COUNT = Math.min(80, Math.floor(window.innerWidth / 18));
  const CONNECTION_DIST = 160;
  const MOUSE_DIST = 200;

  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.r = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_DIST) {
        const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.02;
        this.vx += dx * force;
        this.vy += dy * force;
      }
      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(129, 140, 248, 0.6)';
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
})();

// ============ SCROLL PROGRESS BAR ============
(function() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    bar.style.transform = `scaleX(${Math.min(scrolled, 1)})`;
  });
})();

// ============ NAV SCROLL EFFECT ============
(function() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
})();

// ============ SCROLL REVEAL ============
(function() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));
})();

// ============ TYPEWRITER EFFECT ============
(function() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const text = el.getAttribute('data-text');
  el.textContent = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, 40 + Math.random() * 30);
    }
  }
  setTimeout(type, 800);
})();

// ============ COUNTER ANIMATION ============
(function() {
  const counters = document.querySelectorAll('.stat-value[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        const target = entry.target.getAttribute('data-count');
        const suffix = entry.target.getAttribute('data-suffix') || '';
        const num = parseInt(target);
        const duration = 1500;
        const start = performance.now();
        function step(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          entry.target.textContent = Math.floor(eased * num) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
})();

// ============ SMOOTH SCROLL FOR NAV LINKS ============
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
