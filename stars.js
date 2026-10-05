/**
 * Minimalist Crisp Starfield Engine for Pure Black Theme
 * Inspired by build-and-bold.lovable.app & Vanya Issar
 */
(function() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;
  let stars = [];
  let sparkles = [];
  let mouse = { x: null, y: null, targetX: 0, targetY: 0, currentX: 0, currentY: 0 };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
    initStars();
  }

  function initStars() {
    stars = [];
    sparkles = [];
    
    // Crisp white/silver background stars
    const starCount = Math.floor((width * height) / 4500);
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.2 + 0.4,
        alpha: Math.random() * 0.65 + 0.15,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        layer: Math.random() * 0.5 + 0.2
      });
    }

    // Delicate 4-point sparkle stars
    const sparkleCount = Math.floor((width * height) / 36000) + 6;
    for (let i = 0; i < sparkleCount; i++) {
      sparkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 10 + 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.006,
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
        layer: Math.random() * 0.6 + 0.3
      });
    }
  }

  function drawSparkle(x, y, radius, rotation, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    // Outer subtle white glow
    const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, radius * 1.6);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.2)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // 4-point star path
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    const rOuter = radius;
    const rInner = radius * 0.15;
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const nextAngle = angle + Math.PI / 4;
      if (i === 0) {
        ctx.moveTo(Math.cos(angle) * rOuter, Math.sin(angle) * rOuter);
      } else {
        ctx.lineTo(Math.cos(angle) * rOuter, Math.sin(angle) * rOuter);
      }
      ctx.quadraticCurveTo(0, 0, Math.cos(nextAngle) * rInner, Math.sin(nextAngle) * rInner);
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    mouse.currentX += (mouse.targetX - mouse.currentX) * 0.04;
    mouse.currentY += (mouse.targetY - mouse.currentY) * 0.04;

    // Draw micro stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      if (!prefersReducedMotion) {
        s.alpha += s.twinkleSpeed * s.twinkleDir;
        if (s.alpha > 0.85) {
          s.alpha = 0.85;
          s.twinkleDir = -1;
        } else if (s.alpha < 0.1) {
          s.alpha = 0.1;
          s.twinkleDir = 1;
        }
      }

      const px = s.x + mouse.currentX * s.layer * 20;
      const py = s.y + mouse.currentY * s.layer * 20;

      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(px, py, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw 4-point sparkles
    for (let i = 0; i < sparkles.length; i++) {
      const sp = sparkles[i];
      if (!prefersReducedMotion) {
        sp.phase += sp.pulseSpeed;
        sp.rotation += sp.rotationSpeed;
      }
      const currentAlpha = sp.alpha * (0.6 + 0.4 * Math.sin(sp.phase));
      const currentRadius = sp.size * (0.8 + 0.25 * Math.sin(sp.phase));

      const px = sp.x + mouse.currentX * sp.layer * 30;
      const py = sp.y + mouse.currentY * sp.layer * 30;

      drawSparkle(px, py, currentRadius, sp.rotation, currentAlpha);
    }

    requestAnimationFrame(render);
  }

  window.addEventListener('mousemove', function(e) {
    mouse.targetX = (e.clientX / width - 0.5);
    mouse.targetY = (e.clientY / height - 0.5);
  }, { passive: true });

  window.addEventListener('mouseleave', function() {
    mouse.targetX = 0;
    mouse.targetY = 0;
  });

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(render);
})();
